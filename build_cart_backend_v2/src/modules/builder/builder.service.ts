import { BadRequestException, Injectable } from '@nestjs/common';
import { Transaction as SequelizeTransaction } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';
import { Builder, BuilderTier, CreditStatus } from './models/builder.model';
import { UserService } from 'src/modules/user/user.service';
import { User, UserType } from 'src/modules/user/models/user.model';
import { EmailService } from '../email/email.service';
import { FundManager } from '../fund-manager/models/fundManager.model';
import { Project, ProjectStatus } from '../project/models/project.model';
import { SharedProject } from '../shared-project/models/shared-project.model';
import { MyProject } from '../my-project/models/myProjects.model';
import { ContractService } from '../contract/contract.service';
// import { BaniPaymentService } from '../payment/bani-payment/bani-payment.service';
import { PaymentService } from '../payment/payment.service';
import { PaystackPaymentService } from '../payment/paystack-payment/paystack-payment.service';
import { ConfigService } from '@nestjs/config';
import { CutstructPayService } from '../payment/cutstuct-payment/custruct-payment.service';
import { ProjectWalletService } from '../project-wallet/project-wallet.service';
import { PaystackVerifyPaymentDto } from '../payment/paystack-payment/dto/paystack-contractPay-dto';
import { ContractPaymentStatus } from '../contract/models';
// import { BaniVerifyPaymentDto } from '../payment/bani-payment/dto/bani-verify-payment.dto';
import { Op, Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { VerifymeCheck } from 'src/util/util';
import { CreateBuilderDto } from './dto/register-builder.dto';
import { AdminUpdateBuilderProfileDto, UpdateBuilderProfileDto } from './dto';
import { MyFundManagerService } from '../my-fundManager/my-fundManager.service';
import {
  AddPortFolioMediaDTO,
  BuilderPortFolioDto,
  NewBuilderDto,
  UpdatePortFolioDTO,
} from './dto/reg-builder.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { ProjectService } from '../project/project.service';
import { UserWalletService } from '../user-wallet/user-wallet.service';
import { RfqService } from '../rfq/rfq.service';
import { GetOverviewDto } from './dto/get-overview.dto';
import { FundManagerBuilderService } from '../fund-manager/fundManager-builder.service';
import { InvitationService } from '../invitation/invitation.service';
import { AuthService } from '../auth/auth.service';
import { RemitaPaymentService } from '../payment/remiter-payment/remitter-payment.service';
import {
  PaymentType,
  RemitterVerifyPaymentDto,
  RemitterVerifyPaymentRefDto,
} from '../payment/remiter-payment/dto/remiter-contractPay-dto';
import { UserTransactionService } from '../user-wallet-transaction/user-transaction.service';
import {
  TransactionStatus,
  TransactionType,
} from '../user-wallet-transaction/models/user-transaction.model';
import { UserWallet } from '../user-wallet/models/user-wallet.model';
import { BuilderPortFolio } from './models/builder-portfolio.model';
import { PortFolioMedias } from './models/builder-portfolio-media';
import { ProjectShares, Status } from '../project/models/project-shared.model';

@Injectable()
export class BuilderService {
  constructor(
    @InjectModel(Builder)
    private readonly builderModel: typeof Builder,
    @InjectModel(User)
    private readonly userModel: typeof User,
    @InjectModel(FundManager)
    private readonly fundManagerModel: typeof FundManager,
    @InjectModel(Project)
    private readonly projectModel: typeof Project,
    @InjectModel(SharedProject)
    private readonly sharedProjectModel: typeof SharedProject,
    @InjectModel(MyProject)
    private readonly myProjectModel: typeof MyProject,
    @InjectModel(BuilderPortFolio)
    private readonly builderPortFolio: typeof BuilderPortFolio,
    @InjectModel(PortFolioMedias)
    private readonly portFolioMedia: typeof PortFolioMedias,
    @InjectModel(ProjectShares)
    private readonly projectSharesModel: typeof ProjectShares,
    // private baniPaymentService: BaniPaymentService,
    private paymentService: PaymentService,
    private remittancePaymentService: RemitaPaymentService,
    private userTransactionService: UserTransactionService,
    private paystackPaymentService: PaystackPaymentService,
    private contractService: ContractService,
    private cutstructPayService: CutstructPayService,
    private projectWalletService: ProjectWalletService,
    private configService: ConfigService,
    private readonly sequelize: Sequelize,
    private userService: UserService,
    private readonly myFundManagerService: MyFundManagerService,
    private emailService: EmailService,
    private readonly projectService: ProjectService,
    private readonly userWalletService: UserWalletService,
    private readonly rfqService: RfqService,
    private fundmangerBuilderService: FundManagerBuilderService,
    private inviteService: InvitationService,
    private authService: AuthService,
  ) {}

  /**
   * Registers a new Builder with the provided email and password.
   *
   * @param NewBuilderDto The DTO containing the email and password of the new Builder.
   * @returns The created Builder with a generated email OTP.
   * @throws BadRequestException if the provided email is already in use.
   */
  async registerBuilder({
    body,
    invitationId,
    dbTransaction,
  }: {
    body: NewBuilderDto;
    invitationId?: string;
    dbTransaction?: Transaction;
    user?: User;
  }) {
    if (!dbTransaction) {
      dbTransaction = await this.sequelize.transaction();
    }

    try {
      const userData = await this.userService.getUserById(body.UserId);
      const personaDataExists = await this.builderModel.findOne({
        where: { email: userData.email },
      });
      if (!userData || !userData.emailVerified) {
        throw new BadRequestException(
          'There was an error in the registration process or account not verified yet. Please try again or verify your account details.',
        );
      }

      if (personaDataExists) {
        return userData;
      }
      let IsVerifiedFromVerifyme = false;

      if (body.businessRegNo) {
        IsVerifiedFromVerifyme = await VerifymeCheck(body.businessRegNo);
      }

      const builderData = await this.builderModel.create(
        {
          ...body,
          businessName: userData.businessName,
          ownerId: userData.id,
          isBusinessVerified: IsVerifiedFromVerifyme,
          email: userData.email,
          createdById: userData.id,
          updatedById: userData.id,
          tier: !body.isIndividual
            ? IsVerifiedFromVerifyme
              ? BuilderTier.one
              : BuilderTier.two
            : BuilderTier.two,
          createdAt: new Date(),
          lastLogin: new Date(),
        },
        { transaction: dbTransaction },
      );

      const updateData = await User.update(
        {
          BuilderId: builderData.id,
          Builder: builderData,
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
     invitationId?
      await this.addInviteBuildertoFundManagerProject(
        invitationId,
        builderData.id,
        dbTransaction,
      ):null;

      await dbTransaction.commit();

      return affectedRows[0];
    } catch (error) {
      dbTransaction.rollback();
      throw new BadRequestException(error.message);
    }
  }

  async addInviteBuildertoFundManagerProject(
    invitationId: string,
    builderId: string,
    dbTransaction: Transaction,
  ) {
    if (!invitationId) return;
    const invitation = await this.inviteService.getInvitationById(invitationId);
    if (!invitation) return;
    if (invitation.CreatedBy?.userType === UserType.FUND_MANAGER) {
      if (invitation.projectId) {
        const FundManagerId = invitation.CreatedBy?.FundManagerId;
        const [shared, create] = await this.projectSharesModel.findOrCreate({
          where: {
            ProjectId: invitation.projectId,
            FundManagerId: FundManagerId,
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

  async addBuilderPortfolio(
    body: BuilderPortFolioDto,
    user: User,
  ): Promise<BuilderPortFolio> {
    const dbTransaction = await this.sequelize.transaction();
    try {
      const [builderPortFolio, doesExist] = await this.builderPortFolio
        .findOrCreate({
          where: {
            OwnerId: user.id,
            BuilderId: user.BuilderId,
          },
          defaults: {
            title: body.title,
            about: body.about,
            description: body.description,
          },
        })
        .then();

      const { portFolioMedias } = body;
      if (portFolioMedias.length > 0) {
        const bulkData = await Promise.all(
          portFolioMedias.map(async (media) => {
            return {
              PortFolioId: builderPortFolio.id,
              CreatedById: user.id,
              createdAt: new Date(),
              url: media.url,
              title: media.title,
              description: media.description,
              mediaType: media.mediaType,
            };
          }),
        );
        await this.portFolioMedia.bulkCreate(bulkData, {
          transaction: dbTransaction,
        });
      }
      await dbTransaction.commit();
      return builderPortFolio;
    } catch (err) {
      dbTransaction.rollback();
      throw new BadRequestException(err.message);
    }
  }

  async updateBuilderPortfolio(
    body: UpdatePortFolioDTO,
  ): Promise<BuilderPortFolio[]> {
    const dbTransaction = await this.sequelize.transaction();
    try {
      const [affectedCount, affectedRows] = await this.builderPortFolio.update(
        {
          ...body,
        },
        {
          where: { id: body.portFolioId },
          transaction: dbTransaction,
          returning: true,
        },
      );

      await dbTransaction.commit();
      return affectedRows;
    } catch (err) {
      dbTransaction.rollback();
      throw new BadRequestException(err.message);
    }
  }

  async addMediaToBuilderPortfolio(
    body: AddPortFolioMediaDTO,
  ): Promise<PortFolioMedias> {
    const dbTransaction = await this.sequelize.transaction();
    try {
      const newMedia = await this.portFolioMedia.create({
        ...body,
        PortFolioId: body.portFolioId,
      });

      await dbTransaction.commit();
      return newMedia;
    } catch (err) {
      dbTransaction.rollback();
      throw new BadRequestException(err.message);
    }
  }

  async getBuilderPortFolio(user: User): Promise<BuilderPortFolio> {
    return await this.builderPortFolio.findOne({
      where: {
        OwnerId: user.id,
        BuilderId: user.BuilderId,
      },
      include: [Builder, PortFolioMedias],
    });
  }

  async addBuilderToFundManagerBuilders({
    builderId,
    invitationId,
  }: {
    builderId: string;
    invitationId?: string;
  }) {
    if (invitationId === undefined) {
      return;
    }
    const invite = await this.inviteService.getInvitationById(invitationId);
    if (!invite) {
      throw new BadRequestException('Invite does not exist!');
    }

    // Check if Invitation is from a FundManager
    const fundManagerId = invite.CreatedBy?.FundManagerId;
    if (fundManagerId) {
      const myBuilder = await this.fundmangerBuilderService.addToMyBuilders(
        fundManagerId,
        [builderId],
      );

      return myBuilder;
    }
  }

  async registerBuilderFromMarketPlace(data: CreateUserDto, sso_user = false) {
    const user = await this.userService.createUser({
      userData: data,
      sso_user,
    });

    const createdBuilder = await this.registerBuilder({
      body: {
        UserId: user.id,
        about: null,
        logo: data.logo || null,
        isIndividual: true,
        businessSize: null,
        businessRegNo: null,
      },
    });

    let loginData;
    if (sso_user) {
      loginData = await this.authService.loginWithSSO(user.email);
    }

    // return { ...createdBuilder, logo: data.logo };
    return loginData;
  }

  async findBuilderByEmail(email: string) {
    return await this.builderModel.findOne({
      where: { email },
    });
  }

  /**
   * Checks if a builder with the given email already exists in the database
   * @param email The email to check for existence
   * @throws BadRequestException if a builder with the email already exists
   */
  async checkBuilderExistence(email: string) {
    const builder = await this.builderModel.findOne({ where: { email } });
    if (builder) {
      throw new BadRequestException('email already in use');
    }
    return builder;
  }

  /**
   * Retrieves a builder with the given ID
   * @param builderId The ID of the builder to retrieve
   * @returns The retrieved builder
   * @throws NotFoundException if builder not found
   */
  async getBuilderById(builderId: string) {
    return await this.userModel.findOne({
      where: { BuilderId: builderId },
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Builder,
          attributes: {
            exclude: ['migratedAt', 'deletedAt'],
          },
        },
      ],
    });
  }

  /** Update Builder Profile
   * @param buyerID The ID of the builder to update
   * @param updateBuilderProfileDto DTO containing builder information to update
   * @throws NotFoundException if builder not found
   */
  async updateProfile(
    builderId: string,
    updateBuilderDto: UpdateBuilderProfileDto,
  ) {
    await this.getBuilderById(builderId);
    await this.builderModel.update(
      {
        ...updateBuilderDto,
      },
      {
        where: { id: builderId },
      },
    );
    return { message: 'Builder Profile updated successfully' };
  }

  /** Update Builder Profile
   * @param buyerID The ID of the builder to update
   * @param updateBuilderProfileDto DTO containing builder information to update
   * @throws NotFoundException if builder not found
   */
  async adminUpdateProfile(
    builderId: string,
    updateBuilderDto: AdminUpdateBuilderProfileDto,
  ) {
    await this.getBuilderById(builderId);
    const { logo, about, businessAddress, businessRegNo } = updateBuilderDto;
    await this.builderModel.update(
      { logo, about, businessRegNo, businessAddress },
      { where: { id: builderId } },
    );
  }

  /**
   * Retrieves all builder
   * @returns The retrieved all builder
   */
  async getAllBuilder() {
    return await this.builderModel.findAll({});
  }

  // async PayContractWithBaniReference({
  //   data,
  //   user,
  // }: {
  //   data: BaniVerifyPaymentDto;
  //   user: User;
  // }) {
  //   const contractData = await this.contractService.getContractById(
  //     data.ContractId,
  //   );
  //   if (contractData.paymentStatus != ContractPaymentStatus.PENDING)
  //     throw new BadRequestException(
  //       'Payment already Payed or undergoing  verification',
  //     );
  //   const transaction = await this.sequelize.transaction();
  //   try {
  //     const res = await this.baniPaymentService.updatePaymentStatus(
  //       data,
  //       user,
  //       transaction,
  //     );

  //     if (res) {
  //       await this.contractService.payForContract({
  //         contractId: data.ContractId,
  //         user,
  //         vend_token: data.vend_token,
  //         dbTransaction: transaction,
  //       });
  //       await transaction.commit();
  //     }
  //   } catch (error) {
  //     await transaction.rollback();
  //   }
  // }

  // async PayforContractWithPaystackReference({
  //   data,
  //   user,
  // }: {
  //   data: PaystackVerifyPaymentDto;
  //   user: User;
  // }) {
  //   const contractData = await this.contractService.getContractById(
  //     data.ContractId,
  //   );
  //   if (contractData.paymentStatus != ContractPaymentStatus.PENDING)
  //     throw new BadRequestException(
  //       'Payment already Payed or undergoing  verification',
  //     );
  //   const transaction = await this.sequelize.transaction();

  //   try {
  //     const res = await this.paystackPaymentService.verifyPayment(
  //       data,
  //       user,
  //       transaction,
  //     );
  //     if (res) {
  //       const payment = await this.contractService.payForContract({
  //         contractId: data.ContractId,
  //         user,
  //         vend_token: data.vend_token,
  //         dbTransaction: transaction,
  //       });
  //       await transaction.commit();
  //       return payment;
  //     }
  //   } catch (error) {
  //     await transaction.rollback();
  //   }
  // }



  async enableCredit({ builderId }: { builderId: string; admin: User }) {
    try {
      const builderData = await this.builderModel.findOne({
        where: {
          id: builderId,
        },
      });
      if (!builderData) throw new BadRequestException('builder data not found');
      if (builderData.creditStatus == CreditStatus.APPROVED)
        throw new BadRequestException('credit status already approved ');
      builderData.creditStatus = CreditStatus.APPROVED;
      await builderData.save();
      return await builderData.reload();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async disableCredit({ builderId }: { builderId: string; admin: User }) {
    try {
      const builderData = await this.builderModel.findOne({
        where: {
          id: builderId,
        },
      });
      if (!builderData) throw new BadRequestException('builder data not found');
      if (builderData.creditStatus == CreditStatus.DISABLED)
        throw new BadRequestException('credit status already disabled ');
      builderData.creditStatus = CreditStatus.DISABLED;
      await builderData.save();
      return await builderData.reload();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getOverview(user: User) {
    const projects = await this.projectService.getAllUserProject(user.id);
    const userWallet = await this.userWalletService.getWalletForUser(user);

    let totalBudget = 0;
    let totalSpent = 0;
    let projectBalance = 0;
    let activeProjectCount = 0;
    let pendingProjectCount = 0;
    let completedProjectCount = 0;

    const userBalance = Number(userWallet.balance ?? 0);

    const activeProjects = [];

    projects.map((project) => {
      if (project.status === ProjectStatus.ACTIVE) {
        activeProjectCount += 1;
        activeProjects.push(project);
        totalBudget += Number(project.budgetAmount);
        totalSpent += Number(project.amountSpent);
        if (project.ProjectWallet) {
          projectBalance += Number(project.ProjectWallet.balance);
        }
      }
      if (project.status === ProjectStatus.PENDING) {
        pendingProjectCount += 1;
      }
      if (project.status === ProjectStatus.COMPLETED) {
        completedProjectCount += 1;
      }
    });

    return {
      totalBudget: totalBudget,
      totalSpent: totalSpent,
      projectBalance: projectBalance ? projectBalance : 0,
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

  async getBalanceSummary(user: User) {
    const projects = await this.projectService.getAllUserProject(user.id);
    const userWallet = await this.userWalletService.getWalletForUser(user);
    const rfqRequest = await this.rfqService.findRfqRequestByStatus(user);

    const totalSpent = projects.reduce(function (result, item) {
      return result + item.amountSpent;
    }, 0);

    const projectBalance = projects.reduce(function (result, item) {
      if (item.ProjectWallet) {
        return result + item.ProjectWallet.balance;
      }
    }, 0);

    const userBalance = userWallet.dataValues.balance;
    const userOutflow = userWallet.dataValues.ActualSpend;
    const userInflow = userWallet.dataValues.totalCredit;

    const pendingBalance = rfqRequest.reduce(function (result, item) {
      return result + item.totalBudget;
    }, 0);

    return {
      totalSpent: totalSpent ? totalSpent : 0,
      projectBalance: projectBalance ? projectBalance : 0,
      userBalance: userBalance ? userBalance : 0,
      pendingBalance: pendingBalance ? pendingBalance : 0,
      totalInflow: userInflow ? userInflow : 0,
      totalOutflow: userOutflow ? userOutflow : 0,
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

}
