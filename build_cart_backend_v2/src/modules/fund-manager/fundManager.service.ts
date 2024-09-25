import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FundManager } from './models/fundManager.model';
import { UserService } from 'src/modules/user/user.service';
import { User, UserStatus, UserType } from 'src/modules/user/models/user.model';
import {
  SharedProject,
  SharedProjectStatus,
} from '../shared-project/models/shared-project.model';
import { Project, ProjectStatus } from '../project/models/project.model';
import { Builder } from '../builder/models/builder.model';
import {
  RfqItem,
  RfqQuote,
  RfqRequest,
  RfqRequestMaterial,
} from '../rfq/models';
import { Vendor } from '../vendor/models/vendor.model';
import { Contract, ContractStatus } from '../contract/models';
import { UserTransaction } from '../user-wallet-transaction/models/user-transaction.model';
import { UserTransactionService } from '../user-wallet-transaction/user-transaction.service';
import { MyFundManagerService } from '../my-fundManager/my-fundManager.service';
import { MyFundManager } from '../my-fundManager/models/myFundManager.model';
import { ProjectTransactionUser } from '../shared-wallet-transaction/shared-transactions.model';
import { ProjectTransaction } from '../project-wallet-transaction/models/project-transaction.model';
import { ChangePasswordDto } from './dto/ChangePasswordDto.dto';
import { Sequelize } from 'sequelize-typescript';
import { RbacServices } from '../rbac/rbac.services';
import { MEMBER_POSITION } from '../rbac/dtos/create-teamMember.dto';
import { Team } from '../rbac/models/team.model';
import { TeamMember } from '../rbac/models/user-teammembers.model';
import { UserRole } from '../rbac/models/user-role.model';
import { Role } from '../rbac/models/role.model';
import { SystemRolls } from '../auth/types';
import { EmailService } from '../email/email.service';
import { PlatformInvitation } from '../invitation/dto/platformInvitation.dto';
import { UserWalletService } from '../user-wallet/user-wallet.service';
import { genAccountNumber } from 'src/util/util';
import { OrderService } from '../order/order.services';
import { Order } from '../order/models';
import { RegisterFundManagerDto, UpdateRegisterFundManagerDto } from './dto';
import { Transaction } from 'sequelize';
import { NewFundManager } from './dto/reg-fund-manager.dto';
import { ProjectWallet } from '../project-wallet/models/project-wallet.model';
import { GetOverviewDto } from '../builder/dto/get-overview.dto';
import { ProjectService } from '../project/project.service';
import { RfqService } from '../rfq/rfq.service';
import { ProjectFundManager } from '../project-fundManager/model/projectFundManager.model';
import { InvitationService } from '../invitation/invitation.service';
import { BuilderFundManager } from '../project/models/builder-fundManager-project.model';
import { ProjectShares, Status } from '../project/models/project-shared.model';
import { RemitaPaymentService } from '../payment/remiter-payment/remitter-payment.service';
import { PaymentType } from '../payment/remiter-payment/dto/remiter-contractPay-dto';

@Injectable()
export class FundManagerService {
  constructor(
    @InjectModel(FundManager)
    private readonly fundManagerModel: typeof FundManager,
    @InjectModel(SharedProject)
    private readonly sharedProjectModel: typeof SharedProject,
    @InjectModel(Project)
    private readonly projectModel: typeof Project,
    @InjectModel(Contract)
    private readonly contractModel: typeof Contract,
    @InjectModel(Order)
    private readonly orderModel: typeof Order,
    @InjectModel(User)
    private readonly userModel: typeof User,
    @InjectModel(RfqRequest)
    private readonly rfqRequestModel: typeof RfqRequest,
    @InjectModel(Team)
    private readonly teamModel: typeof Team,
    @InjectModel(TeamMember)
    private readonly teamMembermodel: typeof TeamMember,
    @InjectModel(UserTransaction)
    private readonly projectTransactionModel: typeof ProjectTransaction,
    @InjectModel(ProjectFundManager)
    private readonly projectFundManagerModel: typeof ProjectFundManager,
    @InjectModel(MyFundManager)
    private readonly myFundManagerModel: typeof MyFundManager,
    @InjectModel(UserRole)
    private readonly userRoleModel: typeof UserRole,
    @InjectModel(ProjectTransactionUser)
    private readonly projectTransactionUserModel: typeof ProjectTransactionUser,
    @InjectModel(BuilderFundManager)
    private readonly builderFundManagerModel: typeof BuilderFundManager,
    @InjectModel(ProjectShares)
    private readonly projectSharesModel: typeof ProjectShares,
    private readonly emailServices: EmailService,
    private readonly userTransactionService: UserTransactionService,
    private readonly myFundManagerService: MyFundManagerService,
    private readonly userWalletService: UserWalletService,
    private readonly rbacService: RbacServices,
    private readonly sequelize: Sequelize,
    private userService: UserService,
    private orderService: OrderService,
    private readonly projectService: ProjectService,
    private readonly rfqService: RfqService,
    private inviteService: InvitationService,
    private remittancePaymentService: RemitaPaymentService,
  ) {}
  /**
   * Registers a new FundManager and creates a user associated with the FundManager
   * @param registerSponsorDto DTO containing FundManager information and password
   * @param Creator the admin creating this fundManager
   * @returns empty object
   * @throws BadRequestException if the email provided is already in use
   */
  async AdminRegisterSponsor({
    body,
    creator,
  }: {
    body: RegisterFundManagerDto;
    creator: User;
  }) {
    await this.checkSponsorExistence(body.email);
    const dbTransaction = await this.sequelize.transaction();
    try {
      const sposnorUserData = await this.userModel.findOne({
        where: { email: body.email },
      });
      if (sposnorUserData) throw new BadRequestException('user already exist');
      const fundManagerData = await this.fundManagerModel.create(
        {
          ...body,
          createdAt: new Date(),
        },
        { transaction: dbTransaction },
      );

      const newUserData = await this.userModel.create(
        {
          ...body,
          businessName: body.businessName
            ? body.businessName
            : sposnorUserData.businessName,
          CreatedById: creator.id,
          FundManagerId: fundManagerData.id,
          createdAt: new Date(),
          userType: UserType.FUND_MANAGER,
          emailVerified: true,
          acceptTerms: true,
          status: UserStatus.ACTIVE,
        },
        { transaction: dbTransaction },
      );
      const account_number = await genAccountNumber(newUserData.id);
      const userWallet = await this.userWalletService.createWallet(
        {
          UserId: newUserData?.id,
          CreatedById: newUserData?.id,
          account_number,
        },
        dbTransaction,
      );
      newUserData.walletId = userWallet?.id;
      await newUserData.save({ transaction: dbTransaction });

      const newTeam = await this.teamModel.create(
        {
          name:
            `Team_${fundManagerData.businessName}` ||
            `Team_${fundManagerData.businessName}`,
          ownerId: newUserData.id,
          createdAt: new Date(),
          createdById: newUserData.id,
        },
        { transaction: dbTransaction },
      );
      const ownerRole = await Role.findOrCreate({
        where: {
          name: SystemRolls.OWNER,
        },
        transaction: dbTransaction,
      });
      await this.userRoleModel.create(
        {
          UserId: newUserData.id,
          RoleId: ownerRole[0].id,
        },
        { transaction: dbTransaction },
      );
      await this.teamMembermodel.create(
        {
          TeamId: newTeam.id,
          UserId: newUserData.id,
          position: MEMBER_POSITION.OWNER,
          createdAt: new Date(),
          createdById: newUserData.id,
        },
        { transaction: dbTransaction },
      );
      dbTransaction.commit();
      await this.emailServices.sendAccountCreated({
        email: body.email,
        password: body.password,
        userType: UserType.FUND_MANAGER,
      });
      return newUserData;
    } catch (error) {
      dbTransaction.rollback;
      throw new BadRequestException(
        'error occurred while creating fundManager please try again',
      );
    }
  }

  /**
   * Registers a new Builder with the provided email and password.
   *
   * @param CreateFundManagerDto The DTO containing the email and password of the new Builder.
   * @returns The created Builder with a generated email OTP.
   * @throws BadRequestException if the provided email is already in use.
   */
  async registerFundManager({
    body,
    invitationId,
    dbTransaction,
  }: {
    body: NewFundManager;
    invitationId?: string;
    dbTransaction?: Transaction;
  }) {
    if (!dbTransaction) {
      dbTransaction = await this.sequelize.transaction();
    }

    console.warn('Register Fund Manager Invite ID:', invitationId);

    try {
      const userData = await this.userService.getUserById(body.UserId);
      const personaData = await this.fundManagerModel.findOne({
        where: { email: userData.email },
      });
      if (!userData || !userData.emailVerified || personaData) {
        throw new BadRequestException(
          'There was an error in the registration process or account not verified yet or email already in use. Please try again or verify your account details.',
        );
      }

      const newFundManager = await this.fundManagerModel.create(
        {
          ...body,
          phone: userData.phoneNumber,
          ownerId: userData.id,
          businessName: userData?.businessName,
          email: userData.email,
          createdAt: new Date(),
          lastLogin: new Date(),
        },
        { transaction: dbTransaction },
      );

      const updateData = await User.update(
        {
          FundManagerId: newFundManager.id,
          FundManager: newFundManager,
          userType: UserType.FUND_MANAGER,
          updatedAt: new Date(),
          UpdatedById: body.UserId,
        },
        {
          where: {
            id: body.UserId,
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

      // NOTE: Check the invitation here
      await this.inviteFundManagerFromBuilder(
        invitationId,
        newFundManager.id,
        dbTransaction,
      );

      await dbTransaction.commit();

      return affectedRows[0];
    } catch (error) {
      await dbTransaction.rollback();
      throw new BadRequestException(error.message);
    }
  }

  async inviteFundManagerFromBuilder(
    invitationId: string,
    fundManagerId: string,
    dbTransaction: Transaction,
  ) {
    if (!invitationId) return;
    const invitation = await this.inviteService.getInvitationById(invitationId);

    if (!invitation) return;
    if (invitation.CreatedBy?.userType === UserType.BUILDER) {
      // We will add the fund manager to the builder
      const builderId = invitation.CreatedBy?.BuilderId;
      await this.builderFundManagerModel.findOrCreate({
        where: {
          BuilderId: builderId,
          FundManagerId: fundManagerId,
        },
        defaults: {
          ProjectId: invitation.projectId ?? null,
        },
        transaction: dbTransaction,
      });
      if (invitation.projectId) {
        // Create a shared project between the builder and the fund manager
        await this.projectSharesModel.findOrCreate({
          where: {
            ProjectId: invitation.projectId,
            FundManagerId: fundManagerId,
            BuilderId: builderId,
          },
          defaults: {
            status: Status.PENDING,
            CreatedById: invitation.CreatedById,
          },
          transaction: dbTransaction,
        });
      }
    } else {
      console.warn('Invitation Builder Not Found:', invitation);
    }
  }

  /**
   * Checks if a builder with the given email already exists in the database
   * @param email The email to check for existence
   * @throws BadRequestException if a builder with the email already exists
   */
  async checkBuilderExistence(email: string) {
    const fundManager = await this.fundManagerModel.findOne({
      where: { email },
    });
    if (fundManager) {
      throw new BadRequestException('email already in use');
    }
  }

  async platformInvitation({
    data,
    user,
  }: {
    data: PlatformInvitation;
    user: User;
  }) {
    try {
      await this.emailServices.platformInvitationsEmail({
        ...data,
        inviteeName: user.name,
      });
      return {
        message: 'invitation sent',
      };
    } catch (error) {
      throw new BadRequestException('could not send email please try again');
    }
  }

  /**
   * Checks if a FundManager with the given email already exists in the database
   * @param email The email to check for existence
   * @throws BadRequestException if a FundManager with the email already exists
   */
  async checkSponsorExistence(email: string) {
    const FundManager = await this.fundManagerModel.findOne({
      where: { email },
    });
    if (FundManager) {
      throw new BadRequestException('email already exist');
    }
  }

  async getSponsorById(id: string) {
    return await this.fundManagerModel.findByPkOrThrow(id);
  }
  async getAllSponsors() {
    return await this.fundManagerModel.findAll();
  }

  /**
   * Checks if a FundManager with the given email already exists in the database
   * @param User the user to check for existence
   * returns a list of customers or an empty list
   */
  async getCustomers(user: User) {
    // return await this.myFundManagerService.getSponsorCustomers(user);
  }

  /**
   * @param User the current logged in user thats a fundManager
   * @param customerId the fundManager customer id thats a builder
   * returns a list of customers or an empty list
   */
  async getCustomerOverview(user: User) {
    let completed = 0;
    let inProgress = 0;
    let cancelled = 0;
    let totalAllocated = 0;
    let Actual_Spend = 0;
    let balance = 0;
    const allProjectTransactions = await this.myFundManagerModel.findAll({
      where: {
        FundManagerId: user.FundManagerId,
      },
      include: [
        {
          model: Project,
        },
        {
          model: Builder,
          attributes: ['name', 'logo'],
        },
      ],
    });
    allProjectTransactions.map((trans) => {
      totalAllocated += Number(trans.totalCredited);
      Actual_Spend += Number(trans.totalSpent);
      balance += Number(trans.balance);
    });
    const procurementOverview = new Array(12).fill(0);
    const transHistory: Contract[] = await this.contractModel.findAll({
      where: {
        FundManagerId: user.FundManagerId,
      },
      include: [
        {
          model: this.contractModel,
          include: [
            {
              model: RfqRequest,
              attributes: [
                'id',
                'createdAt',
                'status',
                'title',
                'deliveryDate',
                'totalBudget',
              ],

              include: [
                {
                  model: RfqQuote,
                  attributes: ['id', 'totalCost', 'status', 'deliveryDate'],
                  include: [
                    {
                      model: Vendor,
                      attributes: ['id', 'logo', 'email'],
                    },
                  ],
                },
                {
                  model: Builder,
                },
              ],
            },
          ],
        },
        { model: ProjectTransaction },
      ],
    });

    if (transHistory.length <= 0) {
      return {
        procurementOverview,
        totalAllocated: totalAllocated,
        projectStatistics: {
          completed,
          inProgress,
          cancelled,
          total: null,
        },
        project: null,
        ProjectDetails: null,
      };
    }

    const ProjectDetails = transHistory.map((element: Contract) => {
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

      return {
        id: element.RfqRequest.id,
        ContratcTotalCost: element.totalCost,
        title: element.RfqRequest.title,
        logo: element.RfqRequest.Builder
          ? element.RfqRequest.Builder.logo
          : element.RfqRequest?.FundManager?.logo,
        createdAt: element.RfqRequest.createdAt,
        status:
          element.status === ContractStatus.ACCEPTED ||
          element.status === ContractStatus.PENDING
            ? 'IN PROGRESS'
            : element.status === ContractStatus.CANCELLED
            ? 'CANCELLED'
            : element.status === ContractStatus.COMPLETED
            ? 'COMPLETED'
            : element.status,
        paymentStatus: element.paymentStatus,
        client: element.RfqRequest.Builder.businessName,
        deliveryDate: element.RfqRequest.deliveryDate,
        totalCost: element.RfqRequest.RfqQuotes.reduce(
          (a, b) => Number(a) + Number(b.totalCost),
          0,
        ),
      };
    });

    return {
      procurementOverview,
      allProjectTransactions,
      totalAlocated: totalAllocated,
      Actual_Spend,
      balance,
      projectStatitics: {
        completed,
        inProgress,
        cancelled,
        total: ProjectDetails.length,
      },
      ProjectDetails,
    };
  }

  /**
   * @param customerId the fundManager customer id to get projects
   * returns a list of customers or an empty list
   */
  async getCustomerProjects(customerId: string, user: User) {
    const response = await this.sharedProjectModel.findAll({
      where: {
        FundManagerId: user.FundManagerId,
        status: SharedProjectStatus.ACCEPTED,

        BuilderId: customerId,
      },
      include: [
        {
          model: Project,
          attributes: [
            'budgetAmount',
            'amountSpent',
            'amountLeft',
            'id',
            'title',
            'createdAt',
          ],
        },
        {
          model: Builder,
          attributes: ['name', 'address', 'logo', 'email', 'id'],
        },
      ],
    });

    const addedCustomers = new Map<string, string>();
    const customerDetails = new Map<
      string,
      {
        totalBudget: number;
        actualSpent: number;
        balance: number;
        customerName: string | null;
        customerLocation: string | null;
        customerLogo: string | null;
        customerId: string;
        dateCreated: Date;
        customerEmail: string;
        projects: Project[];
      }
    >();
    response.forEach((element) => {
      if (!addedCustomers.has(element.BuilderId)) {
        addedCustomers.set(element.BuilderId, element.BuilderId);
        customerDetails.set(element.BuilderId, {
          totalBudget: element.Project.budgetAmount,
          actualSpent: element.Project.amountSpent,
          balance: element.Project.amountLeft,
          customerName: element.Builder?.businessName,
          customerLocation: element.Builder?.businessAddress || '',
          customerLogo: element.Builder?.logo || '',
          customerId: element.BuilderId,
          dateCreated: element.createdAt,
          customerEmail: element.buyerEmail || '',
          projects: [element.Project],
        });
      } else {
        const customer = customerDetails.get(element.BuilderId);
        customer.totalBudget += element.Project.budgetAmount;
        customer.actualSpent += element.Project.amountSpent;
        customer.balance += element.Project.amountLeft;

        (customer.projects = [...customer.projects, element.Project]),
          customerDetails.set(element.BuilderId, customer);
      }
    });
    const data = Array.from(customerDetails.values()).map((element) => {
      return {
        totalCredit: element.totalBudget,
        actualSpent: element.actualSpent,
        balance: element.balance,
        customerName: element.customerName,
        customerLocation: element.customerLocation,
        customerLogo: element.customerLogo,
        customerId: element.customerId,
        dateCreated: element.dateCreated,
        customerEmail: element.customerEmail,
        projects: element.projects,
      };
    });
    return data;
  }

  /**
   * Fetches the details and all materials for a RFQ request
   * @param requestId - the ID of the RFQ request
   * @returns the RFQ request materials
   */
  async getSponsorProjectrfqsDetails(requestId: string) {
    const data = await this.rfqRequestModel.findByPkOrThrow(requestId, {
      include: [
        { model: Project },
        {
          model: RfqRequestMaterial,
          include: [{ model: RfqItem }],
        },
        {
          model: RfqQuote,
          include: [{ model: Vendor }, { model: RfqRequest }],
        },
      ],
    });
    const formattedData = {
      ProjectTitle: data.Project.title,
      rfqTitle: data.title,
      deliveryDate: data.deliveryDate,
      address: data.deliveryAddress,
      totalBudget: data.totalBudget,
      totalCost: data.RfqQuotes[0].totalCost,
      Vendor: {
        name: data.RfqQuotes[0].Vendor.businessName,
        email: data.RfqQuotes[0].Vendor.email,
        logo: data.RfqQuotes[0].Vendor.logo,
      },
      RfqQuote: data.RfqQuotes,
      materials: data.RfqRequestMaterials,
    };
    return formattedData;
  }

  async getOverview(user: User) {
    const fundManagerProjects = await this.projectFundManagerModel.findAll({
      where: {
        FundManagerId: user.FundManagerId,
      },
      include: [{ model: Project, include: [{ model: ProjectWallet }] }],
    });

    let totalBudget = 0;
    let totalSpent = 0;
    let projectBalance = 0;
    let activeProjectCount = 0;
    let pendingProjectCount = 0;
    let completedProjectCount = 0;
    const userWallet = await this.userWalletService.getWalletForUser(user);

    const userBalance = Number(userWallet.balance ?? 0);
    const activeProjects = [];
    fundManagerProjects.map((project) => {
      if (project.project.status === ProjectStatus.ACTIVE) {
        activeProjectCount += 1;
        activeProjects.push(project);
        totalBudget += Number(project.project.budgetAmount);
        totalSpent += Number(project.project.amountSpent);
        if (project.project.ProjectWallet) {
          projectBalance += Number(project.project.ProjectWallet.balance);
        }
      }
      if (project.project.status === ProjectStatus.PENDING) {
        pendingProjectCount += 1;
      }
      if (project.project.status === ProjectStatus.COMPLETED) {
        completedProjectCount += 1;
      }
    });

    return {
      totalBudget: totalBudget,
      totalSpent: totalSpent,
      projectBalance: projectBalance,
      userBalance: userBalance ? userBalance : 0,
      pendingBalance: totalBudget - totalSpent,
      projectData: {
        activeProjectCount,
        pendingProjectCount,
        completedProjectCount,
      },
      activeProjects,
    };
  }

  async getProjectCostOverview(user: User, { dateFilter }: GetOverviewDto) {
    const project = await this.projectService.getUserProjectByDate(
      user,
      Number(dateFilter),
    );

    const totalBudget = project.reduce(function (result, item) {
      return result + item.budgetAmount;
    }, 0);

    const totalSpent = project.reduce(function (result, item) {
      return result + item.amountSpent;
    }, 0);

    const totalSavings = project.reduce(function (result, item) {
      return result + item.amountLeft;
    }, 0);

    const totalProjectAmount = totalBudget + totalSpent + totalSavings;

    const projectCost = {
      budget: {
        total: totalBudget,
        percentage: totalProjectAmount
          ? Number(((totalBudget / totalProjectAmount) * 100).toFixed(2))
          : 0,
      },
      spent: {
        total: totalSpent,
        percentage: totalProjectAmount
          ? Number(((totalSpent / totalProjectAmount) * 100).toFixed(2))
          : 0,
      },
      totalSavings: {
        total: totalSavings,
        percentage: totalProjectAmount
          ? Number(((totalSavings / totalProjectAmount) * 100).toFixed(2))
          : 0,
      },
    };

    return {
      projectCost: projectCost,
    };
  }

  async getUserProcuementHistory(user: User) {
    let completed = 0;
    let inProgress = 0;
    let cancelled = 0;

    const procurementOverview = new Array(12).fill(0);
    const transHistory: Contract[] = await this.contractModel.findAll({
      where: {
        FundManagerId: user.FundManagerId,
      },
      include: [
        {
          model: RfqQuote,
        },
        { model: RfqRequest, include: [{ model: RfqQuote }] },
      ],
    });

    if (transHistory.length <= 0) {
      return {
        procurementOverview,
        projectStatitics: {
          completed,
          inProgress,
          cancelled,
          total: null,
        },
        project: null,
        ProjectDetails: null,
      };
    }

    const uniqueProjectDetails = new Map<string, any>();
    const ProjectDetails = transHistory.map((element: Contract) => {
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

      const projectKey = element.RfqRequest.id;
      if (!uniqueProjectDetails.has(projectKey)) {
        uniqueProjectDetails.set(projectKey, {
          id: element.RfqRequest.id,
          ContratcTotalCost: element.totalCost,
          title: element.RfqRequest.title,
          logo: element.RfqRequest.Builder
            ? element.RfqRequest.Builder.logo
            : element.RfqRequest.FundManager?.logo,
          createdAt: element.RfqRequest.createdAt,
          status:
            element.status === ContractStatus.ACCEPTED ||
            element.status === ContractStatus.PENDING
              ? 'IN PROGRESS'
              : element.status === ContractStatus.CANCELLED
              ? 'CANCELLED'
              : element.status === ContractStatus.COMPLETED
              ? 'COMPLETED'
              : element.status,
          paymentStatus: element.paymentStatus,
          client: element.RfqRequest.Builder
            ? element.RfqRequest.Builder.businessName
            : element.RfqRequest.FundManager?.businessName,
          deliveryDate: element.RfqRequest.deliveryDate,
        });
      }

      return null;
    });

    const filteredProjectDetails = [...uniqueProjectDetails.values()].filter(
      (element) => element !== null,
    );

    return {
      procurementOverview,
      projectStatitics: {
        completed,
        inProgress,
        cancelled,
        total: filteredProjectDetails.length,
      },
      ProjectDetails: filteredProjectDetails,
    };
  }

  /**
   * @param ProjectId the project id to get details
   * returns an object of project details
   */
  async getSponsorProjectDetails({
    projectId,
    user,
  }: {
    projectId: string;
    user?: User;
  }) {
    let completed = 0;
    let inProgress = 0;
    let cancelled = 0;
    const procuementOverview = new Array(12).fill(0);

    const orderDetails = await this.orderService.getProjectOrderDetails(
      projectId,
    );
    const projectContratcs = await this.contractModel.findAll({
      where: {
        ProjectId: projectId,
      },
      include: [
        { model: RfqQuote },
        { model: RfqRequest, include: [{ model: RfqQuote }] },
      ],
    });

    projectContratcs?.map((element) => {
      const month = new Date(element.createdAt).getMonth();
      procuementOverview[month] += 1;
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
      procuementOverview,
      orderDetails,
      projectStatitics: {
        completed,
        inProgress,
        cancelled,
      },
    };
  }

  async changePassword(data: ChangePasswordDto, user: User) {
    return await this.userService.userUpdatePassword(
      user.id,
      data.oldPassword,
      data.newPassword,
    );
  }

  async updateAccount(
    data: UpdateRegisterFundManagerDto,
    fundManagerId: string,
  ) {
    const updatedData = await this.fundManagerModel.update(
      { ...data },
      {
        where: { id: fundManagerId },
        returning: true,
      },
    );
    const [affectedRows] = updatedData;
    return affectedRows[0];
  }
}
