import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Project, ProjectStatus, ProjectType } from './models/project.model';
import { User, UserType } from 'src/modules/user/models/user.model';
import { Builder } from '../builder/models/builder.model';
import { FundManager } from '../fund-manager/models/fundManager.model';
import {
  Op,
  Transaction as SequelizeTransaction,
  WhereOptions,
  where,
} from 'sequelize';
import { ProjectWalletService } from '../project-wallet/project-wallet.service';
import {
  MediaType,
  ProjectMedia,
} from '../project-media/models/project-media.model';
import { RfqQuote, RfqRequest } from '../rfq/models';
import {
  BaseProjectDto,
  DeleteProjectDocumentDto,
  updateProjectDto,
} from './dto/create-project.dto';
import { ProjectShares, Status } from './models/project-shared.model';
import {
  ProjectTender,
  TenderStatus,
  TenderType,
} from '../fund-manager/models/project-tender.model';
import { ProjectMediaService } from '../project-media/project-media.service';
import { ProjectWallet } from '../project-wallet/models/project-wallet.model';
import {
  PaystackWebhookRequestData,
  ProjectInviteBase,
  ProjectInviteType,
} from './types';
import { TenderBidDto } from '../builder/dto/submit-tender.dto';
import * as moment from 'moment';
import { ProjectGroupService } from './group.service';
import {
  extractEmailAndUUID,
  generatePassword,
  generateReference,
} from 'src/util/util';
import { ProjectGroup } from './models/project-group';
import { GroupName } from './models/group-name.model';
import { Invitation } from '../invitation/models/invitation.model';
import { EmailService } from '../email/email.service';
import { Documents } from '../documents/models/documents.model';
import { UserWallet } from '../user-wallet/models/user-wallet.model';
import {
  PaymentMethod,
  PaymentProvider,
  ProjectPaymentPurpose,
  ProjectTransaction,
  TransactionStatus,
  TransactionType,
} from '../project-wallet-transaction/models/project-transaction.model';
import { PaystackPaymentService } from '../payment/paystack-payment/paystcak-payment.service';
import { Sequelize } from 'sequelize-typescript';
import {
  Contract,
  ContractPaymentStatus,
  ContractStatus,
} from '../contract/models';
import { Order, OrderStatus } from '../order/models';
import { Commission } from '../escrow/models/commision.model';
import { Escrow, EscrowStatus } from '../escrow/models/escrow.model';
import { fundProjectWalletDto } from '../project-wallet/dto/contract-wallet-pay.dto';
@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project)
    private readonly projectModel: typeof Project,
    @InjectModel(User)
    private readonly userModel: typeof User,
    @InjectModel(ProjectGroup)
    private readonly projectGroupModel: typeof ProjectGroup,
    @InjectModel(ProjectShares)
    private readonly projectSharesModel: typeof ProjectShares,
    @InjectModel(FundManager)
    private readonly fundManagerModel: typeof FundManager,
    @InjectModel(Builder)
    private readonly builderModel: typeof Builder,
    @InjectModel(Documents)
    private readonly documentsModel: typeof Documents,
    @InjectModel(UserWallet)
    private readonly userWalletModel: typeof UserWallet,

    @InjectModel(ProjectTender)
    private readonly projectTenderModel: typeof ProjectTender,
    @InjectModel(ProjectWallet)
    private readonly projectWalletModel: typeof ProjectWallet,
    @InjectModel(Order)
    private readonly orderModel: typeof Order,
    @InjectModel(Contract)
    private readonly contractModel: typeof Contract,

    @InjectModel(ProjectTransaction)
    private readonly projectTransactionModel: typeof ProjectTransaction,
    @InjectModel(Escrow)
    private readonly escrowModel: typeof Escrow,
    @InjectModel(Commission)
    private readonly commissionModel: typeof Commission,

    @InjectModel(Invitation)
    private readonly invitationModel: typeof Invitation,

    private emailService: EmailService,
    private readonly projectWalletService: ProjectWalletService,
    private readonly projectGroupService: ProjectGroupService,
    private readonly projectMediaService: ProjectMediaService,
    private readonly paystackPaymentService: PaystackPaymentService,
    private sequelize: Sequelize,
  ) {}

  async createdProject({
    body,
    user,
    dbTransaction,
  }: {
    body: Partial<BaseProjectDto>;
    user: User;
    dbTransaction: SequelizeTransaction;
  }) {
    const { newFundManagers, newDevelopers = [], groupIds = [] } = body;
    const extractEmailAndUUIDDeveloperData = extractEmailAndUUID(newDevelopers);
    const extractEmailAndUUIDFundmanagerData =
      extractEmailAndUUID(newFundManagers);

    let groupData: GroupName | undefined;
    let projectType = ProjectType.COMPANY;
    let emailsToInvite = undefined;
    let platformBuilders: Builder[] = undefined;
    if (
      user.userType == UserType.BUILDER &&
      extractEmailAndUUIDFundmanagerData?.uuids?.length > 0
    ) {
      projectType = ProjectType.INVITE;
    } else if (user.userType == UserType.FUND_MANAGER) {
      if (!(groupIds?.length > 0)) {
        groupData = await this.projectGroupService.createGroup({
          body: {
            description:
              body.newGroupCreateInfo.description ||
              `${user?.name}-${body?.title}`,
            name:
              body.newGroupCreateInfo.name || `Group-${generatePassword(5)}`,
          },
          user,
          dbTransaction,
        });
      }

      if (
        (extractEmailAndUUIDDeveloperData.uuids &&
          extractEmailAndUUIDDeveloperData.uuids.length > 0) ||
        (extractEmailAndUUIDDeveloperData.emails &&
          extractEmailAndUUIDDeveloperData.emails.length > 0)
      ) {
        projectType = ProjectType.INVITE;
        platformBuilders = await this.builderModel.findAll({
          where: {
            email: {
              [Op.in]: extractEmailAndUUIDDeveloperData.emails,
            },
          },
        });
      } else {
        projectType = ProjectType.REQUEST;
      }
    }

    try {
      const image =
        body.projectMedia && body.projectMedia.length
          ? body.projectMedia[0]?.url
          : '';
      const newProject = await this.projectModel.create(
        {
          ...body,
          image: image,
          ownerId: user.id,
          status: ProjectStatus.PENDING,
          CreatedById: user.id,
          ProjectType: projectType,
        },
        { transaction: dbTransaction },
      );
      const { projectDocuments } = body;
      if (projectDocuments && projectDocuments.length > 0) {
        projectDocuments.map(async (doc) => {
          await this.documentsModel.create(
            {
              ...doc,
              recordId: doc?.url || '',
              projectId: newProject.id,
              UserId: user.id,
              others: {
                description: doc?.description || '',
                url: doc?.url || '',
                title: doc?.title || '',
              },
            },
            { transaction: dbTransaction },
          );
        });
      }
      if (groupIds.length > 0) {
        const bulkGroup = groupIds?.map((groupId) => {
          return {
            ProjectId: newProject.id,
            GroupNameId: groupId,
          };
        });
        await this.projectGroupModel.bulkCreate(bulkGroup, {
          transaction: dbTransaction,
        });
      } else {
        await this.projectGroupService.addProjectToGroup({
          body: {
            ProjectId: newProject?.id,
            GroupNameId: groupData?.id,
          },
          user,
          dbTransaction,
        });
      }

      await this.projectMediaService.bulkUploadProjectMedia({
        body: body?.projectMedia?.map((d) => {
          return { ...d, ProjectId: newProject?.id };
        }),
        dbTransaction,
        user,
      });

      if (platformBuilders) {
        const bulkData = platformBuilders.map((builder) => {
          return {
            ProjectId: newProject.id,
            FundManagerId: user.FundManagerId,
            BuilderId: builder.id,
            status: Status.PENDING,
            CreatedById: user.id,
          };
        });

        await Promise.all(
          bulkData.map(async (data) => {
            const [shared, created] =
              await this.projectSharesModel.findOrCreate({
                where: {
                  ProjectId: data.ProjectId,
                  FundManagerId: data.FundManagerId,
                  BuilderId: data.BuilderId,
                },
                defaults: {
                  status: data.status,
                  CreatedById: data.CreatedById,
                },
                transaction: dbTransaction,
              });
            return shared;
          }),
        );
      }

      const projectWallet = await this.projectWalletService.createWallet(
        {
          ProjectId: newProject.id,
        },
        dbTransaction,
      );
      if (
        user.userType == UserType.BUILDER &&
        extractEmailAndUUIDFundmanagerData.uuids
      ) {
        await this.addFundManagerToProject({
          builder: user.Builder,
          ProjectId: newProject.id,
          fundManagerIds: extractEmailAndUUIDFundmanagerData.uuids,
          dbTransaction,
        });
      } else if (extractEmailAndUUIDDeveloperData.uuids) {
        await this.addBuilderToProject({
          fundManager: user.FundManager,
          ProjectId: newProject.id,
          BuilderIds: extractEmailAndUUIDDeveloperData.uuids || [],
          dbTransaction,
        });
      }

      newProject.walletId = projectWallet?.id;
      await newProject.save({ transaction: dbTransaction });
      if (user.userType == UserType.FUND_MANAGER) {
        const buildersToBeAdded = await this.builderModel.findAll({
          where: {
            id: {
              [Op.in]: extractEmailAndUUIDDeveloperData.uuids,
            },
          },
        });

        const validBuilders = buildersToBeAdded.map(
          (builder: Builder) => builder.id,
        );
        if (
          validBuilders.length > 0 ||
          extractEmailAndUUIDDeveloperData.emails.length > 0
        ) {
          newProject.ProjectType = ProjectType.INVITE;
        } else {
          newProject.ProjectType = ProjectType.REQUEST;
        }
        await this.projectTenderModel.create(
          {
            ProjectId: newProject.id,
            ownerId: user.id,
            CreatedById: user.id,
            tenderType:
              (validBuilders && validBuilders?.length > 0) ||
              extractEmailAndUUIDDeveloperData.emails.length > 0
                ? TenderType.INVITE
                : TenderType.REQUEST,
            status: TenderStatus.ONGOING,
            budget: newProject.budgetAmount,
            startDate: newProject.startDate,
            logo: user.FundManager?.logo,
            endDate: newProject.endDate,
            invitedBuilders: validBuilders.concat(
              extractEmailAndUUIDDeveloperData.emails,
            ),
          },
          { transaction: dbTransaction },
        );
      }

      try {
        extractEmailAndUUIDDeveloperData.emails?.forEach(async (d) => {
          const [newInvite] = await this.invitationModel.findOrCreate({
            defaults: {
              projectId: newProject.id,
              FundManagerId: user.FundManagerId || '',
              buyerEmail: d || '',
            },
            where: {
              CreatedById: user.id,
              buyerEmail: d,
            },
          });
          await this.emailService.platformInvitationsEmailToBuilder({
            invitationId: newInvite.id,
            projectId: newProject.id,
            phoneNumber: '',
            inviteeName: user.name,
            toName: d,
            toEmail: d,
            message: `Hi You have project invitation from ${user.name}, Please register to cutstruct platform to see details of the project`,
          });
        });
      } catch (error) {}

      return await newProject.save({ transaction: dbTransaction });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async updateProjectForFundManager({
    projectId,
    body,
    user,
    dbTransaction,
  }: {
    projectId: string;
    body: Partial<BaseProjectDto>;
    user: User;
    dbTransaction?: SequelizeTransaction;
  }) {
    const project = await this.getProjectOrThrow(projectId);
    const { newFundManagers, newDevelopers = [], groupIds = [] } = body;
    const extractEmailAndUUIDDeveloperData = extractEmailAndUUID(newDevelopers);

    let groupData: GroupName | undefined;
    let projectType = ProjectType.COMPANY;
    if (user.userType == UserType.FUND_MANAGER) {
      if (!(groupIds?.length > 0)) {
        groupData = await this.projectGroupService.createGroup({
          body: {
            description: `${user?.name}-${body?.title}`,
            name: `Group-${generatePassword(5)}`,
          },
          user,
          dbTransaction,
        });
      }

      if (
        (extractEmailAndUUIDDeveloperData.uuids &&
          extractEmailAndUUIDDeveloperData.uuids.length > 0) ||
        (extractEmailAndUUIDDeveloperData.emails &&
          extractEmailAndUUIDDeveloperData.emails.length > 0)
      ) {
        projectType = ProjectType.INVITE;
        const platformBuilders = await this.builderModel.findAll({
          where: {
            email: {
              [Op.in]: extractEmailAndUUIDDeveloperData.emails,
            },
          },
        });

        const existingBuildersEmail = platformBuilders?.map(
          (builder: Builder) => builder.email,
        );
        const emailsToInvite = extractEmailAndUUIDDeveloperData.emails.filter(
          (email) => !existingBuildersEmail.includes(email),
        );
        try {
          emailsToInvite?.forEach(async (d) => {
            await this.emailService.platformInvitationsEmailToBuilder({
              invitationId: '',
              phoneNumber: '',
              projectId: projectId,
              inviteeName: user.name,
              toName: d,
              toEmail: d,
              message: `Hi You have project invitation from ${user.name}, Please register to cutstruct platform to see details of the project`,
            });
          });
        } catch (error) {}
      } else {
        projectType = ProjectType.REQUEST;
      }
    }

    try {
      await this.projectModel.update(
        {
          ...body,
          image: body.projectMedia[0]?.url || '',
          ownerId: user.id,
          status: ProjectStatus.PENDING,
          ProjectType: projectType,
        },
        { where: { id: projectId }, transaction: dbTransaction },
      );
      if (groupIds.length > 0) {
        const bulkGroup = groupIds?.map((groupId) => {
          return {
            ProjectId: project.id,
            GroupNameId: groupId,
          };
        });
        await this.projectGroupModel.bulkCreate(bulkGroup, {
          transaction: dbTransaction,
        });
      } else {
        await this.projectGroupService.addProjectToGroup({
          body: {
            ProjectId: project.id,
            GroupNameId: groupData?.id,
          },
          user,
          dbTransaction,
        });
      }

      await this.projectMediaService.bulkUploadProjectMedia({
        body: body?.projectMedia?.map((d) => {
          return { ...d, ProjectId: project.id };
        }),
        dbTransaction,
        user,
      });

      if (extractEmailAndUUIDDeveloperData.uuids) {
        await this.addBuilderToProject({
          fundManager: user.FundManager,
          ProjectId: project.id,
          BuilderIds: extractEmailAndUUIDDeveloperData.uuids || [],
          dbTransaction,
        });
      }
      if (user.userType == UserType.FUND_MANAGER) {
        const buildersToBeAdded = await this.builderModel.findAll({
          where: {
            id: {
              [Op.in]: extractEmailAndUUIDDeveloperData.uuids,
            },
          },
        });

        const validBuilders = buildersToBeAdded.map(
          (builder: Builder) => builder.id,
        );
        if (
          validBuilders.length > 0 ||
          extractEmailAndUUIDDeveloperData.emails.length > 0
        ) {
          project.ProjectType = ProjectType.INVITE;
        } else {
          project.ProjectType = ProjectType.REQUEST;
        }
        await project.save({ transaction: dbTransaction });
        await this.projectTenderModel.update(
          {
            tenderType:
              (validBuilders && validBuilders?.length > 0) ||
              extractEmailAndUUIDDeveloperData.emails.length > 0
                ? TenderType.INVITE
                : TenderType.REQUEST,
            status: TenderStatus.ONGOING,
            budget: project.budgetAmount,
            startDate: project.startDate,
            logo: user.FundManager?.logo,
            endDate: project.endDate,
            invitedBuilders: validBuilders.concat(
              extractEmailAndUUIDDeveloperData.emails,
            ),
          },
          { transaction: dbTransaction, where: { id: project.id } },
        );
      }
      return project;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async updateProjectForBuilder(
    projectId: string,
    data: updateProjectDto,
    user: User,
  ) {
    const dbTransaction = await this.sequelize.transaction();
    const { newFundManagers, projectMedia, ...rest } = data;
    try {
      if (!projectId) {
        throw new BadRequestException(' projectId cannot be empty');
      }

      if (projectMedia) {
        await this.projectMediaService.bulkUploadProjectMedia({
          body: data?.projectMedia?.map((d) => {
            return { ...d, ProjectId: projectId };
          }),
          user,
          dbTransaction,
        });
      }
      if (user.userType == UserType.BUILDER && newFundManagers) {
        await this.addFundManagerToProject({
          builder: user.Builder,
          ProjectId: projectId,
          fundManagerIds: newFundManagers,
          dbTransaction,
        });
      }
      await this.projectModel.update(
        {
          ...rest,
          image: projectMedia[0]?.url || '',
        },
        { where: { id: projectId } },
      );
      await dbTransaction.commit();
      return { message: 'Project updated successfully' };
    } catch (err) {
      dbTransaction.rollback();
      throw new BadRequestException(err.message);
    }
  }

  async addFundManagerToProject({
    builder,
    ProjectId,
    fundManagerIds,
    dbTransaction,
  }: {
    builder: Builder;
    ProjectId: string;
    fundManagerIds: string[];
    dbTransaction: SequelizeTransaction;
  }) {
    try {
      const fundManagersToBeAdded = await this.fundManagerModel.findAll({
        where: {
          id: {
            [Op.in]: fundManagerIds,
          },
        },
      });

      const validManagers = fundManagersToBeAdded?.map(
        (managers: FundManager) => managers.id,
      );

      const bulkCreateData = validManagers?.map((managerId) => {
        return {
          BuilderId: builder.id,
          status: Status.PENDING,
          ProjectId,
          createdAt: new Date(),
          FundManagerId: managerId,
          CreatedById: builder.ownerId,
        };
      });

      await this.projectSharesModel.bulkCreate(bulkCreateData, {
        transaction: dbTransaction,
        ignoreDuplicates: true,
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async addBuilderToProject({
    fundManager,
    ProjectId,
    BuilderIds,
    dbTransaction,
  }: {
    fundManager: FundManager;
    ProjectId: string;
    BuilderIds: string[];
    dbTransaction: SequelizeTransaction;
  }) {
    try {
      const buildersToBeAdded = await this.builderModel.findAll({
        where: {
          id: {
            [Op.in]: BuilderIds,
          },
        },
      });

      const validBuilders = buildersToBeAdded?.map(
        (builder: Builder) => builder.id,
      );

      const bulkCreateData = validBuilders?.map((builderId) => {
        return {
          BuilderId: builderId,
          status: Status.PENDING,
          ProjectId,
          createdAt: new Date(),
          FundManagerId: fundManager.id,
          CreatedById: fundManager.ownerId,
        };
      });

      await this.projectSharesModel.bulkCreate(bulkCreateData, {
        transaction: dbTransaction,
        ignoreDuplicates: true,
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
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

  async deleteProjectMediaOrDocument(
    projectId: string,
    data: DeleteProjectDocumentDto,
    user: User,
  ) {
    const { projectMediaId, projectDocumentId } = data;
    const projectData = await this.getProjectOrThrow(projectId);
    if (projectData.CreatedById !== user.id && user.userType !== 'ADMIN')
      throw new BadRequestException(
        `You dont have permission to delete this project media or document, you didnt create it`,
      );
    if (projectMediaId) {
      await this.projectMediaService.getProjectMediaOrthrow(projectMediaId);
      await this.projectMediaService.deleteMedia(projectMediaId);
    }

    if (projectDocumentId) {
      await this.documentsModel.findByPkOrThrow(projectDocumentId);
      await this.documentsModel.destroy({ where: { id: projectDocumentId } });
    }
    return { message: 'Media deleted successfully' };
  }

  async getProjectOrThrow(id: string) {
    return await this.projectModel.findByPkOrThrow(id, {
      include: [
        { model: FundManager },
        { model: Builder },
        { model: ProjectMedia, as: 'Medias' },
        { model: RfqRequest },
        { model: ProjectWallet },
        { model: Documents },
        {
          model: User,
          as: 'Owner',
          include: [{ model: FundManager }, { model: Builder }],
        },
      ],
    });
  }

  async getProjectWallet(id: string) {
    return await this.projectWalletModel.findOne({
      where: { ProjectId: id },
      include: [{ model: Project }, { model: ProjectTransaction }],
    });
  }

  async getProjectInvitations({
    user,
  }: {
    user: User;
  }): Promise<ProjectInviteBase[] | []> {
    const whereOptions: WhereOptions<ProjectShares> = {};
    if (user.BuilderId) whereOptions.BuilderId = user.BuilderId;
    if (user.FundManagerId) whereOptions.FundManagerId = user.FundManagerId;

    const allData = await this.projectTenderModel.findAll({
      order: [['createdAt', 'DESC']],
      include: [{ model: Project }],
    });
    const processInvitations: ProjectInviteType[] = allData.map(
      (data: ProjectTender) => {
        const outData: ProjectInviteType = {
          projectName: data.Project.title,
          projectId: data.ProjectId,
          logo: data.logo,
          ProjectTenderId: data.id,
          blacklistedBuilders: data.blacklistedBuilders,
          invitedBuilders: data.invitedBuilders,
          location: data.Project.location,
          fundManagerLogo: data.logo,
          BOQ: data.BOQ,
          type: data.tenderType,
          startDate: data.startDate,
        };
        return outData;
      },
    );
    const resData: ProjectInviteBase[] = processInvitations.map(
      (d: ProjectInviteType) => {
        const isBlackListed = d?.blacklistedBuilders?.some(
          () => user.BuilderId,
        );
        const isInvited = d?.invitedBuilders?.some(
          (d) =>
            d == user.BuilderId || d == user.email || d == user.Builder.email,
        );
        if (isBlackListed) {
          return undefined;
        } else if (d.type == TenderType.INVITE) {
          if (isInvited) {
            return {
              ...d,
              invitedBuilders: undefined,
              blacklistedBuilders: undefined,
            };
          } else {
            return undefined;
          }
        } else {
          return {
            ...d,
            invitedBuilders: undefined,
            blacklistedBuilders: undefined,
          };
        }
      },
    );
    return resData.filter((d) => d != null || d != undefined);
  }

  /**
   * Retrieves all projects associated with the given user.
   * @param {User} user - The user for whom to fetch projects.
   * @returns {Promise<unknown[]>} An array of projects.
   */
  async getAllUserProject(userId: string): Promise<Project[]> {
    return await this.projectModel.findAll({
      where: {
        ownerId: userId,
      },
      include: [
        { all: true },
        { model: User, as: 'CreatedBy', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'UpdatedBy', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'Owner', attributes: ['id', 'name', 'email'] },
        { model: ProjectWallet },
      ],
      order: [['createdAt', 'DESC']],
    });
  }

  /**
   * Retrieves all projects associated with the given user.
   * @param {User} user - The user for whom to fetch projects.
   * @returns {Promise<unknown[]>} An array of projects.
   */
  async getUserProjectByDate(
    user: User,
    dateFilter: number,
  ): Promise<Project[]> {
    return await this.projectModel.findAll({
      where: {
        ownerId: user.id,
        createdAt: {
          [Op.gte]: moment().subtract(dateFilter, 'd').format('YYYY-MM-DD'),
        },
      },
    });
  }

  /**
   * Retrieves all projects associated with the given user.
   * @returns {Promise<unknown[]>} An array of projects.
   */
  async getAllProjects(): Promise<Project[]> {
    return await this.projectModel.findAll({
      where: { status: ProjectStatus.ACTIVE },
      include: [{ all: true }],
      order: [['createdAt', 'DESC']],
    });
  }

  /**
   * Retrieves all projects associated with the given user.
   * @param {User} user - The user for whom to fetch projects.
   * @returns {Promise<unknown[]>} An array of projects.
   */
  async getUserProjectBids(id: string): Promise<Project[]> {
    return await this.projectModel.findAll({
      where: {
        id,
      },
      include: [
        { model: Builder },
        { model: RfqRequest, include: [{ model: RfqQuote }] },
      ],
    });
  }

  async fundProjectWalletFromUserVault(id: string, amount: number, user: User) {
    const dbTransaction = await this.sequelize.transaction();
    try {
      const project = await this.projectModel.findOne({
        where: {
          id,
          ownerId: user.id,
        },
        include: [{ model: ProjectWallet }],
      });

      const userWallet = await this.userWalletModel.findOne({
        where: {
          UserId: user.id,
        },
      });

      if (!project) throw new NotFoundException('User project does not exist');

      const projectWallet = await this.projectWalletModel.findOrCreate({
        where: {
          ProjectId: project.id,
        },
      });
      if (userWallet.balance < amount)
        throw new ConflictException('sorry insufficient funds');

      await this.userWalletModel.decrement(
        {
          balance: amount,
        },
        { where: { UserId: user.id }, transaction: dbTransaction },
      );

      const [affectedRows] = await this.projectWalletModel.increment(
        {
          balance: amount,
        },
        { where: { id: projectWallet[0].id }, transaction: dbTransaction },
      );
      const reference = generateReference();
      await this.projectTransactionModel.create(
        {
          walletId: userWallet.id,
          ProjectWalletId: project.ProjectWallet.id,
          amount,
          ProjectId: project.id,
          description: project.description,
          userType: TransactionType.TRANSFER,
          status: TransactionStatus.COMPLETED,
          fee: 0,
          paymentMethod: PaymentMethod.CUTSTRUCT_PAY,
          paymentProvider: PaymentProvider.CUTSTRUCT,
          reference,
          CreatedById: user.id,
        },
        { transaction: dbTransaction },
      );
      await dbTransaction.commit();

      return affectedRows[0];
    } catch (error) {
      dbTransaction.rollback();
      throw new BadRequestException(error.message);
    }
  }

  async fundProjectWalletByPaystack(
    body: fundProjectWalletDto,
    user: User,
  ): Promise<any> {
    const { projectId, orderId, amount, paymentPurpose, paymentMethod } = body;
    const dbTransaction = await this.sequelize.transaction();
    try {
      const project = await this.projectModel.findOne({
        where: {
          id: projectId,
          ownerId: user.id,
        },
        include: [{ model: ProjectWallet }],
      });

      const builderProject = await this.projectModel.findOne({
        where: { id: projectId },
        include: [
          {
            model: Builder,
            where: {
              ownerId: user.id,
            },
          },
        ],
      });

      if (!builderProject && !project)
        throw new NotFoundException(
          'sorry you are not a member of this project',
        );

      const userWallet = await this.userWalletModel.findOne({
        where: {
          UserId: user.id,
        },
      });

      const projectWallet = await this.projectWalletModel.findOrCreate({
        where: {
          ProjectId: project.id,
        },
      });
      if (orderId) {
        const order = await this.orderModel.findOne({
          where: {
            id: orderId,
            [Op.or]: [
              { BuilderId: user.BuilderId },
              { FundManagerId: user.FundManagerId },
            ],
          },
        });
        if (!order) throw new NotFoundException('order does not exist');
      }

      const reference = generateReference();
      const data = {
        userId: user.id,
        reference,
        email: user.email,
        amount: amount,
        metadata: {
          projectId: project.id,
          order: orderId,
          paymentPurpose,
        },
      };

      await this.projectTransactionModel.create(
        {
          walletId: userWallet.id,
          ProjectWalletId: projectWallet[0].id,
          amount,
          ProjectId: project.id,
          description: ProjectPaymentPurpose.FUND_PROJECT_WALLET
            ? 'project wallet funded'
            : 'FUND_WALLET',
          userType: TransactionType.DEPOSIT,
          status: TransactionStatus.PENDING,
          fee: 0,
          paymentMethod,
          paymentPurpose,
          paymentProvider: PaymentProvider.PAYSTACK,
          reference,
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

  async verifyPaystackPayment(data: PaystackWebhookRequestData): Promise<any> {
    const dbTransaction = await this.sequelize.transaction();
    try {
      const { userId, reference, amount, metadata } = data;
      const amountInNaira = amount / 100;
      const transaction = await this.projectTransactionModel.findOne({
        where: {
          reference,
        },
      });
      if (!transaction) throw new NotFoundException('transaction not found');

      await this.userWalletModel.increment(
        {
          balance: amountInNaira,
        },
        { where: { id: transaction.walletId }, transaction: dbTransaction },
      );

      if (
        transaction.paymentPurpose === ProjectPaymentPurpose.FUND_PROJECT_WALLET
      ) {
        await this.projectWalletModel.increment(
          {
            balance: amountInNaira,
          },
          {
            where: { id: transaction.ProjectWalletId },
            transaction: dbTransaction,
          },
        );

        await this.userWalletModel.decrement(
          {
            balance: amountInNaira,
          },
          {
            where: { id: transaction.walletId },
            transaction: dbTransaction,
          },
        );

        await this.projectTransactionModel.update(
          {
            status: TransactionStatus.COMPLETED,
          },
          {
            where: { id: transaction.id },
            transaction: dbTransaction,
          },
        );
      }

      // do for order
      if (transaction.paymentPurpose === ProjectPaymentPurpose.FUND_ORDER) {
        await this.contractModel.update(
          {
            status: ContractStatus.ACCEPTED,
            paymentStatus: ContractPaymentStatus.CONFIRMED,
          },
          {
            where: { ProjectId: metadata.projectId },
            transaction: dbTransaction,
          },
        );

        await this.orderModel.update(
          {
            status: OrderStatus.PAID,
          },
          {
            where: { id: metadata.orderId },
            transaction: dbTransaction,
            returning: true,
          },
        );

        const commission = await this.commissionModel.findOne({
          where: {
            active: true,
          },
        });

        const commision = (commission.percentageNumber / 100) * amount;
        const order = await this.orderModel.findOne({
          where: { id: metadata.orderId },
        });

        if (!order) throw new NotFoundException('order does not exist');
        const contract = await this.contractModel.findOne({
          where: { ProjectId: order.ProjectId },
        });

        if (!contract) throw new NotFoundException('contract does not exist');

        await this.escrowModel.create(
          {
            orderId: metadata.orderId,
            contractId: contract.id,
            projectId: metadata.projectId,
            rfqRequestId: order.RfqRequestId,
            initialPrice: amountInNaira,
            commisionPercentage: commission.percentageNumber,
            commisionValue: commision,
            finalAmount: amountInNaira - commision,
            status: EscrowStatus.PENDING,
          },
          { transaction: dbTransaction },
        );

        await this.projectModel.update(
          {
            status: ProjectStatus.ACTIVE,
          },
          {
            where: { id: metadata.projectId },
            transaction: dbTransaction,
          },
        );

        await this.projectTransactionModel.update(
          {
            status: TransactionStatus.COMPLETED,
          },
          {
            where: { id: transaction.id },
            transaction: dbTransaction,
          },
        );

        await this.projectModel.increment(
          {
            amountSpent: amountInNaira,
          },
          {
            where: { id: metadata.projectId },
            transaction: dbTransaction,
          },
        );

        await this.projectTransactionModel.create(
          {
            walletId: transaction.walletId,
            ProjectWalletId: transaction.ProjectWalletId,
            amount: amountInNaira,
            ProjectId: metadata.projectId,
            description: 'order funded',
            userType: TransactionType.DEPOSIT,
            status: TransactionStatus.COMPLETED,
            fee: commision,
            paymentMethod: PaymentMethod.CREDIT_CARD,
            paymentProvider: PaymentProvider.CUTSTRUCT,
            paymentPurpose: ProjectPaymentPurpose.FUND_ORDER,
            reference: generateReference(),
            CreatedById: userId,
          },
          { transaction: dbTransaction },
        );
        await dbTransaction.commit();
      }

      await dbTransaction.commit();
      return;
    } catch (error) {
      dbTransaction.rollback();
      throw new BadRequestException(error.message);
    }
  }
}
