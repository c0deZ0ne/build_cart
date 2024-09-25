import {
  Injectable,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/sequelize';
import {
  Contract,
  ContractPaymentStatus,
  ContractStatus,
  ContractDeliveryStatus,
} from './models';
import {
  WhereOptions,
  Transaction as SequelizeTransaction,
  Transaction,
} from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { User, UserType } from 'src/modules/user/models/user.model';
import {
  RfqCategory,
  RfqQuote,
  RfqQuoteMaterial,
  RfqRequest,
  RfqRequestMaterial,
} from 'src/modules/rfq/models';
import { Vendor } from 'src/modules/vendor/models/vendor.model';
import { Builder } from 'src/modules/builder/models/builder.model';
import { RfqService } from 'src/modules/rfq/rfq.service';
import { RfqQuoteService } from 'src/modules/rfq/rfq-quote.service';
import { RateReview } from 'src/modules/rate-review/model/rateReview.model';
import { EmailService } from '../email/email.service';
import { Project } from '../project/models/project.model';
import { Payment, PaymentStatus } from '../payment/models/payment.model';
import { FundManager } from '../fund-manager/models/fundManager.model';
import { Order, OrderStatus } from '../order/models';
import { DeliveryConfirmationDto } from '../email/dto/deliveryConfirmation.dto';
import { DeliverySchedule } from '../order/models/order-schedule.model';

@Injectable()
export class ContractService {
  constructor(
    @InjectModel(Contract)
    private readonly contractModel: typeof Contract,
    @InjectModel(DeliverySchedule)
    private readonly deliveryScheduleModel: typeof DeliverySchedule,
    @Inject(forwardRef(() => RfqService)) private rfqService: RfqService,
    @Inject(forwardRef(() => RfqQuoteService))
    private rfqQuoteService: RfqQuoteService,
    @InjectModel(Payment)
    private readonly paymentModel: typeof Payment,
    private readonly emailService: EmailService,
    private configService: ConfigService,
    private readonly sequelize: Sequelize,
  ) {}
  /**
   * Fetch a contract by id for user
   * @param contractId - the id of the contract to be fetched
   * @param user - the user fetching the contract
   * @returns the fetched contract
   */
  async getContractByIdForUser(
    contractId: string,
    user: User,
    includeModels = true,
  ) {
    const whereOptions: WhereOptions<Contract> = { id: contractId };
    if (user?.VendorId) whereOptions.VendorId = user.VendorId;
    if (user?.BuilderId) whereOptions.BuilderId = user.BuilderId;
    return await this.contractModel.findOrThrow({
      where: whereOptions,
      include: includeModels
        ? [
            {
              model: Project,
            },
            {
              model: RfqQuote,
              include: [
                {
                  model: RfqQuoteMaterial,
                  include: [{ model: RfqRequestMaterial }],
                },
              ],
            },
            { model: RfqRequest },
            {
              model: Vendor,
            },
            { model: Builder },
            { model: RateReview },
          ]
        : [],
    });
  }
  /**
   * Fetch all contract
   * @param contractId - the id of the contract to be fetched
   * @returns the fetched contract
   */
  async getContracts() {
    return await this.contractModel.findAll({
      include: [
        {
          model: RfqQuote,
          include: [
            { model: RfqRequestMaterial, include: [{ model: RfqCategory }] },
          ],
        },
        { model: RfqRequest },
        { model: Vendor },
        { model: Builder },
        { model: FundManager },
      ],
    });
  }

  async deleteContractByQuoteId({
    dbTransaction,
    rfqQuoteId,
  }: {
    rfqQuoteId: string;
    dbTransaction: Transaction;
  }) {
    await this.contractModel.destroy({
      where: {
        RfqQuoteId: rfqQuoteId,
      },
      transaction: dbTransaction,
    });
  }

  async getOrderDetailsByProjectId(ProjectId: string) {
    const result = await this.contractModel.findAll({
      attributes: [
        [this.sequelize.fn('COUNT', 'Contract.id'), 'contractCount'],
        [this.sequelize.literal('"RfqRequest"."id"'), 'RfqRequestId'],
        [this.sequelize.literal('"RfqQuote"."id"'), 'RfqQuoteId'],
        [this.sequelize.literal('"Vendor"."id"'), 'VendorId'],
      ],
      where: {
        ProjectId: ProjectId,
      },
      include: [
        {
          model: RfqRequest,
        },
        {
          model: RfqQuote,
        },
        { model: Vendor, attributes: [] },
      ],
      group: ['RfqRequest.id', 'RfqQuote.id', 'Vendor.id'],
      raw: true,
    });

    return result;
  }

  /**
   * Fetch a contract by id for a user
   * @param contractId - the id of the contract to be fetched
   * @param user - the user(vendor/builder) fetching the contract
   * @returns the fetched contract including RfqQuote, RfqRequest, Vendor, Builder
   */
  async getContractDetailsByIdForUser(contractId: string, user: User) {
    return await this.getContractByIdForUser(contractId, user, true);
  }

  /**
   * Creates Contract request between builder and vendor
   * @param rfqQuote - the RFQ quote to create a contract for
   * @param user - the user(builder) initiating the contract
   * @param dbTransaction The database transaction.
   */
  async createContract({
    rfqQuote,
    totalCost,
    dbTransaction,
  }: {
    rfqQuote: RfqQuote;
    totalCost: number;
    dbTransaction: SequelizeTransaction;
  }) {
    const fee = parseFloat(
      (totalCost * (this.configService.get('PERCENT_FEE') || 0.15)).toFixed(2),
    );
    return await this.contractModel.create(
      {
        VendorId: rfqQuote.VendorId,
        RfqQuoteId: rfqQuote.id,
        ProjectId: rfqQuote.RfqRequest.ProjectId,
        RfqRequestId: rfqQuote.RfqRequestId,
        BuilderId: rfqQuote.RfqRequest.BuilderId,
        FundManagerId: rfqQuote.RfqRequest.FundManagerId,
        totalCost,
        status: ContractStatus.PENDING,
        createdAt: new Date(),
        fee,
      },
      { transaction: dbTransaction },
    );
  }

  /**
   * Cancel a contract
   * @param contractId - the id of the contract to be cancelled
   * @param user - the user(vendor) cancelling the contract
   */
  async cancelContract(contractId: string, user: User) {
    const contract = await this.getContractByIdForUser(contractId, user);

    if (contract.status === ContractStatus.CANCELLED) {
      throw new BadRequestException(`This contract is already cancelled`);
    }

    if (
      contract.status !== ContractStatus.PENDING &&
      user.userType !== UserType.ADMIN
    ) {
      throw new BadRequestException(`This contract is no longer pending`);
    }
    await this.contractModel.update(
      {
        status: ContractStatus.CANCELLED,
        cancelledAt: new Date(),
      },
      {
        where: { id: contractId },
      },
    );
  }

  /**
   * Accept a contract
   * @param contractId - the id of the contract to be accepted
   * @param user - the user(vendor) accepting the contract
   */
  async acceptContract({
    contractId,
    user,
    dbTransaction,
  }: {
    contractId: string;
    user: User;
    dbTransaction?: SequelizeTransaction;
  }) {
    const contract = await this.getContractByIdForUser(contractId, user);
    if (contract.status === ContractStatus.ACCEPTED) {
      throw new BadRequestException(`This contract has already been accepted`);
    }

    if (contract.status !== ContractStatus.PENDING) {
      throw new BadRequestException(`This contract is no longer pending`);
    }

    // Check if contract is  funded, else throw error
    if (contract.paymentStatus !== ContractPaymentStatus.CONFIRMED) {
      throw new BadRequestException(
        `Contract cannot be accepted until payment is confirmed`,
      );
    }

    if (!dbTransaction) {
      dbTransaction = await this.sequelize.transaction();
    }
    try {
      await this.contractModel.update(
        {
          status: ContractStatus.ACCEPTED,
          acceptedAt: new Date(),
        },
        { where: { id: contractId }, transaction: dbTransaction },
      );

      await this.rfqQuoteService.rejectOtherBids(
        contract.RfqQuoteId,
        contract.RfqRequestId,
        dbTransaction,
      );

      await this.emailService.sendContractAccepted(contract);
      await dbTransaction.commit();
    } catch (error) {
      await dbTransaction.rollback();
      throw error;
    }
  }

  /**
   * Pay for a contract
   * @param contractId - the id of the contract to be paid for
   * @param user - the user(builder) paying for the contract
   */
  async payForContract({
    contractId,
    user,
    vend_token,
    dbTransaction,
  }: {
    contractId: string;
    user?: User;
    vend_token: string;
    dbTransaction: SequelizeTransaction;
  }) {
    try {
      const contract = await this.getContractByIdForUser(contractId, user);

      if (contract.paymentStatus !== ContractPaymentStatus.PENDING) {
        throw new BadRequestException(`Payment no longer pending`);
      }

      await this.contractModel.update(
        {
          paymentStatus: ContractPaymentStatus.CONFIRMED,
          paidAt: new Date(),
        },
        { where: { id: contractId }, transaction: dbTransaction },
      );
      await this.paymentModel.update(
        { pay_status: PaymentStatus.SUCCESS },
        {
          where: {
            ContractId: contractId,
            vend_token,
          },
          transaction: dbTransaction,
        },
      );
      await this.emailService.sendContractPaid(contract);
      await this.emailService.AdminNotifyContractPaid(contract);
      await this.getContractByIdForUser(contractId, user);
      return contract;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Dispatch a contract
   * @param contractId - the id of the contract/ delivery schedule item to be dispatched
   * @param user - the user(vendor) dispatching the contract
   */
  async dispatchContract(contractId: string, scheduleId: string, user: User) {
    try {
      await this.contractModel.findByPkOrThrow(contractId);
      const contract = await this.getContractByIdForUser(contractId, user);

      if (contract.paymentStatus !== ContractPaymentStatus.CONFIRMED) {
        throw new BadRequestException(
          `This contract payment has not been confirmed`,
        );
      }

      const delivery = await this.deliveryScheduleModel.findOne({
        where: { id: scheduleId },
        include: [{ model: Order }],
      });

      if (delivery?.status === OrderStatus.ONGOING) {
        throw new BadRequestException(
          `This delivery has already been dispatched`,
        );
      }

      await this.contractModel.update(
        {
          deliveryStatus: ContractDeliveryStatus.DISPATCHED,
          dispatchedAt: new Date(),
        },
        {
          where: {
            id: contractId,
          },
        },
      );

      const order = delivery.order;
      order.status = OrderStatus.ONGOING;
      await order.save();

      await this.deliveryScheduleModel.update(
        {
          status: OrderStatus.ONGOING,
        },
        {
          where: {
            id: scheduleId,
          },
        },
      );

      await this.emailService.sendContractDispatchedEmail(contract);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Deliver a contract
   * @param contractId - the id of the contract to be delivered
   * @param user - the user(vendor) delivering the contract
   */
  async deliverContract({
    contractId,
    user,
    dbTransaction,
  }: {
    contractId: string;
    user: User;
    dbTransaction: Transaction;
  }) {
    const contract = await this.getContractByIdForUser(contractId, user);

    if (contract.deliveryStatus === ContractDeliveryStatus.DELIVERED) {
      throw new BadRequestException(`This contract has already been delivered`);
    }

    if (contract.deliveryStatus !== ContractDeliveryStatus.DISPATCHED) {
      throw new BadRequestException(
        `This contract has not been dispatched yet`,
      );
    }

    await this.contractModel.update(
      {
        deliveryStatus: ContractDeliveryStatus.DELIVERED,
        deliveredAt: new Date(),
      },
      { where: { id: contractId }, transaction: dbTransaction },
    );
  }

  /**
   * Confirm a contract
   * @param contractId - the id of the contract to be confirmed
   * @param user - the user(builder) confirming the contract
   */
  async confirmContract({
    contractId,
    user,
    dbTransaction,
  }: {
    contractId: string;
    user: User;
    dbTransaction: Transaction;
  }) {
    const contract = await this.getContractByIdForUser(contractId, user);

    if (contract.deliveryStatus === ContractDeliveryStatus.PROCESSING) {
      throw new BadRequestException(`This contract has not been delivered yet`);
    }
    if (contract.status === ContractStatus.COMPLETED) {
      throw new BadRequestException(`This contract has already been completed`);
    }

    await this.contractModel.update(
      {
        status: ContractStatus.COMPLETED,
        deliveryStatus: ContractDeliveryStatus.DELIVERED,
        completedAt: new Date(),
      },
      { where: { id: contractId }, transaction: dbTransaction },
    );
    await this.emailService.confirmAndcompleteContract(contract);
  }

  /**
   * vendor notifies delivery of  a contract
   * @param DeliveryConfirmationDto - the data of the contract to be confirmed
   * @param user - the user(vendor) sending delivery confirming the contract
   */
  async vendorConfirmDelivery(data: DeliveryConfirmationDto, user: User) {
    await this.emailService.sendDeliveryConfirmationEmailToBuilder(data);
    await this.emailService.sendDeliveryConfirmationEmailToVendor(
      data,
      user.email,
    );
    return { message: 'Delivery Notification Sent' };
  }

  /**
   * Disburse payment for a contract
   * @param contractId - the id of the contract
   * @param user - the user(admin) disbursing payment for the contract
   */
  async disburseContractPayment(contractId: string, user: User) {
    const contract = await this.getContractByIdForUser(contractId, user);

    if (contract.status !== ContractStatus.COMPLETED) {
      throw new BadRequestException(`This contract is not yet completed`);
    }

    if (contract.isDisbursed) {
      throw new BadRequestException(`Contract payment already disbursed`);
    }

    await this.contractModel.update(
      {
        isDisbursed: true,
        disbursedAt: new Date(),
        DisbursedById: user.id,
      },
      { where: { id: contractId } },
    );
  }

  /**
   * Fetch all contract for user
   * @param user - the user(vendor/builder) fetching the contract
   * @returns all contracts for the specified user
   */
  async getAllContractsForUser(user: User, isArchived?: boolean) {
    const whereOptions: WhereOptions<Contract> = {};
    if (user.VendorId) whereOptions.VendorId = user.VendorId;
    if (user.BuilderId) whereOptions.BuilderId = user.BuilderId;
    if (isArchived !== undefined) whereOptions.isArchived = isArchived;

    return await this.contractModel.findAndCountAll({
      include: [
        {
          model: RfqQuote,
          include: [
            { model: RfqRequestMaterial, include: [{ model: RfqCategory }] },
          ],
        },
        { model: RfqRequest },
        { model: Vendor },
        { model: Builder },
        { model: FundManager },
      ],
      where: whereOptions,
    });
  }

  /**
   * Fetch all archived contracts for a user
   * @param user - the user(vendor/builder) fetching contracts
   * @returns all archived contracts by the user
   */
  async getAllArchivedContractsForUser(user: User) {
    return await this.getAllContractsForUser(user, true);
  }

  /**
   * Fetch all non-archived contracts for a user
   * @param user - the user(vendor/builder) fetching contracts
   * @returns all non-archived contracts for the user
   */
  async getAllNonArchivedContractsForUser(user: User) {
    return await this.getAllContractsForUser(user, false);
  }

  /**
   * Archive a contract for a user
   * @param contractId - the id of the contract to be archived
   * @param user - the user(builder/vendor) archiving the contract
   */
  async archiveContractForUser(contractId: string, user: User) {
    const contract = await this.getContractByIdForUser(contractId, user);

    await this.contractModel.update(
      {
        isArchived: !contract.isArchived,
      },
      { where: { id: contractId } },
    );
  }

  /**
   * Fetch all achieved orders between builder and vendor
   * @param user -  fetching the satisfied order
   * @returns all satisfied orders for all user
   */
  async getAllsatisfiedOrders() {
    return await this.contractModel.findAndCountAll({
      where: { isArchived: true },
    });
  }

  /**
   * get a contract by id
   * @param contractId - the id of the contract to be fetched
   * @returns returns the contract with the specified id
   */
  async getContractById(contractId: string) {
    return await this.contractModel.findByPkOrThrow(contractId, {
      include: { all: true },
    });
  }

  /**
   * Admin confirms a payment using the vendor token.
   * @param {string} vend_token - The vendor token associated with the payment.
   * @param {Transaction} [transaction] - Optional Sequelize transaction.
   * @returns {Promise<Contract>} Returns true if the payment is successfully confirmed.
   * @throws {BadRequestException} If the payment cannot be verified.
   */
  async adminConfirmPayment(
    vend_token: string,
    transaction?: Transaction,
  ): Promise<Contract> {
    if (!transaction) {
      transaction = await this.sequelize.transaction();
    }
    try {
      const payment = await this.paymentModel.findOne({
        where: { vend_token },
        include: [{ model: Contract }],
      });
      const paymentApproved = await this.payForContract({
        contractId: payment.ContractId,
        user: payment.CreatedBy,
        vend_token,
        dbTransaction: transaction,
      });
      transaction.commit();
      return paymentApproved;
    } catch (error) {
      transaction.rollback();
      throw new BadRequestException(
        'admin could not verify payment please contact support',
      );
    }
  }
}
