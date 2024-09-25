import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProjectService } from '../project/project.service';
import { User, UserType } from '../user/models/user.model';
import { InjectModel } from '@nestjs/sequelize';
import { FundManager } from '../fund-manager/models/fundManager.model';
import { Project, ProjectStatus } from '../project/models/project.model';
import { ProjectTender } from '../fund-manager/models/project-tender.model';
import { Sequelize } from 'sequelize-typescript';
import { EmailService } from '../email/email.service';
import { Team } from '../rbac/models/team.model';
import { Role } from '../rbac/models/role.model';
import { Op, WhereOptions } from 'sequelize';
import {
  RfqItem,
  RfqQuote,
  RfqRequest,
  RfqRequestMaterial,
} from '../rfq/models';
import { Builder, BuilderTier } from '../builder/models/builder.model';
import { MaterialSchedule } from '../material-schedule-upload/models/material-schedule.model';
import { ProjectMedia } from '../project-media/models/project-media.model';
import { ProjectWallet } from '../project-wallet/models/project-wallet.model';
import {
  UpdateBuilderDto,
  superAdminCreateBuilderDto,
} from './dto/super-admin-create-builderDto';
import { BuilderService } from '../builder/builder.service';
import { randomUUID } from 'crypto';
import { UserService } from '../user/user.service';
import { superAdminCreateBuilderProjectDto } from './dto/super-admin-create-builder-projectDto';
import { UploadDocumentsDto } from '../vendor/dto';
import { Documents } from '../documents/models/documents.model';
import { Order } from '../order/models';
import { Contract } from '../contract/models';
import { UserLog } from '../user-log/models/user-log.model';
import { BuilderFundManager } from '../project/models/builder-fundManager-project.model';
import { UserUploadMaterial } from '../material-schedule-upload/models/material.model';

@Injectable()
export class SuperAdminBuilderService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
    @InjectModel(UserLog)
    private readonly userLogModel: typeof UserLog,
    @InjectModel(Team)
    private readonly teamModel: typeof Team,
    @InjectModel(Project)
    private readonly projectModel: typeof Project,
    @InjectModel(Order)
    private readonly orderModel: typeof Order,
    @InjectModel(Builder)
    private readonly builderModel: typeof Builder,
    @InjectModel(Documents)
    private readonly documentsModel: typeof Documents,
    @InjectModel(FundManager)
    private readonly fundManagerModel: typeof FundManager,
    @InjectModel(BuilderFundManager)
    private readonly builderFundManagerModel: typeof BuilderFundManager,

    private readonly emailServices: EmailService,
    private readonly sequelize: Sequelize,

    private projectService: ProjectService,
    private builderService: BuilderService,
    private userService: UserService,
  ) {}

  async getBuilders(query?: string) {
    const whereOptions: WhereOptions<FundManager> = {};
    if (query) {
      whereOptions[Op.or] = [{ businessName: { [Op.iLike]: `%${query}%` } }];
    }
    const builders = await this.builderModel.findAll({
      where: whereOptions,
      include: [
        {
          model: Project,
          as: 'CompanyProjects',
        },
        {
          model: User,
          as: 'procurementManager',
          attributes: ['id', 'name', 'businessName', 'email'],
        },
        {
          model: User,
          as: 'owner',
          attributes: [
            'id',
            'name',
            'businessName',
            'email',
            'phoneNumber',
            'location',
          ],
        },
      ],
    });

    const allManagers = builders.map((builder) => {
      const { CompanyProjects } = builder;
      let count = 0;
      CompanyProjects.map((project) => {
        if (project.status === ProjectStatus.COMPLETED) {
          count++;
        }
      });
      const newD = {
        ...builder.dataValues,
        completedProjects: count,
      };
      return newD;
    });

    return allManagers as unknown as Builder;
  }

  async getBuilderById(builderId: string) {
    const builder = await this.builderModel.findOne({
      where: { id: builderId },
      include: [
        {
          model: Project,
          as: 'CompanyProjects',
        },
        {
          model: User,
          as: 'owner',
          attributes: [
            'id',
            'name',
            'businessName',
            'email',
            'phoneNumber',
            'location',
          ],
        },
      ],
    });

    if (!builder) throw new NotFoundException('builder does not exist');
    const { CompanyProjects } = builder;
    const activeProjects = CompanyProjects.filter(
      (project) => project.status === ProjectStatus.ACTIVE,
    );
    const completedProjects = CompanyProjects.filter(
      (project) => project.status === ProjectStatus.COMPLETED,
    );
    const teamMember = await this.teamModel.findAll({
      where: { createdById: builder.ownerId },
      include: [
        {
          model: User,
          as: 'members',
          include: [{ model: Role }],
          attributes: ['id'],
        },
      ],
    });

    const projects = await this.projectService.getAllUserProject(
      builder.ownerId,
    );
    const projectData = projects.reduce(
      function (acc, next) {
        if (next.status === ProjectStatus.COMPLETED && next.ProjectWallet) {
          acc['lifetime'] += next.ProjectWallet.balance ?? 0;
        }
        if (next.status === ProjectStatus.ACTIVE && next.ProjectWallet) {
          acc['ongoing'] += Number(next.ProjectWallet.ActualSpend ?? 0);
          acc['balance'] += Number(next.ProjectWallet.balance ?? 0);
        }

        return acc;
      },
      { ongoing: 0, lifetime: 0, balance: 0 },
    );

    return {
      builder,
      activeProjects,
      completedProjects,
      teamMember,
      projectData,
    };
  }
  async getBuilderProjects(builderId: string) {
    const builder = await this.builderModel.findOne({
      where: { id: builderId },
      include: [
        {
          model: Project,
          as: 'CompanyProjects',
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    if (!builder) throw new NotFoundException('builder does not exist');
    const fundManagers = await this.builderFundManagerModel.findAll({
      where: {
        BuilderId: builderId,
      },
      include: [{ model: FundManager }],
    });

    const ids = fundManagers.map((manager) => manager.FundManager.ownerId);
    const fundManagerProject = await this.projectModel.findAll({
      where: {
        ownerId: ids,
      },
    });

    return {
      businessProjects: builder.CompanyProjects,
      fundManagerProject,
    };
  }

  async getBuilderDetails(builderId: string) {
    const builder = await this.userModel.findOne({
      where: { BuilderId: builderId },
      include: [
        {
          model: User,
          as: 'owner',
          attributes: [
            'id',
            'name',
            'businessName',
            'email',
            'phoneNumber',
            'location',
          ],
        },
      ],
    });

    if (!builder) throw new NotFoundException('builder does not exist');

    return builder;
  }

  async updateBuilderProfile(data: UpdateBuilderDto, id: string) {
    const builder = await this.builderModel.findOne({
      where: { id },
    });

    if (!builder) throw new NotFoundException('builder does not exist');
    const updatedData = await this.builderModel.update(
      { ...data },
      { where: { id }, returning: true },
    );
    const [affectedCount, affectedRows] = updatedData;
    return affectedRows[0];
  }

  async getProjectDetails(id: string) {
    const project = await this.projectModel.findByPkOrThrow(id, {
      include: [
        { model: FundManager },
        { model: Builder },
        { model: ProjectMedia },
        { model: Documents },
        { model: RfqRequest, include: [{ model: RfqQuote }] },
        { model: ProjectWallet },
        { model: MaterialSchedule, include: [{ model: UserUploadMaterial }] },
        { model: ProjectTender },
        {
          model: User,
          as: 'Owner',
          attributes: ['id', 'name', 'email'],
          include: [{ model: FundManager }, { model: Builder }],
        },
      ],
    });

    const materialSchedules = project.materialSchedules.map((material) => {
      return material.userUploadMaterial;
    });
    return { project, materialSchedules: materialSchedules[0] };
  }

  async getBuildersProjects() {
    return await this.projectModel.findAll({
      include: [
        { model: FundManager },
        { model: Builder },
        { model: ProjectMedia },
        { model: Documents },
        { model: RfqRequest, include: [{ model: RfqQuote }] },
        { model: ProjectWallet },
        { model: MaterialSchedule },
        { model: ProjectTender },
        {
          model: User,
          as: 'Owner',
          attributes: ['id', 'name', 'email'],
          include: [{ model: FundManager }, { model: Builder }],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
  }

  async updateBuilderDocuments(data: UploadDocumentsDto, builderId: string) {
    return await this.documentsModel.upsert({ ...data, BuilderId: builderId });
  }

  async createBuilderProject(
    data: superAdminCreateBuilderProjectDto,
    builderId: string,
    superAdminId: string,
  ) {
    const dbTransaction = await this.sequelize.transaction();
    try {
      const {
        title,
        description,
        image,
        fileName,
        startDate,
        endDate,
        location,
        fundManagerId,
        message,
        inviteeEmail,
      } = data;

      const builder = await this.builderService.getBuilderById(builderId);
      if (!builder) throw new NotFoundException(`Builder not found`);

      const newProject = await this.projectModel.create(
        {
          title,
          description,
          fileName,
          image,
          location,
          startDate,
          endDate,
          CreatedById: builder.id,
          ownerId: builder.id,
        },
        { transaction: dbTransaction },
      );
      let fundManagerName;
      if (!fundManagerId) {
        const data = {
          toName: inviteeEmail,
          toEmail: inviteeEmail,
          message,
          inviteeName: builder.name,
          phoneNumber: builder.phoneNumber,
          projectId: newProject.id,
        };

        await this.emailServices.fundManagerPlatformInvitationsEmail(data);
      } else {
        const fundManager = await this.fundManagerModel.findByPkOrThrow(
          fundManagerId,
          { include: [{ all: true }] },
        );

        fundManagerName = fundManager.businessName ?? inviteeEmail;
      }

      await this.userLogModel.create({
        teamMemberId: superAdminId,
        activityTitle: 'New project created.',
        activityDescription: `${builder.businessName} project created. ${builder.businessName} added as the  builder and ${fundManagerName} added as fund manager.`,
      });
      await dbTransaction.commit();
      return newProject;
    } catch (error) {
      dbTransaction.rollback();
      throw error;
    }
  }

  async createBuilder(data: superAdminCreateBuilderDto, superAdminId: string) {
    const dbTransaction = await this.sequelize.transaction();

    const checkExistingUser = await this.userModel.findOne({
      where: { email: data.email },
    });
    if (checkExistingUser)
      throw new BadRequestException('user already exist with this email ');

    const builder = await this.builderModel.findOne({
      where: { email: data.email },
    });
    if (builder) {
      throw new BadRequestException('email already in use');
    }

    try {
      const password = randomUUID().substring(10);
      const newUserData = await this.userService.createUser({
        userData: {
          ...data,
          CreatedById: superAdminId,
          password,
        },
        createdByAdmin: true,
        dbTransaction,
      });

      const buyerData = await this.builderModel.create(
        {
          ...data,
          isBusinessVerified: false,
          email: newUserData.email,
          createdById: superAdminId,
          updatedById: superAdminId,
          tier: BuilderTier.one,
          createdAt: new Date(),
          lastLogin: new Date(),
        },
        { transaction: dbTransaction },
      );

      newUserData.BuilderId = buyerData.id;
      newUserData.Builder = buyerData;
      newUserData.userType = UserType.BUILDER;
      newUserData.updatedAt = new Date();
      newUserData.UpdatedById = superAdminId;
      const updateData = await User.update(
        {
          BuilderId: buyerData.id,
          Builder: buyerData,
          userType: UserType.BUILDER,
          updatedAt: new Date(),
          UpdatedById: superAdminId,
        },
        {
          where: {
            id: newUserData.id,
          },
          transaction: dbTransaction,
          returning: true,
        },
      );

      const [affectedCount, affectedRows] = updateData;
      if (!affectedCount)
        throw new Error(
          'Please try again  we could not update your account userType',
        );

      await this.emailServices.sendAccountCreated({
        name: newUserData.name,
        email: newUserData.email,
        password,
        userType: UserType.BUILDER,
      });

      await this.userLogModel.create({
        teamMemberId: superAdminId,
        activityTitle: 'New builder created.',
        activityDescription: `Builder account created on behalf of ${data.businessName}.`,
      });
      await dbTransaction.commit();
      return affectedRows[0];
    } catch (error) {
      dbTransaction.rollback();
      throw error;
    }
  }

  async assignProcurementManagersToBuilders(
    builderId: string,
    procurementManagerId: string,
  ) {
    const builder = await this.builderModel.findOne({
      where: { id: builderId },
    });

    if (!builder) throw new NotFoundException('builder does not exist');

    const procurementManager = await this.userModel.findOne({
      where: { id: procurementManagerId },
    });

    if (!procurementManager)
      throw new NotFoundException('procurement manager does not exist');

    const updatedData = await this.builderModel.update(
      { procurementManagerId },
      { where: { id: builderId }, returning: true },
    );
    const [affectedCount, affectedRows] = updatedData;
    return affectedRows;
  }

  async getOrders(builderId: string) {
    const orders = await this.orderModel.findAll({
      where: { BuilderId: builderId },
      include: [
        {
          model: Builder,
          attributes: ['id', 'logo', 'businessName'],
        },
        { model: RfqRequestMaterial, include: [{ model: RfqItem }] },
        {
          model: Contract,
          include: [{ model: RfqRequest }, { model: RfqQuote }],
        },
      ],
    });

    return orders;
  }
}
