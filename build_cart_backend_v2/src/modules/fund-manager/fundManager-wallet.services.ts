import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../user/models/user.model';
import { Sequelize } from 'sequelize-typescript';
import { UserWalletService } from '../user-wallet/user-wallet.service';
import { FundWalletDto } from './dto/fundManager-fundwallet.dto';
import { Order, OrderStatus } from '../order/models';
import {
  Contract,
  ContractPaymentStatus,
  ContractStatus,
} from '../contract/models';
import { ProjectWalletService } from '../project-wallet/project-wallet.service';
import { FundProjectWalletDto } from './dto/fundproject.dto';
import { ProjectWallet } from '../project-wallet/models/project-wallet.model';
import {
  ProjectTransaction,
  TransactionStatus,
  TransactionType,
} from '../project-wallet-transaction/models/project-transaction.model';
import { Project, ProjectStatus } from '../project/models/project.model';
import { generateReference } from 'src/util/util';
import { FundManager } from './models/fundManager.model';
import { Escrow, EscrowStatus } from '../escrow/models/escrow.model';
import { Commission } from '../escrow/models/commision.model';
import { FundOrderType } from './types';
import {
  UserTransaction,
} from '../user-wallet-transaction/models/user-transaction.model';
import moment from 'moment';
import { UserWallet } from '../user-wallet/models/user-wallet.model';
import { RfqRequestMaterial } from '../rfq/models';
import { PaymentMethod, PaymentProvider, SystemPaymentPurpose } from '../payment/types';
@Injectable()
export class SponsorWalletService {
  constructor(
    @InjectModel(Order)
    private readonly orderModel: typeof Order,
    @InjectModel(Contract)
    private readonly contractModel: typeof Contract,
    @InjectModel(ProjectWallet)
    private readonly projectWalletModel: typeof ProjectWallet,
    @InjectModel(Project)
    private readonly projectModel: typeof Project,
    @InjectModel(ProjectTransaction)
    private readonly projectTransactionModel: typeof ProjectTransaction,
    @InjectModel(Escrow)
    private readonly escrowModel: typeof Escrow,
    @InjectModel(Commission)
    private readonly commissionModel: typeof Commission,
    @InjectModel(UserWallet)
    private readonly userWalletModel: typeof UserWallet,
    @InjectModel(UserTransaction)
    private readonly userTransactionModel: typeof UserTransaction,

    private readonly userWalletServices: UserWalletService,
    private readonly sequelise: Sequelize,
    private readonly projectWalletService: ProjectWalletService,
  ) {}

  /**
   * Funds the fundManager's wallet with the specified amount.
   * @param {FundWalletDto} data - The data for funding the wallet.
   * @param {User} user - The user initiating the wallet funding.
   * @returns {Promise<unknown>} The result of the wallet funding operation.
   * @throws {BadRequestException} If there is an error funding the wallet.
   */
  async SponsorfundWallet({
    data,
    user,
  }: {
    data: FundWalletDto;
    user: User;
  }): Promise<unknown> {
    try {
      return await this.userWalletServices.fundWallet({
        ...data,
        user,
      });
    } catch (error) {
      throw new BadRequestException(
        'We could not fund your wallet please contact support',
      );
    }
  }

  async fundProjectWallet(data: FundProjectWalletDto, user: User) {
    try {
      return this.projectWalletService.fundProjectWallet(data, user);
    } catch (e) {
      throw new BadRequestException(e.message);
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
  async SponsorPayOrderWithWalletFund(
    orderId: string,
    user: User,
    amount: number,
    type: FundOrderType,
  ): Promise<unknown> {
    const dbTransaction = await this.sequelise.transaction();
    try {
      const order = await this.orderModel.findOne({
        where: { id: orderId },
        include: [{ model: Project }, { model: RfqRequestMaterial }],
      });

      if (!order) throw new NotFoundException('order does not exist');
      if (!order.Project.walletId)
        throw new ConflictException(
          'project does not have a wallet kindly create one.',
        );
      const contract = await this.contractModel.findOne({
        where: { ProjectId: order.ProjectId },
      });

      if (!contract) throw new NotFoundException('contract does not exist');
      const projectOwner = await this.projectModel.findOne({
        where: { ownerId: user.id },
      });

      const findFundManagerProject = await this.projectModel.findOne({
        where: { id: order.ProjectId },
        include: [
          {
            model: FundManager,
            where: {
              ownerId: user.id,
            },
          },
        ],
      });

      if (!findFundManagerProject && !projectOwner)
        throw new NotFoundException(
          'sorry you are not a member of this project',
        );
      if (type === FundOrderType.PROJECT_WALLET) {
        const projectWallet = await this.projectWalletModel.findOne({
          where: {
            ProjectId: order.ProjectId,
          },
          include: [{ model: Project }],
        });
        if (!projectWallet)
          throw new NotFoundException('project wallet does not exist');

        if (projectWallet.balance < amount)
          throw new ConflictException(
            'insufficient funds, kindly fund project wallet',
          );

        await this.projectWalletModel.decrement(
          {
            balance: amount,
          },
          { where: { id: projectWallet.id }, transaction: dbTransaction },
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

        const commision = (commission.percentageNumber / 100) * amount;

        await this.escrowModel.create(
          {
            orderId: order.id,
            contractId: contract.id,
            projectId: projectWallet.ProjectId,
            rfqRequestId: order.RfqRequestId,
            initialPrice: amount,
            commisionPercentage: commission.percentageNumber,
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
            where: { id: projectWallet.ProjectId },
            transaction: dbTransaction,
            returning: true,
          },
        );

        await this.projectModel.increment(
          {
            amountSpent: amount,
          },
          {
            where: { id: projectWallet.ProjectId },
            transaction: dbTransaction,
          },
        );

        await this.projectTransactionModel.create(
          {
            walletId: user.walletId,
            ProjectWalletId: projectWallet.id,
            amount,
            ProjectId: order.ProjectId,
            description: projectWallet.Project.description,
            userType: TransactionType.TRANSFER,
            status: TransactionStatus.COMPLETED,
            fee: 0,
            paymentMethod: PaymentMethod.CUTSTRUCT_PAY,
            paymentProvider: PaymentProvider.CUTSTRUCT_PAY,
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

        const commision = (commission.percentageNumber / 100) * amount;

        await this.escrowModel.create(
          {
            orderId: order.id,
            contractId: contract.id,
            projectId: order.ProjectId,
            rfqRequestId: order.RfqRequestId,
            initialPrice: amount,
            commisionPercentage: commission.percentageNumber,
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
            ProjectWalletId: order.Project.walletId,
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

      await this.userWalletModel.increment(
        {
          ActualSpend: amount,
        },
        { where: { UserId: user.id }, transaction: dbTransaction },
      );

      await dbTransaction.commit();
      const [affectedCount, affectedRows] = updatedOrder;
      return affectedRows[0];
    } catch (error) {
      dbTransaction.rollback();
      throw new BadRequestException(error.message);
    }
  }
}
