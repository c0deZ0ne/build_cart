import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User, UserType } from 'src/modules/user/models/user.model';
import { Project } from '../project/models/project.model';
import { AdminCreateProject } from './dto/adminCreateProject';
import { Sequelize } from 'sequelize-typescript';

import {
  SharedProject,
  SharedProjectStatus,
} from '../shared-project/models/shared-project.model';
import { InvitationService } from '../invitation/invitation.service';
import { adminShareProjectDto as adminShareProjectDto } from './dto/adminShareProjectDto';
import { MyProject } from '../my-project/models/myProjects.model';
import { Contract, ContractStatus } from '../contract/models';
import { Order } from '../order/models';
import { RfqQuote, RfqRequest } from '../rfq/models';
import { OrderService } from '../order/order.services';
import { Builder } from '../builder/models/builder.model';
import { FundManager } from '../fund-manager/models/fundManager.model';

@Injectable()
export class AdminProjectService {
  constructor(
    @InjectModel(Project)
    private readonly projectModel: typeof Project,
    @InjectModel(Contract)
    private readonly contractModel: typeof Contract,
    @InjectModel(Order)
    private readonly orderModel: typeof Order,
    @InjectModel(SharedProject)
    private readonly sharedProjectModel: typeof SharedProject,
    @InjectModel(MyProject)
    private readonly myProjectModel: typeof MyProject,
    @InjectModel(User)
    private readonly userModel: typeof User,
    @InjectModel(Builder)
    private readonly builderModel: typeof Builder,
    @InjectModel(FundManager)
    private readonly fundManagerModel: typeof FundManager,
    private readonly orderService: OrderService,
    private readonly sequelize: Sequelize,
    private readonly invitationService: InvitationService,
  ) {}

  async AdminCreateProjectForSponsor(data: AdminCreateProject) {
    const { title, budgetAmount, fundManagerEmail, customerEmail } = data;
    const user = await this.userModel.findOne({
      where: { email: fundManagerEmail },
    });
    if (!user) throw new BadRequestException(`FundManager not found`);
    if (user.userType !== UserType.FUND_MANAGER)
      throw new BadRequestException(`User is not a fundManager`);
    const builder = await this.userModel.findOne({
      where: { email: customerEmail },
    });
    const dbTransaction = await this.sequelize.transaction();
    const newProject = await this.projectModel.create(
      {
        title,
        budgetAmount,
        CreatedById: user.id,
        ownerId: user.id,
        isFunded: budgetAmount ? true : false,
        fundedAt: budgetAmount ? new Date() : null,
        amountLeft: budgetAmount ? budgetAmount : 0,
        // FundManagerId: user.FundManagerId,
      },
      { transaction: dbTransaction },
    );
    const sharedProject = await this.sharedProjectModel.findOne({
      where: {
        FundManagerId: user.FundManagerId,
        BuilderId: builder?.BuilderId ? builder?.BuilderId : null,
        ProjectId: newProject.id,
        buyerEmail: customerEmail,
        fundManagerEmail: fundManagerEmail,
      },
    });

    try {
      if (sharedProject)
        throw new BadRequestException(`Project already shared`);
      if (!builder) {
        const data = {
          buyerEmail: customerEmail,
          fundManagerName: user.name,
          buyerName: customerEmail,
          FundManagerId: user.FundManagerId,
        };
        const newSharedData = await this.sharedProjectModel.create(
          {
            email: customerEmail,
            ProjectId: newProject.id,
            CreatedById: user.id,
            FundManagerId: user.FundManagerId,
            BuilderId: null,
            buyerEmail: customerEmail,
            fundManagerEmail: fundManagerEmail,
            status: SharedProjectStatus.ACCEPTED,
          },
          { transaction: dbTransaction },
        );
        await this.myProjectModel.create(
          {
            UserId: user.id,
            SharedProjectId: newSharedData.id,
          },
          { transaction: dbTransaction },
        );
        await this.invitationService.createInvitation(data, user);
        await dbTransaction.commit();
        return newProject;
      } else {
        const newSharedData = await this.sharedProjectModel.create(
          {
            email: customerEmail,
            ProjectId: newProject.id,
            CreatedById: user.id,
            FundManagerId: user.FundManagerId,
            BuilderId: builder.BuilderId,
            status: SharedProjectStatus.ACCEPTED,
            buyerEmail: customerEmail,
            fundManagerEmail: fundManagerEmail,
          },
          { transaction: dbTransaction },
        );
        await this.myProjectModel.create(
          {
            UserId: user.id,
            SharedProjectId: newSharedData.id,
          },
          { transaction: dbTransaction },
        );
        await dbTransaction.commit();
        return newProject;
      }
    } catch (error) {
      dbTransaction.rollback();
      throw new BadRequestException(error.message);
    }
  }

  async adminShareProject(data: adminShareProjectDto) {
    const { fromEmail, toEmail, ProjectId } = data;
    const fundManager = await this.fundManagerModel.findOne({
      where: { email: fromEmail },
    });
    const user = await this.userModel.findOne({
      where: { email: fromEmail },
    });
    if (!fundManager) throw new BadRequestException(`FundManager not found`);
    const builder = await this.builderModel.findOne({
      where: { email: toEmail },
    });
    const dbTransaction = await this.sequelize.transaction();
    const sharedProject = await this.sharedProjectModel.findOne({
      where: {
        FundManagerId: fundManager.id,
        BuilderId: builder?.id || null,
        ProjectId: ProjectId,
      },
    });

    try {
      if (sharedProject)
        throw new BadRequestException(`Project already shared`);
      if (!builder) {
        const data = {
          buyerEmail: toEmail,
          fundManagerName: fundManager.businessName,
          buyerName: toEmail,
          FundManagerId: fundManager.id,
        };
        const newSharedData = await this.sharedProjectModel.create(
          {
            email: toEmail,
            ProjectId: ProjectId,
            CreatedById: user.id,
            FundManagerId: fundManager.id,
            buyerEmail: toEmail,
            fundManagerEmail: fundManager.email,
            BuilderId: null,
            status: SharedProjectStatus.ACCEPTED,
          },
          { transaction: dbTransaction },
        );

        await this.myProjectModel.create(
          {
            UserId: user.id,
            SharedProjectId: newSharedData.id,
          },
          { transaction: dbTransaction },
        );
        await this.invitationService.createInvitation(data, user);
        await dbTransaction.commit();
        return sharedProject;
      } else {
        await this.sharedProjectModel.create(
          {
            email: toEmail,
            ProjectId,
            CreatedById: user.id,
            FundManagerId: fundManager.id,
            BuilderId: builder.id,
            status: SharedProjectStatus.ACCEPTED,
            buyerEmail: builder.email,
            fundManagerEmail: fundManager.email,
          },
          { transaction: dbTransaction },
        );
        await dbTransaction.commit();
        return sharedProject;
      }
    } catch (error) {
      dbTransaction.rollback();
      throw new BadRequestException(error.message);
    }
  }

  async adminSponsorCustomerList(email: string) {
    const fundManager = await this.fundManagerModel.findOne({
      where: { email },
    });

    const share = await this.sharedProjectModel.findAll({
      where: {
        FundManagerId: fundManager.id,
        status: SharedProjectStatus.ACCEPTED,
      },
      include: [Builder],
    });

    const customerProjectsMap = new Map<
      string,
      {
        numberOfProjects: number;
        buyerName: string | null;
        buyerEmail: string | null;
        builderId: string | null;
        fundManagerId: string;
      }
    >();

    share.forEach((element) => {
      const customerEmail = element?.Builder?.email
        ? element?.Builder?.email
        : element?.email
        ? element?.email
        : element?.Builder?.email;
      const numberOfProjects = customerProjectsMap.has(customerEmail)
        ? customerProjectsMap.get(customerEmail)?.numberOfProjects + 1
        : 1;

      const buyerName = customerProjectsMap.has(customerEmail)
        ? customerProjectsMap.get(customerEmail)?.buyerName
        : element?.Builder
        ? element.Builder.businessName
        : null;
      const builderId = customerProjectsMap.has(customerEmail)
        ? customerProjectsMap.get(customerEmail)?.builderId
        : element?.BuilderId
        ? element?.Builder?.id
        : null;

      customerProjectsMap.set(customerEmail, {
        numberOfProjects,
        buyerName,
        buyerEmail: element.email,
        builderId,
        fundManagerId: fundManager.id,
      });
    });

    const result = Array.from(customerProjectsMap.values()).map(
      ({
        numberOfProjects,
        buyerName,
        buyerEmail,
        builderId,
        fundManagerId,
      }) => ({
        numberOfProjects,
        customerName: buyerName,
        customerEmail: buyerEmail,
        fundManagerId,
        builderId: builderId,
      }),
    );
    const filteredData = result.filter(
      (element) => element.customerName !== null,
    );
    return filteredData;
  }

  async adminBuilderFundManagerProjectDetails({
    BuilderId,
    FundManagerId,
  }: {
    BuilderId: string;
    FundManagerId: string;
  }) {
    const sharedProjects = await this.sharedProjectModel.findAll({
      where: {
        FundManagerId,
        BuilderId,
        status: SharedProjectStatus.ACCEPTED,
      },
      include: [
        {
          model: Project,
          include: [
            { model: User, as: 'CreatedBy', attributes: ['name', 'email'] },
          ],
        },
        Builder,
        FundManager,
      ],
    });
    const result = sharedProjects.map((element) => ({
      title: element.Project.title,
      createdAt: element.Project.createdAt,
      budgetAmount: element.Project.budgetAmount,
      amountSpent: element.Project.amountSpent,
      amountLeft: element.Project.budgetAmount,
      isFunded: element.Project.isFunded,
      id: element.Project.id,
      owner: element.Project.Owner,
    }));
    return result;
  }

  async getAdminAllProjects({ user }: { user: User }) {
    return await this.projectModel.findAll({ include: [{ all: true }] });
  }

  /**
   * @param ProjectId the project id to get details
   * returns an object of project details
   */
  async adminGetProjectDetails({
    projectId,
    user,
  }: {
    projectId: string;
    user?: User;
  }) {
    try {
      let completed = 0;
      let inProgress = 0;
      let cancelled = 0;
      const procurementOverview = new Array(12).fill(0);

      const orderDetails = await this.orderService.getProjectOrderDetails(
        projectId,
      );
      const projectContracts = await this.contractModel.findAll({
        where: {
          ProjectId: projectId,
        },
        include: [
          { model: RfqQuote },
          { model: RfqRequest, include: [{ model: RfqQuote }] },
        ],
      });

      projectContracts?.map((element) => {
        const month = new Date(element.createdAt).getMonth();
        procurementOverview[month] += 1;
        if (element.status === ContractStatus.COMPLETED) {
          completed += 1;
        } else if (element.status === ContractStatus.CANCELLED) {
          cancelled += 1;
        } else if (
          element.status === ContractStatus.ACCEPTED ||
          element.status === ContractStatus.PENDING
        ) {
          inProgress += 1;
        }
      });

      return {
        procurementOverview: procurementOverview,
        orderDetails,
        projectStatistics: {
          completed,
          inProgress,
          cancelled,
        },
        Project: await this.projectModel.findOne({
          where: { id: projectId },
          include: [{ all: true }],
        }),
      };
    } catch (error) {
      throw new BadRequestException('invalid project details');
    }
  }
}
