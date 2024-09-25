import { InjectModel } from '@nestjs/sequelize';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Payment } from '../models/payment.model';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { PaymentService } from '../payment.service';
import { User } from 'src/modules/user/models/user.model';
import { EmailService } from 'src/modules/email/email.service';
import {
  Contract,
  ContractPaymentStatus,
  ContractStatus,
} from 'src/modules/contract/models';
import { PaystackVerifyPaymentDto } from './dto/vault-contractPay-dto';
import { Transaction as SequelizeTransaction } from 'sequelize';
import { initializePaymentData } from 'src/modules/project/types';
import {
  TransactionStatus,
  TransactionType,
  UserTransaction,
} from 'src/modules/user-wallet-transaction/models/user-transaction.model';
import { UserWalletService } from 'src/modules/user-wallet/user-wallet.service';
import { UserTransactionService } from 'src/modules/user-wallet-transaction/user-transaction.service';
import { PlatformSubscriptionService } from 'src/modules/platfrom-subscription/platform-subacription.service';
import { Sequelize } from 'sequelize-typescript';
import { SubscriptionType } from 'src/modules/platfrom-subscription/types';
import { PaymentType } from '../remiter-payment/dto/remiter-contractPay-dto';
import {
  FundOrderType,
  PaymentMethod,
  PaymentProvider,
  SystemPaymentPurpose,
} from '../types';
import { Order, OrderStatus } from 'src/modules/order/models';
import { ProjectWallet } from 'src/modules/project-wallet/models/project-wallet.model';
import { ProjectTransaction } from 'src/modules/project-wallet-transaction/models/project-transaction.model';
import { UserWallet } from 'src/modules/user-wallet/models/user-wallet.model';
import {
  Project,
  ProjectStatus,
} from 'src/modules/project/models/project.model';
import { Escrow, EscrowStatus } from 'src/modules/escrow/models/escrow.model';
import { Commission } from 'src/modules/escrow/models/commision.model';
import { RfqRequestMaterial } from 'src/modules/rfq/models';
import { generateReference } from 'src/util/util';
import { Builder } from 'src/modules/builder/models/builder.model';
import moment from 'moment';
import { FundProjectWalletDto } from 'src/modules/fund-manager/dto/fundproject.dto';
import { ProjectWalletService } from 'src/modules/project-wallet/project-wallet.service';
import { ProjectWalletTransactionService } from 'src/modules/project-wallet-transaction/project-transaction.service';

@Injectable()
export class VaultPaymentService {
  constructor(
    @InjectModel(Payment)
    private readonly payment: typeof Payment,
    @InjectModel(Contract)
    private readonly contractModel: typeof Contract,
    @InjectModel(Order)
    private readonly orderModel: typeof Order,
    @InjectModel(ProjectWallet)
    private readonly projectWalletModel: typeof ProjectWallet,
    @InjectModel(ProjectTransaction)
    private readonly projectTransactionModel: typeof ProjectTransaction,
    @InjectModel(UserWallet)
    private readonly userWalletModel: typeof UserWallet,
    @InjectModel(UserTransaction)
    private readonly userTransactionModel: typeof UserTransaction,
    @InjectModel(Project)
    private readonly projectModel: typeof Project,
    @InjectModel(Escrow)
    private readonly escrowModel: typeof Escrow,
    @InjectModel(Commission)
    private readonly commissionModel: typeof Commission,

    private readonly userWalletServices: UserWalletService,
    private readonly projectWalletService: ProjectWalletService,
    private paymentService: PaymentService,
    private userWalletService: UserWalletService,
    private readonly userTransactionService: UserTransactionService,
    private platformSubscriptionService: PlatformSubscriptionService,
    private readonly projectWalletTransactionService: ProjectWalletTransactionService,
    private readonly sequelize: Sequelize,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {}

  /**
   * Pays for an order using funds from the fundManager's wallet.
   * @param {string} orderId - The ID of the order to be paid for.
   * @param {User} user - The user initiating the payment.
   * @param {string} [description] - An optional description for the payment.
   * @returns {Promise<unknown>} The result of the payment operation.
   * @throws {NotFoundException} If the order does not exist.
   * @throws {BadRequestException} If there is an issue with the wallet or payment process.
   */
  async PayOrderWithWalletFund(
    orderId: string,
    user: User,
    amount: number,
    type: FundOrderType,
  ): Promise<unknown> {
    const dbTransaction = await this.sequelize.transaction();
    try {
      const order = await this.orderModel.findOne({
        where: { id: orderId, BuilderId: user.BuilderId },
        include: [{ model: Project }, { model: RfqRequestMaterial }],
      });

      if (!order) throw new NotFoundException('order does not exist');

      const projectWallet = await this.projectWalletModel.findOrCreate({
        where: {
          ProjectId: order.ProjectId,
        },
      });
      const contract = await this.contractModel.findOne({
        where: { ProjectId: order.ProjectId },
      });

      if (!contract) throw new NotFoundException('contract does not exist');
      const projectOwner = await this.projectModel.findOne({
        where: { ownerId: user.id },
      });

      const builderProject = await this.projectModel.findOne({
        where: { id: order.ProjectId },
        include: [
          {
            model: Builder,
            where: {
              ownerId: user.id,
            },
          },
        ],
      });

      if (!builderProject && !projectOwner)
        throw new NotFoundException(
          'sorry you are not a member of this project',
        );

      if (!order)
        throw new NotFoundException(
          'sorry you are not a member of this project',
        );

      if (type === FundOrderType.PROJECT_WALLET) {
        if (projectWallet[0].balance < amount)
          throw new ConflictException(
            'insufficient funds, kindly contact project owner to fund project wallet',
          );
        await this.projectWalletModel.decrement(
          {
            balance: amount,
          },
          { where: { id: projectWallet[0].id }, transaction: dbTransaction },
        );

        await this.contractModel.update(
          {
            status: ContractStatus.ACCEPTED,
            paymentStatus: ContractPaymentStatus.CONFIRMED,
          },
          { where: { ProjectId: order.ProjectId }, transaction: dbTransaction },
        );

        const commission = await this.commissionModel.findOne({
          where: {
            active: true,
          },
        });

        const commision = (commission?.percentageNumber / 100) * amount;

        await this.escrowModel.create(
          {
            orderId: order.id,
            contractId: contract.id,
            projectId: projectWallet[0].ProjectId,
            rfqRequestId: order.RfqRequestId,
            initialPrice: amount,
            commisionPercentage: commission?.percentageNumber,
            commisionValue: commision,
            finalAmount: amount - commision,
            status: EscrowStatus.PENDING,
          },
          { transaction: dbTransaction },
        );

        await this.projectModel.update(
          {
            status: ProjectStatus.ACTIVE,
          },
          {
            where: { id: projectWallet[0].ProjectId },
            transaction: dbTransaction,
          },
        );

        await this.projectModel.increment(
          {
            amountSpent: amount,
          },
          {
            where: { id: projectWallet[0].ProjectId },
            transaction: dbTransaction,
          },
        );

        await this.projectWalletModel.increment(
          {
            ActualSpend: amount,
          },
          {
            where: { id: projectWallet[0].id },
            transaction: dbTransaction,
          },
        );

        await this.projectTransactionModel.create(
          {
            walletId: user.walletId,
            ProjectWalletId: projectWallet[0].id,
            amount,
            ProjectId: order.ProjectId,
            description: projectWallet[0].Project.description,
            userType: TransactionType.TRANSFER,
            status: TransactionStatus.COMPLETED,
            fee: commision,
            paymentMethod: PaymentMethod.CUTSTRUCT_PAY,
            paymentProvider: PaymentProvider.CUTSTRUCT_PAY, // Fix: Change the value to a valid PaymentProvider enum value
            paymentPurpose: SystemPaymentPurpose.FUND_ORDER,
            reference: generateReference(),
            CreatedById: user.id,
          },
          { transaction: dbTransaction },
        );
      } else {
        const userWallet = await this.userWalletModel.findOne({
          where: {
            UserId: user.id,
          },
        });

        if (!userWallet)
          throw new NotFoundException('user wallet does not exist');

        if (userWallet.balance < amount)
          throw new ConflictException(
            'insufficient funds, kindly fund your project wallet',
          );
        await this.userWalletModel.decrement(
          {
            balance: amount,
          },
          { where: { UserId: user.id }, transaction: dbTransaction },
        );

        await this.contractModel.update(
          {
            status: ContractStatus.ACCEPTED,
            paymentStatus: ContractPaymentStatus.CONFIRMED,
          },
          { where: { ProjectId: order.ProjectId }, transaction: dbTransaction },
        );

        const commission = await this.commissionModel.findOne({
          where: {
            active: true,
          },
        });

        const commision = (commission?.percentageNumber / 100) * amount;

        await this.escrowModel.create(
          {
            orderId: order.id,
            contractId: contract.id,
            projectId: order.ProjectId,
            rfqRequestId: order.RfqRequestId,
            initialPrice: amount,
            commisionPercentage: commission?.percentageNumber,
            commisionValue: commision,
            finalAmount: amount - commision,
            status: EscrowStatus.PENDING,
          },
          { transaction: dbTransaction },
        );

        await this.projectModel.update(
          {
            status: ProjectStatus.ACTIVE,
          },
          {
            where: { id: order.ProjectId },
            transaction: dbTransaction,
          },
        );

        await this.projectModel.increment(
          {
            amountSpent: amount,
          },
          {
            where: { id: order.ProjectId },
            transaction: dbTransaction,
          },
        );
        const reference = generateReference();
        await this.projectTransactionModel.create(
          {
            walletId: user.walletId,
            ProjectWalletId: projectWallet[0].id,
            amount,
            ProjectId: order.ProjectId,
            description: order.Project.description,
            userType: TransactionType.TRANSFER,
            status: TransactionStatus.COMPLETED,
            fee: commision,
            paymentMethod: PaymentMethod.CUTSTRUCT_PAY,
            paymentProvider: PaymentProvider.CUTSTRUCT_PAY,
            paymentPurpose: SystemPaymentPurpose.FUND_ORDER,
            reference,
            CreatedById: user.id,
          },
          { transaction: dbTransaction },
        );

        await this.userTransactionModel.create(
          {
            UserWalletId: userWallet.id,
            amount,
            paymentPurpose: SystemPaymentPurpose.RFQ_REQUEST,
            paymentMethod: PaymentMethod.CUTSTRUCT_PAY,
            paymentProvider: PaymentProvider.CUTSTRUCT_PAY,
            ProjectId: order.ProjectId,
            RfqRequestId: order.RfqRequestId,
            description: order.Project.description,
            timestamp: moment().toDate(),
            itemName: order.RfqRequestMaterial.name,
            type: TransactionType.TRANSFER,
            status: TransactionStatus.COMPLETED,
            reference,
            CreatedById: user.id,
          },
          { transaction: dbTransaction },
        );
      }

      const updatedOrder = await this.orderModel.update(
        {
          status: OrderStatus.PAID,
        },
        {
          where: { id: order.id },
          transaction: dbTransaction,
          returning: true,
        },
      );
      await dbTransaction.commit();
      const [affectedCount, affectedRows] = updatedOrder;
      return affectedRows[0];
    } catch (error) {
      dbTransaction.rollback();
      throw new BadRequestException(error.message);
    }
  }
  /**
   * Pays for an order using funds from the fundManager's wallet.
   * @param {string} orderId - The ID of the order to be paid for.
   * @param {User} user - The user initiating the payment.
   * @param {string} [description] - An optional description for the payment.
   * @returns {Promise<unknown>} The result of the payment operation.
   * @throws {NotFoundException} If the order does not exist.
   * @throws {BadRequestException} If there is an issue with the wallet or payment process.
   */
  async fundProjectWallet(data: FundProjectWalletDto, user: User) {
    const dbTransaction = await this.sequelize.transaction();
    try {
      const projectData = await this.projectModel.findOrThrow({
        include: [{ model: ProjectWallet }],
        where: { id: data.ProjectId },
      });
      if (user.wallet.balance < data.amount)
        throw new BadRequestException('Insufficient Ballance');
      if (data.amount <= 0)
        throw new BadRequestException('Please Provide Value greater than 0');
      await projectData.ProjectWallet.increment(
        {
          balance: data.amount,
          totalCredit: data.amount,
        },
        { transaction: dbTransaction },
      );

      await user.wallet.decrement(
        {
          balance: data.amount,
        },
        { transaction: dbTransaction },
      );

      await user.wallet.increment(
        {
          ActualSpend: data.amount,
        },
        { transaction: dbTransaction },
      );

      await this.projectWalletTransactionService.createProjectTransaction(
        {
          amount: data?.amount,
          userType: TransactionType.DEPOSIT,
          ProjectId: data.ProjectId,
          status: TransactionStatus[`${data.transactionStatus}`],
          paymentMethod: PaymentMethod[`${data.paymentMethod}`],
          paymentPurpose: SystemPaymentPurpose.FUND_PROJECT_WALLET,
          description: 'Fund project wallet',
          createdAt: new Date(),
          updatedAt: new Date(),
          CreatedById: user?.id,
          walletId: user?.walletId,
          ProjectWalletId: projectData.walletId,
        },
        dbTransaction,
      );

      await this.userTransactionService.createUserTransaction(
        {
          amount: data.amount,
          type: TransactionType.TRANSFER,
          UserWalletId: user.walletId,
          status: TransactionStatus.COMPLETED,
          paymentPurpose: SystemPaymentPurpose.FUND_PROJECT_WALLET,
          CreatedById: user.id,
          ProjectId: data.ProjectId,
          description: data.description || 'project wallet topup',
          paymentProvider: PaymentProvider.CUTSTRUCT_PAY,
          paymentMethod: PaymentMethod.CUTSTRUCT_PAY,
        },
        dbTransaction,
      );
      await dbTransaction.commit();
      return projectData.reload();
    } catch (e) {
      await dbTransaction.rollback();
      throw new BadRequestException(e.message);
    }
  }
}
