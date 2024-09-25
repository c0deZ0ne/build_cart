import {
  BadRequestException,
  Body,
  Delete,
  Injectable,
  NotFoundException,
  Param,
  ValidationPipe,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../user/models/user.model';
import {
  Project,
  ProjectStatus,
  ProjectType,
} from '../project/models/project.model';
import { TeamMember } from '../rbac/models/user-teammembers.model';
import { Team } from '../rbac/models/team.model';
import { UserProject } from '../fund-manager/models/shared-project.model';
import { Contract, ContractStatus } from '../contract/models';
import { RfqQuote, RfqRequest, RfqRequestStatus } from '../rfq/models';
import { OrderService } from '../order/order.services';
import {
  ProjectDto,
  updateProjectDto,
} from '../project/dto/create-project.dto';
import { ProjectService } from '../project/project.service';
import { Sequelize } from 'sequelize-typescript';
import { FundManager } from '../fund-manager/models/fundManager.model';
import { BuilderProject } from '../builder-project/model/builderProject.model';
import { MaterialSchedule } from '../material-schedule-upload/models/material-schedule.model';
import { UserUploadMaterial } from '../material-schedule-upload/models/material.model';
import { ProjectTender } from '../fund-manager/models/project-tender.model';
import { ExtendedSubmittedBids, ICompanyProject, SubmittedBids } from './types';
import { TenderBidDto } from './dto/submit-tender.dto';
import {
  BidStatus,
  TenderBid,
} from '../project/models/project-tender-bids.model';
import { WhereOptions, Op } from 'sequelize';
import { Documents } from '../documents/models/documents.model';
import {
  MediaType,
  ProjectMedia,
} from '../project-media/models/project-media.model';
import { Builder } from './models/builder.model';
import { ProjectFundManager } from '../project-fundManager/model/projectFundManager.model';
import { ProjectShares } from '../project/models/project-shared.model';
import { GroupName } from '../project/models/group-name.model';
import { Order, OrderStatus } from '../order/models';
import { DeliverySchedule } from '../order/models/order-schedule.model';
@Injectable()
export class BuilderProjectService {
  constructor(
    @InjectModel(UserProject)
    private readonly userProjectModel: typeof UserProject,
    @InjectModel(TeamMember)
    private readonly teamMemberModel: typeof TeamMember,
    @InjectModel(BuilderProject)
    private readonly builderProjectModel: typeof BuilderProject,
    @InjectModel(Project)
    private readonly projectModel: typeof Project,
    @InjectModel(Contract)
    private readonly contractModel: typeof Contract,
    @InjectModel(ProjectTender)
    private readonly projectTenderModel: typeof ProjectTender,
    @InjectModel(Documents)
    private readonly documentsModel: typeof Documents,
    @InjectModel(TenderBid)
    private readonly tenderBidModel: typeof TenderBid,
    @InjectModel(RfqRequest)
    private readonly rfqRequestModel: typeof RfqRequest,
    @InjectModel(Order)
    private readonly orderModel: typeof Order,
    private readonly orderService: OrderService,
    private readonly projectService: ProjectService,
    private sequelize: Sequelize,
  ) {}

  async createProject({ body, user }: { body: ProjectDto; user: User }) {
    const dbTransaction = await this.sequelize.transaction();
    try {
      const data = await this.projectService.createdProject({
        body,
        user,
        dbTransaction,
      });
      const { projectMedia } = body;
      if (projectMedia.length > 0) {
        projectMedia.map(async (media) => {
          if (media.mediaType === MediaType.FILE) {
            await this.documentsModel.create({
              projectId: data.id,
              others: {
                description: media.description,
                url: media.url,
                med: media.mediaType,
                title: media.title,
              },
              createdAt: new Date(),
            });
          }
        });
      }
      await this.builderProjectModel.create(
        {
          BuilderId: user.BuilderId,
          ProjectId: data.id,
          createdAt: new Date(),
          CreatedById: user.id,
        },
        { transaction: dbTransaction },
      );
      await dbTransaction.commit();
      return data;
    } catch (error) {
      dbTransaction.rollback();
      throw new BadRequestException(error.message);
    }
  }

  async updateProject(projectId: string, data: updateProjectDto, user: User) {
    try {
      return await this.projectService.updateProjectForBuilder(
        projectId,
        data,
        user,
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getAllUserProject(user: User): Promise<unknown[]> {
    return await this.projectModel.findAll({
      where: {
        ownerId: user.id,
      },
      include: [
        {
          model: FundManager,
          as: 'fundManagers',
          attributes: ['businessName', 'businessAddress', 'id'],
        },
        { model: MaterialSchedule, include: [{ model: UserUploadMaterial }] },
      ],
      order: [['createdAt', 'DESC']],
    });
  }

  async getBuilderProjectInvitations({ user }: { user: User }) {
    return await this.projectService.getProjectInvitations({ user });
  }

  async getSponsoredProjectsStatistics(user: User) {
    const projects = await this.getAllProjectsFinancedByFundManager(
      user.BuilderId,
    );

    return {
      allProjects: projects.length,
      pendingProjects: projects.filter(
        (project) => project.status === ProjectStatus.PENDING,
      ).length,
      activeProjects: projects.filter(
        (project) => project.status === ProjectStatus.ACTIVE,
      ).length,
      completedProjects: projects.filter(
        (project) => project.status === ProjectStatus.COMPLETED,
      ).length,
      transactionResolutionProjects: projects.filter(
        (project) => project.status === ProjectStatus.COMPLETED,
      ).length,
    };
  }

  async bidForProject({ body, user }: { body: TenderBidDto; user: User }) {
    try {
      const checkAlreadyTender = await this.tenderBidModel.findOne({
        where: { ProjectId: body.ProjectId, ownerId: user.id },
      });
      if (checkAlreadyTender)
        throw new Error('Already submitted bid for this project');
      return await this.tenderBidModel.create({
        ...body,
        CreatedById: user.id,
        ownerId: user.id,
        createdAt: new Date(),
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async builderSubmitted({ user }: { user: User }) {
    const submittedBidsData: Partial<SubmittedBids[]> = [];
    const allUserBids = await this.tenderBidModel.findAll({
      where: {
        ownerId: user.id,
      },
      include: [
        {
          model: Project,

          include: [
            { model: User, as: 'Owner', include: [{ model: FundManager }] },
          ],
        },
        { model: ProjectTender },
      ],
      order: [['createdAt', 'DESC']],
    });
    return allUserBids.reduce((curr, acc) => {
      const data: SubmittedBids = {
        id: acc.id,
        projectId: acc.ProjectId,
        location: acc.project.location,
        logo: acc.projectTender.logo,
        projectTenderId: acc.projectTender.id,
        projectName: acc.project.title,
        startDate: acc.project.startDate,
        fundManagerName: acc?.project.Owner.businessName,
        status: acc.status,
        tenderType: acc.projectTender.tenderType,
      };

      submittedBidsData.push(data);
      return curr;
    }, submittedBidsData);
  }
  async builderAcceptedBid({ user }: { user: User }) {
    const submittedBidsData: Partial<SubmittedBids[]> = [];
    const allUserBids = await this.tenderBidModel.findAll({
      where: {
        ownerId: user.id,
        status: BidStatus.ACCEPTED,
      },
      include: [
        {
          model: Project,

          include: [
            { model: User, as: 'Owner', include: [{ model: FundManager }] },
          ],
        },
        { model: ProjectTender },
      ],
      order: [['createdAt', 'DESC']],
    });
    return allUserBids.reduce((curr, acc) => {
      const data: SubmittedBids = {
        id: acc.id,
        projectId: acc.ProjectId,
        location: acc.project.location,
        logo: acc.projectTender.logo,
        projectTenderId: acc.projectTender.id,
        projectName: acc.project.title,
        startDate: acc.project.startDate,
        fundManagerName: acc?.project.Owner.businessName,
        status: acc.status,
        tenderType: acc.projectTender.tenderType,
      };

      submittedBidsData.push(data);
      return curr;
    }, submittedBidsData);
  }

  async tenderDetails({ user, bidId }: { user: User; bidId: string }) {
    try {
      const submittedBidsData: Partial<ExtendedSubmittedBids[]> = [];
      const allUserBids = await this.tenderBidModel.findAll({
        where: {
          ownerId: user.id,
          id: bidId,
        },
        include: [
          {
            model: Project,

            include: [
              { model: User, as: 'Owner', include: [{ model: FundManager }] },
            ],
          },
          { model: ProjectTender },
        ],
        order: [['createdAt', 'DESC']],
      });
      if (!(allUserBids.length > 0))
        throw new NotFoundException('tender not found');
      return allUserBids.reduce((curr, acc) => {
        const data: ExtendedSubmittedBids = {
          id: acc.id,
          fundManager: {
            name: acc.project.Owner.FundManager.businessName,
            email: acc.project.Owner.email,
            phoneNumber: acc.project.Owner.phoneNumber,
            photo: acc.project.Owner.FundManager.logo,
          },
          projectId: acc.ProjectId,
          location: acc.project.location,
          logo: acc.projectTender.logo,
          projectTenderId: acc.projectTender.id,
          projectName: acc.project.title,
          startDate: acc.project.startDate,
          fundManagerName: acc?.project.Owner.businessName,
          status: acc.status,
          projectType: acc.project.ProjectType,
          description: acc.project.description,
          projectTenders: acc.documents,
        };

        submittedBidsData.push(data);
        return curr;
      }, submittedBidsData)[0];
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async removeProjectInvite({
    user,
    tenderId,
  }: {
    user: User;
    tenderId: string;
  }) {
    try {
      const tender = await this.projectTenderModel.findOne({
        where: { id: tenderId },
      });
      const isExist = tender?.blacklistedBuilders.find(
        (builderId) => builderId === user.BuilderId,
      );
      if (isExist) throw 'already removed';
      const newTender = [...tender?.blacklistedBuilders, user.BuilderId];
      tender.blacklistedBuilders = newTender;
      await tender.save();
      return await this.getBuilderProjectInvitations({ user });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async getCompanyProjectStatistics(user: User): Promise<ICompanyProject> {
    const companyProject: ICompanyProject = {
      allProjects: 0,
      completedProjects: 0,
      transactionResolutionProjects: 0,
      activeProjects: 0,
      pendingProjects: 0,
    };
    const allCompanyProj = await this.builderProjectModel.findAll({
      where: {
        BuilderId: user.BuilderId,
      },
      include: [
        {
          model: Project,
          include: [
            {
              model: FundManager,
              as: 'fundManagers',
              attributes: ['businessName', 'businessAddress', 'id'],
            },
            {
              model: MaterialSchedule,
              include: [{ model: UserUploadMaterial }],
            },
          ],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
    return allCompanyProj.reduce((curr, acc) => {
      curr.allProjects += 1;
      if (acc.Project.status == ProjectStatus.COMPLETED) {
        curr.completedProjects += 1;
      }
      if (acc.Project.status == ProjectStatus.PENDING) {
        curr.pendingProjects += 1;
      }
      if (acc.Project.status == ProjectStatus.ACTIVE) {
        curr.activeProjects += 1;
      }
      if (acc.Project.status == ProjectStatus.DISPUTE) {
        curr.transactionResolutionProjects += 1;
      }
      return curr;
    }, companyProject);
  }

  async getCompanyProject({
    user,
    search,
  }: {
    user: User;
    search: string;
  }): Promise<BuilderProject[] | []> {
    const whereOptions: WhereOptions<BuilderProject> = {
      BuilderId: user.BuilderId,
    };

    if (search) {
      whereOptions[Op.or] = [
        { '$Project.title$': { [Op.iLike]: `%${search}%` } },
        { '$Project.location$': { [Op.iLike]: `%${search}%` } },
      ];
    }

    try {
      const builderProjects = await this.builderProjectModel.findAll({
        where: whereOptions,

        include: [
          {
            model: Project,
            include: [
              {
                model: FundManager,
                as: 'fundManagers',
                attributes: ['businessName', 'businessAddress', 'id', 'email'],
              },
              {
                model: MaterialSchedule,
                include: [{ model: UserUploadMaterial }],
              },
            ],
          },
        ],
        order: [['createdAt', 'DESC']],
      });

      return builderProjects;
    } catch (error) {
      return [];
    }
  }

  async getAllProjectsFinancedByFundManager(
    builderId: string,
    search?: string,
  ): Promise<Project[]> {
    if (!builderId)
      throw new BadRequestException(
        'You are not a builder, you cannot access his resource',
      );

    const whereOptions: WhereOptions<BuilderProject> = {};
    if (search) {
      whereOptions[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { location: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ];
    }
    return this.projectModel.findAll({
      where: whereOptions,
      include: [
        {
          model: ProjectShares,
          required: true,
          where: {
            BuilderId: builderId,
            FundManagerId: { [Op.not]: null },
          },
        },
        {
          model: FundManager,
          as: 'fundManagers',
          attributes: ['businessName', 'businessAddress', 'id', 'email'],
        },
        {
          model: MaterialSchedule,
          include: [{ model: UserUploadMaterial }],
        },
      ],
    });
  }

  async moveToCompleted({
    user,
    projectId,
  }: {
    user: User;
    projectId: string;
  }) {
    try {
      const projectData = await this.projectModel.findByPkOrThrow(projectId, {
        where: { ownerId: user.id },
        include: [{ model: RfqRequest }],
      });

      // Check if the project has ongoing Activities
      const ongoingActivities = projectData.Rfqs.some((d: RfqRequest) => {
        return !(d.status == RfqRequestStatus.CLOSED);
      });

      if (ongoingActivities) {
        const openRfqIDs = projectData.Rfqs.filter(
          (rfq) => rfq.status !== RfqRequestStatus.CLOSED,
        ).map((rfq) => rfq.id);

        openRfqIDs.map(async (rfqId) => {
          const rfqRequest = await this.rfqRequestModel.findOne({
            where: { id: rfqId },
            include: [
              {
                model: Order,
              },
            ],
          });

          const ongoingOrders = rfqRequest.orders?.filter(
            (order) => order.status !== OrderStatus.COMPLETED,
          );

          ongoingOrders.forEach(async (ord) => {
            const order = await this.orderModel.findOne({
              where: { id: ord.id },
              include: [
                {
                  model: DeliverySchedule,
                },
              ],
            });

            const pendingDeliveries = order.deliverySchedules?.filter(
              (schedule) => schedule.status !== OrderStatus.COMPLETED,
            );

            if (!pendingDeliveries.length) {
              order.status = OrderStatus.COMPLETED;
              await order.save();
            } else {
              throw new Error(
                'Some Rfqs in Project contains ongoing order deliveries, please ensure all rfqs orders are completed',
              );
            }
          });

          rfqRequest.status = RfqRequestStatus.CLOSED;
          await rfqRequest.save();
        });
      }

      // Check if the project has not started any Activities
      const notActivities = projectData.Rfqs.length < 1;
      if (notActivities) throw new Error('Project has no activities yet');

      projectData.status = ProjectStatus.COMPLETED;
      projectData.updatedAt = new Date();
      projectData.UpdatedById = user.id;
      await projectData.save();
      return projectData.reload();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getProjectDetails(ProjectId: string): Promise<unknown> {
    const projDat = await this.projectService.getProjectOrThrow(ProjectId);
    const projectActions = {
      rfqBudgets: 0,
      expenditures: 0,
    };
    const fqStats = projDat?.Rfqs?.reduce((curr, acc) => {
      curr.rfqBudgets += Number(acc.totalBudget);
      curr.expenditures += projDat.ProjectWallet
        ? Number(projDat.ProjectWallet.ActualSpend)
        : 0;
      return curr;
    }, projectActions);

    const neD = JSON.parse(JSON.stringify(projDat)) as Project;

    const newData = {
      ...neD,
      fqStats,
      Owner: {
        id: neD.Owner.id,
        name: neD.Owner.name,
        phoneNumber: neD.Owner.phoneNumber,
        logo: neD.Owner?.Builder?.logo || neD.Owner.FundManager?.logo,
        email: neD.Owner?.email,
      },
    };
    return newData;
  }

  async getBuilderInvitedProjects(user: User): Promise<unknown> {
    const projects = await this.projectModel.findAll({
      where: {
        ProjectType: ProjectType.INVITE,
      },
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: FundManager,
          as: 'fundManagers',
          attributes: ['businessName', 'businessAddress', 'id', 'email'],
        },
        {
          model: Builder,
          attributes: ['id', 'businessName', 'businessAddress', 'email'],
          where: { id: user.BuilderId },
        },
        {
          model: MaterialSchedule,
          include: [{ model: UserUploadMaterial }],
        },
        { model: ProjectMedia },
        { model: Documents },
        { model: ProjectTender },
        { model: TenderBid, as: 'bids' },
      ],
    });

    return projects;
  }

  /**
   * Retrieves all projects associated with the given user.
   * @param {User} user - The user for whom to fetch projects.
   * @returns {Promise<unknown[]>} An array of projects.
   */
  async getAllProject(user: User): Promise<unknown[]> {
    const isTeamMember = await this.teamMemberModel.findOne({
      where: {
        UserId: user.id,
      },
      include: [{ model: Team, include: [{ model: User, as: 'owner' }] }],
    });

    if (user.id === isTeamMember.team.owner.id) {
      return await this.projectModel.findAll({
        where: {
          CreatedById: user.id,
        },
        include: [
          { model: User, as: 'users', attributes: ['name', 'location', 'id'] },
        ],
        attributes: [
          'id',
          'title',
          'createdAt',
          'startDate',
          'endDate',
          'location',
        ],
      });
    }
  }

  /**
   * @param ProjectId the project id to get details
   * returns an object of project details
   */
  async getDashboardProjectDetails({
    projectId,
    user,
  }: {
    projectId: string;
    user?: User;
  }) {
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
    };
  }
}
