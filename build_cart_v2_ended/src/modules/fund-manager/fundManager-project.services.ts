import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/modules/user/models/user.model';
import { ProjectWalletService } from '../project-wallet/project-wallet.service';
import { Project, ProjectStatus } from '../project/models/project.model';
import { TeamMember } from '../rbac/models/user-teammembers.model';
import { UserProjectService } from './fundManager-userproject.service';
import { ProjectDto } from '../project/dto/create-project.dto';
import { ProjectService } from '../project/project.service';
import { Sequelize } from 'sequelize-typescript';
import { Builder } from '../builder/models/builder.model';
import { ProjectFundManager } from '../project-fundManager/model/projectFundManager.model';
import { Invitation } from '../invitation/models/invitation.model';
import { EmailService } from '../email/email.service';
import { FundManager } from './models/fundManager.model';
import { ProjectWallet } from '../project-wallet/models/project-wallet.model';
import { ProjectTender, TenderStatus } from './models/project-tender.model';
import {
  BidStatus,
  TenderBid,
} from '../project/models/project-tender-bids.model';
import { GroupName } from '../project/models/group-name.model';
import { MaterialSchedule } from '../material-schedule-upload/models/material-schedule.model';
import {
  MediaType,
  ProjectMedia,
} from '../project-media/models/project-media.model';
import { RfqRequest } from '../rfq/models/rfqRequest.model';
import { UserTransactionService } from '../user-wallet-transaction/user-transaction.service';
import { fundManagerCreateProjectDto } from './dto/create-project.dto';
import { Op, WhereOptions } from 'sequelize';
import { ProjectShares, Status } from '../project/models/project-shared.model';
import { Documents } from '../documents/models/documents.model';
import { RfqRequestMaterial } from '../rfq/models/rfqRequestMaterial.model';
import { RfqItem } from '../rfq/models/rfqItem.model';
import { RfqCategory } from '../rfq/models/rfqCategory.model';
import { RfqQuote } from '../rfq/models/rfqQuote.model';
import { Vendor } from '../vendor/models/vendor.model';
import { ProjectTransaction } from '../project-wallet-transaction/models/project-transaction.model';
import { BidsResponseData } from '../order/dto/order.dto';
import { DeliverySchedule } from '../order/models/order-schedule.model';
import { Contract, ContractStatus } from '../contract/models/contract.model';
import { Order } from '../order/models/order.model';
import { RateReview } from '../rate-review/model/rateReview.model';
import { DisputeService } from '../dispute/dispute.service';
@Injectable()
export class FundManagerProjectService {
  constructor(
    @InjectModel(Project)
    private readonly projectModel: typeof Project,
    @InjectModel(TeamMember)
    private readonly teamMemberModel: typeof TeamMember,
    @InjectModel(ProjectFundManager)
    private readonly projectFundManagerModel: typeof ProjectFundManager,
    @InjectModel(ProjectTender)
    private projectTenderModel: typeof ProjectTender,
    @InjectModel(TenderBid)
    private tenderBidModel: typeof TenderBid,
    @InjectModel(ProjectShares)
    private projectSharesModel: typeof ProjectShares,
    @InjectModel(Documents)
    private readonly documentsModel: typeof Documents,

    @InjectModel(GroupName)
    private groupNameModel: typeof GroupName,
    @InjectModel(RfqRequest)
    private rfqRequestModel: typeof RfqRequest,
    @InjectModel(RateReview)
    private readonly rateReviewModel: typeof RateReview,
    @InjectModel(Contract)
    private readonly contractModel: typeof Contract,
    private readonly projectWalletService: ProjectWalletService,
    private userProjectService: UserProjectService,
    private userTranasctionService: UserTransactionService,
    private sequelize: Sequelize,
    @InjectModel(Invitation)
    private invitationModel: typeof Invitation,
    private emailService: EmailService,
    private projectService: ProjectService,
    private disputeService: DisputeService,
  ) {}

  async createProject({
    body,
    user,
  }: {
    body: fundManagerCreateProjectDto;
    user: User;
  }) {
    const dbTransaction = await this.sequelize.transaction();
    try {
      const data = await this.projectService.createdProject({
        body,
        user,
        dbTransaction,
      });
      await this.projectFundManagerModel.create(
        {
          FundManagerId: user.FundManagerId,
          ProjectId: data.id,
          createdAt: new Date(),
          CreatedById: user.id,
        },
        { transaction: dbTransaction },
      );
      await dbTransaction.commit();
      return data;
    } catch (error) {
      await dbTransaction.rollback();
      throw new BadRequestException(error.message);
    }
  }

  async editProject({
    projectId,
    body,
    user,
  }: {
    projectId: string;
    body: ProjectDto;
    user: User;
  }) {
    try {
      const data = await this.projectService.updateProjectForFundManager({
        projectId,
        body,
        user,
      });
      return data;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * This returns all the projects a fund manager is involved in
   */
  async getAllFundManagerProjects(
    user: User,
    search?: string,
  ): Promise<unknown[]> {
    const whereCondition: WhereOptions<Project> = {
      status: {
        [Op.ne]: ProjectStatus.ARCHIVE,
      },
    };
    if (search) {
      whereCondition[Op.or] = [
        this.sequelize.literal(`"title"::text ILIKE '%${search}%'`),
        this.sequelize.literal(`"status"::text ILIKE '%${search}%'`),
        this.sequelize.literal(`"location"::text ILIKE '%${search}%'`),
      ];
    }

    return this.projectModel.findAll({
      where: {
        ...whereCondition,
        [Op.or]: [
          {
            '$projectFundManager.FundManagerId$': user.FundManagerId,
          },
          {
            '$projectShares.FundManagerId$': user.FundManagerId,
          },
        ],
      },
      include: [
        {
          model: ProjectFundManager,
          as: 'projectFundManager',
          required: false,
        },
        {
          model: ProjectShares,
          as: 'projectShares',
          required: false,
        },
        {
          model: Builder,
          as: 'developers',
          attributes: ['businessName', 'businessAddress', 'id'],
        },
        {
          model: GroupName,
        },
      ],
    });
  }

  async getProjectsStatistics(user: User) {
    const projects = await this.projectModel.findAll({
      where: {
        [Op.or]: [
          {
            '$projectFundManager.FundManagerId$': user.FundManagerId,
          },
          {
            '$projectShares.FundManagerId$': user.FundManagerId,
          },
        ],
      },
      include: [
        {
          model: ProjectFundManager,
          as: 'projectFundManager',
          required: false,
        },
        {
          model: ProjectShares,
          as: 'projectShares',
          required: false,
        },
      ],
    });

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

  async updateProjectTitle(projectId: string, title: string, user: User) {
    const projectData = await this.getProjectOrThrow(projectId);
    if (projectData.CreatedById !== user.id && user.userType !== 'ADMIN')
      throw new BadRequestException(`You cannot update this project`);
    await this.projectModel.update(
      { title, UpdatedById: user.id },
      { where: { id: projectId } },
    );
  }

  async completeAProject({
    projectId,
    user,
  }: {
    projectId: string;
    user: User;
  }) {
    const project = await this.getProjectOrThrow(projectId);
    if (project.status === ProjectStatus.ARCHIVE) {
      throw new BadRequestException(`Project already Completed`);
    }
    const updated = await this.projectModel.update(
      { status: ProjectStatus.ARCHIVE, UpdatedById: user.id },
      { where: { id: projectId }, returning: true },
    );
    const [affectedCount, affectedRows] = updated;

    return affectedRows[0];
  }

  async activeProjects(user: User, search?: string) {
    const whereCondition: WhereOptions<Project> = {
      status: {
        [Op.in]: [
          ProjectStatus.ACTIVE,
          ProjectStatus.COMPLETED,
          ProjectStatus.DISPUTE,
        ],
      },
    };
    if (search) {
      whereCondition[Op.or] = [
        this.sequelize.literal(`"title"::text ILIKE '%${search}%'`),
        this.sequelize.literal(`"status"::text ILIKE '%${search}%'`),
        this.sequelize.literal(`"location"::text ILIKE '%${search}%'`),
      ];
    }
    return await this.projectFundManagerModel.findAll({
      where: {
        FundManagerId: user.FundManagerId,
      },
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Project,
          where: whereCondition,
          include: [
            {
              model: Builder,
              as: 'developers',
              attributes: ['businessName', 'businessAddress', 'id'],
            },
            {
              model: GroupName,
            },
          ],
        },
      ],
    });
  }

  async pendingProjects(user: User) {
    return await this.projectFundManagerModel.findAll({
      where: {
        FundManagerId: user.FundManagerId,
      },
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Project,
          where: { status: ProjectStatus.PENDING },
          include: [
            {
              model: Builder,
              as: 'developers',
              attributes: ['businessName', 'businessAddress', 'id'],
            },
          ],
        },
      ],
    });
  }

  async completedProjects(user: User, search?: string) {
    const whereCondition: WhereOptions<Project> = {
      status: ProjectStatus.COMPLETED,
    };
    if (search) {
      whereCondition[Op.or] = [
        this.sequelize.literal(`"title"::text ILIKE '%${search}%'`),
        this.sequelize.literal(`"status"::text ILIKE '%${search}%'`),
        this.sequelize.literal(`"location"::text ILIKE '%${search}%'`),
      ];
    }
    return await this.projectFundManagerModel.findAll({
      where: {
        FundManagerId: user.FundManagerId,
      },
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Project,
          where: whereCondition,
          include: [
            {
              model: Builder,
              as: 'developers',
              attributes: ['businessName', 'businessAddress', 'id'],
            },
          ],
        },
      ],
    });
  }

  async getProjectDashboardSummary(user: User) {
    const result = await Promise.all([
      await this.getAllFundManagerProjects(user),
      await this.completedProjects(user),
      await this.pendingProjects(user),
      await this.activeProjects(user),
      await this.disputeService.getDisputesResolutions(user.FundManagerId),
    ]);

    return {
      allProjects: result[0].length,
      completedProjects: result[1].length,
      pendingProjects: result[2].length,
      activeProjects: result[3].length,
      transactionsResolutions: result[4].length,
      completedProjectsData: result[1],
      activeProjectsData: result[3],
      pendingProjectsData: result[2],
    };
  }

  async getTransactionsResolutions(user: User) {
    return await this.disputeService.getDisputesResolutions(user.FundManagerId);
  }

  async getProjectOrThrow(id: string) {
    return await this.projectModel.findByPkOrThrow(id, {
      include: [{ all: true }],
    });
  }

  async inviteBuilder(
    projectId: string,
    FundManagerId: string,
    fundManagerName: string,
    buyerEmail: string,
    buyerName: string,
    buyerPhone: string,
  ) {
    const invitation = await this.invitationModel.create({
      projectId,
      FundManagerId,
      fundManagerName,
      buyerEmail,
      buyerName,
      buyerPhone,
    });
    const data = {
      buyerEmail,
      fundManagerName,
      buyerName: buyerName ? buyerName : buyerEmail,
      invitationId: invitation.id,
      FundManagerId: invitation.FundManagerId,
    };
    await this.emailService.inviteNotificationEmail(data);
    return invitation;
  }

  async getInvitations(FundManagerId: string) {
    const invitation = await this.invitationModel.findAll({
      where: { FundManagerId },
      include: [
        {
          model: FundManager,
        },
        {
          model: Project,
        },
      ],
    });

    return invitation;
  }

  async getInvitationById(FundManagerId: string, id: string) {
    const invitation = await this.invitationModel.findOne({
      where: { id, FundManagerId },
      include: [
        {
          model: FundManager,
        },
        {
          model: Project,
        },
      ],
    });

    if (!invitation) throw new NotFoundException('invitation data not found');

    return invitation;
  }

  async getProjectDetails(projectId: string) {
    const project = await this.projectModel.findOne({
      where: {
        id: projectId,
      },
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Builder,
          as: 'developers',
          attributes: [
            'email',
            'businessName',
            'businessAddress',
            'tier',
            'id',
          ],
          include: [
            {
              model: User,
              as: 'owner',
              attributes: ['phoneNumber', 'name', 'location', 'id'],
            },
          ],
        },
        {
          // NOTE: this can be improved upon using a through query
          model: ProjectFundManager,
          as: 'projectFundManager',
          required: false,
          include: [
            {
              model: FundManager,
            },
          ],
        },
        {
          model: RfqRequest,
          attributes: [
            'id',
            'title',
            'status',
            'totalBudget',
            'paymentTerm',
            'deliveryDate',
            'deliveryAddress',
            'deliveryInstructions',
            'createdAt',
            'ProjectId',
            'BuilderId',
            'FundManagerId',
          ],
          include: [
            {
              model: RfqRequestMaterial,

              include: [{ model: RfqCategory }],
            },
            {
              model: Builder,
              attributes: ['email', 'businessName', 'businessAddress', 'tier'],
              include: [
                {
                  model: User,
                  as: 'owner',
                  attributes: [
                    'email',
                    'id',
                    'name',
                    'location',
                    'businessName',
                    'phoneNumber',
                  ],
                },
              ],
            },
          ],
        },

        {
          model: ProjectWallet,
          include: [{ model: ProjectTransaction }],
        },
        {
          model: GroupName,
        },
        {
          model: ProjectTender,
        },
        {
          model: MaterialSchedule,
        },
        {
          model: ProjectMedia,
        },
        {
          model: Documents,
        },
        {
          model: RfqRequest,
        },
        {
          model: Documents,
        },
      ],
    });

    const ProjectWalletData = project.ProjectWallet;

    const walletDetails = {
      totalBudget: project.budgetAmount,
      totalSpent: project.amountSpent,
      projectBalance: Number(ProjectWalletData.balance),
      pendingBalance: project.budgetAmount - project.amountSpent,
    };

    return { project, walletDetails };
  }

  async getProjectTenders(projectId: string) {
    return await this.projectTenderModel.findAll({
      where: { ProjectId: projectId },
      include: [
        { model: TenderBid },
        {
          model: Project,
          attributes: {
            exclude: [
              'migratedAt',
              'updatedAt',
              'UpdatedById',
              'image',
              'fileName',
            ],
          },
          include: [
            { model: ProjectMedia },
            { model: Documents },
            { model: GroupName },
            { model: MaterialSchedule },
            { model: ProjectWallet },
          ],
        },
        {
          model: Builder,
          attributes: [
            'id',
            'email',
            'businessName',
            'businessAddress',
            'businessSize',
            'logo',
            'tier',
            'creditStatus',
          ],
        },
      ],
    });
  }

  async getBidsForRFQ(
    rfqRequestId: string,
    search?: string,
  ): Promise<BidsResponseData> {
    const whereOptions: WhereOptions<RfqRequest> = {
      id: rfqRequestId,
    };
    const subOption: WhereOptions<Vendor> = {};
    if (search) {
      subOption[Op.or] = [{ businessName: { [Op.iLike]: `%${search}%` } }];
    }
    const result = await this.rfqRequestModel.findOrThrow({
      where: whereOptions,
      attributes: [
        'id',
        'title',
        'status',
        'totalBudget',
        'paymentTerm',
        'deliveryDate',
        'deliveryAddress',
        'deliveryInstructions',
        'createdAt',
        'ProjectId',
        'BuilderId',
        'FundManagerId',
        'deliverySchedule',
      ],
      include: [
        {
          model: RfqRequestMaterial,

          include: [{ model: RfqCategory }],
        },
        {
          model: Builder,
          attributes: ['email', 'businessName', 'businessAddress'],
          include: [
            {
              model: Project,
              as: 'CompanyProjects',
              attributes: [
                'ProjectType',
                'id',
                'image',
                'description',
                'fileName',
                'startDate',
                'endDate',
              ],
              through: { attributes: [] },
            },
            {
              model: User,
              as: 'owner',
              attributes: [
                'email',
                'id',
                'name',
                'location',
                'businessName',
                'phoneNumber',
              ],
            },
          ],
        },
        {
          model: Order,
          include: [{ model: DeliverySchedule }, { model: Contract }],
        },
        {
          model: RfqQuote,
          include: [
            {
              model: Vendor,
              where: subOption,
              attributes: [
                'id',
                'logo',
                'businessName',
                'businessAddress',
                'email',
                'phone',
                'status',
                'VendorType',
              ],
              include: [
                {
                  model: User,
                  as: 'createdBy',
                  attributes: ['location', 'email', 'businessName'],
                },
              ],
            },

            { model: RfqRequestMaterial },
          ],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    const vendorIds = result.RfqQuotes.map((quote) => quote.VendorId);
    const rateVendors = await this.rateReviewModel.findAll({
      where: { VendorId: { [Op.in]: vendorIds } },
    });
    const vendorOrders = await this.contractModel.findAll({
      where: { VendorId: { [Op.in]: vendorIds } },
    });

    const resultWithPendingCount = {
      ...result.toJSON(),
      Builder: {
        ...result.Builder.toJSON(),
        builderCompletedProjectsCount: result.Builder.CompanyProjects?.filter(
          (project) => project.status === ProjectStatus.COMPLETED,
        ).length,
      },
      orders: result.orders.map((order) => {
        const pendingCount = order.deliverySchedules.filter(
          (schedule) => schedule.status !== 'COMPLETED',
        ).length;
        return {
          ...order.toJSON(),
          pendingCount: pendingCount,
        };
      }),
      RfqQuotes: result.RfqQuotes.map((quote) => {
        const rateVendorData = rateVendors.filter(
          (rateVendor) => rateVendor.VendorId === quote.VendorId,
        );
        const ratevendorScore = rateVendorData.map(
          (rateVendor) => rateVendor.vendorRateScore,
        );

        const ordersVendorData = vendorOrders.filter(
          (orderVendor) => orderVendor.VendorId === quote.VendorId,
        );
        const vendorCompletedOrdersCount = ordersVendorData.filter(
          (orderVendor) => orderVendor.status === ContractStatus.COMPLETED,
        ).length;

        const averageVendorScore =
          ratevendorScore.reduce((acc, score) => acc + score, 0) /
          rateVendorData.length;
        return {
          RfqQuote: {
            ...quote.toJSON(),
            Vendor: {
              ...quote.Vendor.toJSON(),
              vendorRateScore: isNaN(averageVendorScore)
                ? 0
                : Math.round(averageVendorScore),
              vendorCompletedOrdersCount,
            },
          },
        };
      }),
    };
    return resultWithPendingCount;
  }
  async getProjectTenderDetails(projectTenderId: string) {
    return await this.projectTenderModel.findOne({
      where: { id: projectTenderId },
      include: [
        { model: TenderBid },
        { model: Project },
        {
          model: Builder,
          include: [
            'id',
            'email',
            'businessName',
            'businessAddress',
            'businessSize',
            'logo',
            'tier',
            'creditStatus',
          ],
        },
      ],
    });
  }

  async getAllProjectTenderBids(projectId: string): Promise<unknown[]> {
    const bids = await this.tenderBidModel.findAll({
      where: { ProjectId: projectId },
      include: [
        {
          model: Project,
          attributes: {
            exclude: [
              'migratedAt',
              'updatedAt',
              'UpdatedById',
              'image',
              'fileName',
            ],
          },
        },
        { model: ProjectTender },
        {
          model: User,
          as: 'Owner',
          attributes: [
            'id',
            'email',
            'name',
            'location',
            'phoneNumber',
            'userType',
            'level',
          ],
          include: [
            {
              model: Builder,
              attributes: [
                'id',
                'email',
                'businessName',
                'businessAddress',
                'businessSize',
                'logo',
                'tier',
                'creditStatus',
              ],
              include: [{ model: Project, as: 'CompanyProjects' }],
            },
          ],
        },
      ],
    });

    const modifiedResult = bids.map((bid) => {
      const completedProject = bid.Owner.Builder.CompanyProjects.filter(
        (project) => project.status === ProjectStatus.COMPLETED,
      );
      return {
        ...bid.toJSON(),
        Owner: {
          ...bid.Owner.Builder.toJSON(),
          CompanyProjects: {
            totalProjects: bid.Owner.Builder.CompanyProjects.length || 0,
            completedProjects: completedProject.length || 0,
          },
        },
      };
    });

    return modifiedResult;
  }

  async getTenderBidDetails(tenderBidId: string): Promise<unknown> {
    const bid = await this.tenderBidModel.findOne({
      where: { id: tenderBidId },
      include: [
        { model: Project },
        { model: ProjectTender },
        {
          model: User,
          as: 'Owner',
          attributes: [
            'id',
            'email',
            'name',
            'location',
            'phoneNumber',
            'userType',
            'level',
          ],
          include: [
            {
              model: Builder,
              attributes: [
                'id',
                'email',
                'businessName',
                'businessAddress',
                'businessSize',
                'logo',
                'tier',
                'creditStatus',
              ],
              include: [{ model: Project, as: 'CompanyProjects' }],
            },
          ],
        },
      ],
    });

    const completedProject = bid.Owner.Builder.CompanyProjects.filter(
      (project) => project.status === ProjectStatus.COMPLETED,
    );

    return {
      ...bid.toJSON(),
      Owner: {
        ...bid.Owner.Builder.toJSON(),
        CompanyProjects: {
          totalProjects: bid.Owner.Builder.CompanyProjects.length || 0,
          completedProjects: completedProject.length || 0,
        },
      },
    };
  }

  async acceptTenderBid(
    tenderBidId: string,
    user: User,
  ): Promise<ProjectShares> {
    const dbTransaction = await this.sequelize.transaction();
    try {
      const bid = await this.tenderBidModel.findOne({
        where: { id: tenderBidId },
        include: [
          { model: ProjectTender },
          { model: User, as: 'Owner', include: [{ model: Builder }] },
        ],
      });

      if (!bid) {
        throw new BadRequestException(
          `Project Bid with id ${tenderBidId} not found`,
        );
      }

      const projectTender = bid.projectTender;
      if (
        projectTender.status === TenderStatus.AWARDED ||
        bid.status === BidStatus.ACCEPTED
      ) {
        throw new BadRequestException('Project has already been awarded');
      }

      bid.status = BidStatus.ACCEPTED;
      await bid.save();

      projectTender.status = TenderStatus.AWARDED;
      await projectTender.save();

      const sharedProject = await this.projectSharesModel.create(
        {
          status: Status.ACCEPTED,
          ProjectId: bid.ProjectId,
          FundManagerId: user.FundManagerId,
          BuilderId: bid.Owner.BuilderId,
          CreatedById: user.id,
        },
        { transaction: dbTransaction },
      );

      // Close/Reject All other Bids
      await this.rejectOtherBids(projectTender.id, bid.ProjectId, tenderBidId);
      await this.emailService.TenderbidAccepted(bid);
      return sharedProject;
    } catch (error) {
      dbTransaction.rollback();
      throw new BadRequestException(error.message);
    }
  }

  async rejectOtherBids(
    ProjectTenderId: string,
    ProjectId: string,
    TenderBidId: string,
  ) {
    const dbTransaction = await this.sequelize.transaction();
    await this.tenderBidModel.update(
      {
        status: BidStatus.REJECTED,
      },
      {
        where: {
          id: { [Op.ne]: TenderBidId },
          ProjectTenderId,
          ProjectId,
          status: BidStatus.PENDING,
        },
        transaction: dbTransaction,
      },
    );
  }

  async getProjectGroups(projectId: string): Promise<unknown[]> {
    const project = await this.projectModel.findOne({
      where: { id: projectId },
      include: [{ model: GroupName, include: [{ model: Project }] }],
    });

    if (!project) {
      throw new BadRequestException('Project not found');
    }
    const modifiedResponse = project.Groups.map((group) => {
      const projectsCount = group.projects?.length || 0;
      return {
        ...group.toJSON(),
        projectsCount,
      };
    });
    return modifiedResponse;
  }

  async approveProject(projectId: string, user: User) {
    const project = await this.getProjectOrThrow(projectId);
    if (project.status === ProjectStatus.APPROVED) {
      throw new BadRequestException(`Project already Completed`);
    }
    const updated = await this.projectModel.update(
      { status: ProjectStatus.APPROVED, UpdatedById: user.id },
      { where: { id: projectId }, returning: true },
    );
    const [affectedCount, affectedRows] = updated;

    return affectedRows[0];
  }
}
