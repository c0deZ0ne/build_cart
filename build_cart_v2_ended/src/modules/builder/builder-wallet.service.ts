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
import { Order, OrderStatus } from '../order/models';
import {
  Contract,
  ContractPaymentStatus,
  ContractStatus,
} from '../contract/models';
import { FundWalletDto } from '../fund-manager/dto/fundManager-fundwallet.dto';
import { ProjectWallet } from '../project-wallet/models/project-wallet.model';
import { Project, ProjectStatus } from '../project/models/project.model';
import {
  PaymentMethod,
  PaymentPurpose,
  TransactionStatus,
  TransactionType,
  UserTransaction,
} from '../user-wallet-transaction/models/user-transaction.model';
import {
  PaymentProvider,
  ProjectPaymentPurpose,
  ProjectTransaction,
} from '../project-wallet-transaction/models/project-transaction.model';
import { generateReference } from 'src/util/util';
import { Builder } from './models/builder.model';
import { Escrow, EscrowStatus } from '../escrow/models/escrow.model';
import { Commission } from '../escrow/models/commision.model';
import { FundOrderType } from '../fund-manager/types';
import { UserWallet } from '../user-wallet/models/user-wallet.model';
import * as moment from 'moment';
import { RfqItem, RfqRequestMaterial } from '../rfq/models';

@Injectable()
export class BuilderWalletService {
  constructor(
    @InjectModel(Order)
    private readonly orderModel: typeof Order,
    @InjectModel(Contract)
    private readonly contractModel: typeof Contract,
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
    private readonly sequelize: Sequelize,
  ) {}

  /**
   * Funds the fundManager's wallet with the specified amount.
   * @param {FundWalletDto} data - The data for funding the wallet.
   * @param {User} user - The user initiating the wallet funding.
   * @returns {Promise<unknown>} The result of the wallet funding operation.
   * @throws {BadRequestException} If there is an error funding the wallet.
   */
  async buyerFundWallet({
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

  /**
   * Pays for an order using funds from the fundManager's wallet.
   * @param {string} orderId - The ID of the order to be paid for.
   * @param {User} user - The user initiating the payment.
   * @param {string} [description] - An optional description for the payment.
   * @returns {Promise<unknown>} The result of the payment operation.
   * @throws {NotFoundException} If the order does not exist.
   * @throws {BadRequestException} If there is an issue with the wallet or payment process.
   */
  async buyerPayOrderWithWalletFund(
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

        const commision = (commission.percentageNumber / 100) * amount;

        await this.escrowModel.create(
          {
            orderId: order.id,
            contractId: contract.id,
            projectId: projectWallet[0].ProjectId,
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
            paymentProvider: PaymentProvider.CUTSTRUCT,
            paymentPurpose: ProjectPaymentPurpose.FUND_ORDER,
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
            ProjectWalletId: projectWallet[0].id,
            amount,
            ProjectId: order.ProjectId,
            description: order.Project.description,
            userType: TransactionType.TRANSFER,
            status: TransactionStatus.COMPLETED,
            fee: commision,
            paymentMethod: PaymentMethod.CUTSTRUCT_PAY,
            paymentProvider: PaymentProvider.CUTSTRUCT,
            paymentPurpose: ProjectPaymentPurpose.FUND_ORDER,
            reference,
            CreatedById: user.id,
          },
          { transaction: dbTransaction },
        );

        await this.userTransactionModel.create(
          {
            UserWalletId: userWallet.id,
            amount,
            paymentPurpose: PaymentPurpose.PROJECT,
            paymentMethod: PaymentMethod.CUTSTRUCT_PAY,
            paymentProvider: PaymentProvider.CUTSTRUCT,
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
}
