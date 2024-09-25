import {
  Logger,
  BadRequestException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import {
  Contract,
  ContractDeliveryStatus,
  ContractStatus,
} from '../contract/models';
import { Order, OrderStatus } from '../order/models';
import { Payment } from '../payment/models/payment.model';
import {
  RfqQuote,
  RfqRequestMaterial,
  RfqCategory,
  RfqBargain,
  RfqItem,
  RfqRequest,
  RfqQuoteStatus,
  RfqQuoteMaterial,
} from '../rfq/models';
import { Vendor } from './models/vendor.model';
import { OrderService } from '../order/order.services';
import { User } from '../user/models/user.model';
import { ContractService } from '../contract/contract.service';
import * as moment from 'moment';
import { ConfirmDeliveryDto } from './dto/confirm-deliveryotp.dto';
import { Builder } from '../builder/models/builder.model';
import { FundManager } from '../fund-manager/models/fundManager.model';
import { DeliverySchedule } from '../order/models/order-schedule.model';
import { Dispute } from '../dispute/models/dispute.model';
import { DisputeService } from '../dispute/dispute.service';
import { CreateDisputeDto } from '../builder/dto/create-dispute.dto';
import { RateReviewService } from '../rate-review/rate-review.service';
import { RateReviewBuilderDto } from '../builder/dto/rate-review-vendor.dto';
import { DeliveryConfirmationDto } from '../email/dto/deliveryConfirmation.dto';
import { RateReview } from '../rate-review/model/rateReview.model';
import { OrdersResponse } from './dto/register-vendor-from-market.dto';
import { UserService } from '../user/user.service';
import { DispatchDto } from './dto';

export class VendorOrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    @InjectModel(Order)
    private readonly orderModel: typeof Order,
    @InjectModel(DeliverySchedule)
    private readonly deliveryScheduleModel: typeof DeliverySchedule,
    @InjectModel(Contract)
    private readonly contractModel: typeof Contract,
    @InjectModel(Dispute)
    private readonly disputeModel: typeof Dispute,
    @InjectModel(Payment)
    private readonly paymentModel: typeof Payment,
    private readonly contractService: ContractService,
    private readonly sequelize: Sequelize,
    private readonly disputeService: DisputeService,
    private readonly rateReviewVendorService: RateReviewService,
    private readonly userService: UserService,
  ) {}

  async getAllOrders(): Promise<Order[]> {
    return await this.orderModel.findAll({ order: [['createdAt', 'DESC']] });
  }

  async getVendorOrders(VendorId: string): Promise<unknown> {
    const groupedOrders = await this.orderModel.findAll({
      order: [['createdAt', 'DESC']],
      where: {
        VendorId,
      },
      attributes: [
        [Sequelize.literal('"Order"."VendorId"'), 'VendorId'],
        [
          Sequelize.fn('count', Sequelize.literal('"Order"."id"')),
          'PendingOrderCount',
        ],
      ],
      group: ['Order.VendorId'],
    });

    const data = await Promise.all(
      groupedOrders.map(async (d) => {
        const VendorOrders = await this.orderModel.findAll({
          where: {
            VendorId: d.VendorId,
          },
          include: [
            {
              model: RfqQuote,
              include: [
                {
                  model: RfqRequestMaterial,
                  include: [{ model: RfqCategory }],
                },
              ],
            },
            {
              model: Vendor,
              attributes: ['companyName', 'id', 'email', 'address'],
            },
            {
              model: Contract,
              include: [
                { model: RfqQuote, include: [{ model: RfqRequestMaterial }] },
              ],
            },
          ],
        });

        const aggregatedData = VendorOrders.reduce(
          (acc, current) => {
            (acc.totalBudget += Number(current.RfqQuote.totalCost)),
              (acc.totalcost += Number(current.RfqQuote.totalCost)),
              (acc.totalLogisticCost += Number(
                current.RfqQuote.logisticCost.toString(),
              ));
            return acc;
          },
          {
            totalcost: 0,
            totalBudget: 0,
            totalLogisticCost: 0,
            VAT: 10,
            VendorOrders,
          },
        );
        const vatTotalCost =
          Number(aggregatedData.VAT / 100) *
          (aggregatedData.totalcost + aggregatedData.totalLogisticCost);
        const out = {
          ...aggregatedData,
          margin:
            aggregatedData.totalBudget -
            (vatTotalCost +
              aggregatedData.totalcost +
              aggregatedData.totalLogisticCost),
          vatTotalCost,
          ...d.get(),
        };
        return out;
      }),
    );

    return data;
  }

  async ongoingOrders(vendorId: string): Promise<unknown[]> {
    const orders = await this.orderModel.findAll({
      order: [['createdAt', 'DESC']],
      where: {
        VendorId: vendorId,
        status: {
          [Op.or]: [
            OrderStatus.ONGOING,
            OrderStatus.PAID,
            OrderStatus.UPCOMING,
          ],
        },
      },
      include: [
        {
          model: RfqRequest,
          include: [
            {
              model: User,
              as: 'CreatedBy',
              include: [
                {
                  model: Builder,
                  attributes: ['logo', 'businessName', 'businessAddress'],
                },
                {
                  model: FundManager,
                  attributes: ['logo', 'businessName', 'businessAddress'],
                },
              ],
              attributes: ['name', 'email', 'id'],
            },
            {
              model: RfqQuote,
              include: [
                {
                  model: RfqRequest,
                  attributes: [
                    'title',
                    'status',
                    'deliveryDate',
                    'deliveryAddress',
                    'deliveryInstructions',
                    'deliveryContactNumber',
                    'quoteDeadline',
                    'createdAt',
                  ],
                  include: [
                    { model: Builder, attributes: ['logo', 'id'] },
                    { model: FundManager, attributes: ['logo', 'id'] },
                  ],
                },
                { model: RfqRequestMaterial },
                { model: RfqBargain },
              ],
            },
          ],
        },
        {
          model: Contract,
          include: [
            {
              model: RfqQuote,
              include: [
                {
                  model: RfqRequestMaterial,
                  include: [
                    { model: RfqItem, include: [{ model: RfqCategory }] },
                  ],
                },
              ],
            },
            { model: RfqRequest },
          ],
        },
        { model: RfqRequestMaterial, include: [{ model: RfqItem }] },
      ],
    });

    const groupedRfqQuotes = orders.reduce(
      (result, { RfqRequest, Contract }) => {
        if (RfqRequest && RfqRequest.CreatedBy) {
          const existingGroup = result.find(
            (group) => group.name === RfqRequest.CreatedBy.name,
          );

          if (existingGroup) {
            if (Contract !== null) {
              existingGroup.contracts.push(Contract);
              existingGroup.total += Number(Contract.totalCost);
            }
          } else {
            result.push({
              name: RfqRequest.CreatedBy.name,
              id: RfqRequest.CreatedBy.id,
              total: Number(Contract.totalCost),
              owner:
                RfqRequest.CreatedBy.Builder ||
                RfqRequest.CreatedBy.FundManager,
              contracts: [Contract],
            });
          }
        }

        return result;
      },
      [],
    );

    const filteredGroupedRfqQuotes = groupedRfqQuotes.filter(
      (group) => group.contracts.length > 0,
    );

    return filteredGroupedRfqQuotes;
  }

  async completedOrders(vendorId: string): Promise<OrdersResponse> {
    const orders = await this.orderModel.findAll({
      where: {
        VendorId: vendorId,
      },
      attributes: [
        'id',
        'paidAt',
        'orderVerified',
        'createdAt',
        'BuilderId',
        'ContractId',
      ],
      include: [
        {
          model: RfqRequest,
          attributes: [
            'id',
            'paymentTerm',
            'deliveryDate',
            'deliveryAddress',
            'deliveryInstructions',
            'deliveryContactNumber',
          ],
          include: [
            {
              model: User,
              as: 'CreatedBy',
              include: [
                {
                  model: Builder,
                  attributes: ['id', 'logo', 'businessName', 'businessAddress'],
                },
                {
                  model: FundManager,
                  attributes: ['id', 'logo', 'businessName', 'businessAddress'],
                },
              ],
              attributes: ['name', 'email', 'id'],
            },
          ],
        },
        {
          model: Contract,
          attributes: [
            'id',
            'deliveryStatus',
            'status',
            'paymentStatus',
            'paidAt',
          ],
          where: {
            deliveryStatus: {
              [Op.in]: [
                ContractDeliveryStatus.DISPATCHED,
                ContractDeliveryStatus.DELIVERED,
                ContractDeliveryStatus.INREVIEW,
              ],
            },
          },
          include: [
            {
              model: RateReview,
              attributes: ['vendorReview', 'vendorRateScore'],
            },
          ],
        },
        {
          // Where clause removed on DeliverySchedule to Faciltate frontend implementation on listing schedules based on status
          model: DeliverySchedule,
          include: [
            {
              model: RfqRequestMaterial,
              attributes: [
                'id',
                'name',
                'quantity',
                'status',
                'budget',
                'description',
                'status',
              ],
            },
          ],
        },
        {
          model: RfqQuote,
        },
      ],
    });

    const ordersWithPendingCount = orders.map((order) => {
      const pendingCount = order.deliverySchedules.filter(
        (schedule) => schedule.status !== 'COMPLETED',
      ).length;

      const paymentStatus = order.Contract.transformPaymentStatus;
      const deliveryStatus = order.Contract.transformDeliveryStatus;
      return {
        ...order.toJSON(),
        contractPaymentStatus: paymentStatus,
        pendingCount: pendingCount,
        Contract: {
          ...order.Contract.toJSON(),
          deliveryStatus: deliveryStatus,
        },
      };
    });

    return {
      orders: ordersWithPendingCount,
      totalLength: orders.length,
    };
  }

  async vendorDeliveryConfirmation(
    data: DeliveryConfirmationDto,
    contractId: string,
    deliveryScheduleId: string,
    user: User,
  ) {
    const contract = await this.contractService.getContractById(contractId);

    if (!contract) {
      throw new BadRequestException('No contract Found');
    }

    const deliverySchedule = await this.deliveryScheduleModel.findByPkOrThrow(
      deliveryScheduleId,
    );

    if (!deliverySchedule) {
      throw new BadRequestException('No delivery schedule Found');
    }

    deliverySchedule.status = OrderStatus.COMPLETED;
    await deliverySchedule.save();

    contract.deliveryStatus = ContractDeliveryStatus.INREVIEW;
    await contract.save();
    this.contractService.vendorConfirmDelivery(data, user);
  }

  /**
   * Fetching list of builder-accepted bids/orders both funded and non funded
   * @param vendorId - the id of the contract to be paid for
   * @param user - the user(vendor) supplying the order
   */
  async getAllPurchaseOrders(vendorId: string): Promise<OrdersResponse> {
    const orders = await this.orderModel.findAll({
      order: [['createdAt', 'DESC']],
      where: { VendorId: vendorId },
      attributes: [
        'id',
        'paidAt',
        'orderVerified',
        'createdAt',
        'BuilderId',
        'ContractId',
      ],
      include: [
        {
          model: RfqRequest,
          attributes: [
            'id',
            'paymentTerm',
            'deliveryDate',
            'deliveryAddress',
            'deliveryInstructions',
            'deliveryContactNumber',
          ],
          include: [
            {
              model: User,
              as: 'CreatedBy',
              attributes: ['name', 'email', 'id', 'phoneNumber'],
              include: [
                {
                  model: Builder,
                  attributes: ['id', 'logo', 'businessName', 'businessAddress'],
                },
                {
                  model: FundManager,
                  attributes: ['id', 'logo', 'businessName', 'businessAddress'],
                },
              ],
            },
          ],
        },
        {
          model: RfqQuote,
          attributes: [
            'status',
            'id',
            'rfqQuoteBargainStatus',
            'lpo',
            'deliveryDate',
            'additionalNote',
          ],
          where: {
            status: RfqQuoteStatus.ACCEPTED,
          },
          include: [
            {
              model: RfqRequest,
              attributes: [
                'title',
                'status',
                'deliveryDate',
                'deliveryAddress',
                'deliveryInstructions',
                'quoteDeadline',
                'createdAt',
              ],
            },
            {
              model: RfqRequestMaterial,
              attributes: [
                'id',
                'name',
                'quantity',
                'status',
                'budget',
                'description',
                'status',
              ],
            },
            { model: RfqBargain },
          ],
        },
        {
          model: Contract,
          where: { status: { [Op.eq]: ContractStatus.PENDING } },
          attributes: [
            'id',
            'deliveryStatus',
            'status',
            'paymentStatus',
            'paidAt',
          ],
        },
        {
          model: DeliverySchedule,
        },
      ],
    });

    const transformedOrders = orders.map((order) => {
      const PaymentStatus = order.Contract.transformPaymentStatus;
      return {
        ...order.toJSON(),
        contractPaymentStatus: PaymentStatus,
      };
    });

    return {
      orders: transformedOrders,
      totalLength: orders.length,
    };
  }

  /**
   * Fetching list of yet to be dispatched orders
   * @param contractId - the id of the contract to be paid for
   * @param user - the user(builder) supplying the order
   */
  async getAllUnfulfilledOrders(vendorId: string): Promise<OrdersResponse> {
    const orders = await this.orderModel.findAll({
      order: [['createdAt', 'DESC']],
      where: { VendorId: vendorId },
      attributes: [
        'id',
        'paidAt',
        'orderVerified',
        'createdAt',
        'BuilderId',
        'ContractId',
      ],
      include: [
        {
          model: RfqRequest,
          attributes: [
            'id',
            'paymentTerm',
            'deliveryDate',
            'deliveryAddress',
            'deliveryInstructions',
            'deliveryContactNumber',
          ],
          include: [
            {
              model: User,
              as: 'CreatedBy',
              attributes: ['name', 'email', 'id', 'phoneNumber'],
              include: [
                {
                  model: Builder,
                  attributes: ['id', 'logo', 'businessName', 'businessAddress'],
                },
                {
                  model: FundManager,
                  attributes: ['id', 'logo', 'businessName', 'businessAddress'],
                },
              ],
            },
          ],
        },
        {
          model: Contract,
          where: { status: ContractStatus.ACCEPTED },
          attributes: [
            'id',
            'deliveryStatus',
            'status',
            'paymentStatus',
            'paidAt',
          ],
        },
        {
          model: DeliverySchedule,
          where: {
            status: { [Op.eq]: OrderStatus.PENDING },
          },
          include: [
            {
              model: RfqRequestMaterial,
              attributes: [
                'id',
                'name',
                'quantity',
                'status',
                'budget',
                'description',
                'status',
              ],
            },
          ],
        },
      ],
    });
    return {
      orders: orders,
      totalLength: orders.length,
    };
  }

  async getActiveOrders(vendorId: string): Promise<OrdersResponse> {
    const orders = await this.orderModel.findAll({
      order: [['createdAt', 'DESC']],
      where: {
        VendorId: vendorId,
      },
      attributes: [
        'id',
        'paidAt',
        'orderVerified',
        'createdAt',
        'status',
        'BuilderId',
        'ContractId',
      ],
      include: [
        {
          model: RfqRequest,
          attributes: [
            'id',
            'paymentTerm',
            'deliveryDate',
            'deliveryAddress',
            'deliveryInstructions',
            'deliveryContactNumber',
          ],
          include: [
            {
              model: User,
              as: 'CreatedBy',
              attributes: ['name', 'email', 'id'],
              include: [
                {
                  model: Builder,
                  attributes: ['id', 'logo', 'businessName', 'businessAddress'],
                },
                {
                  model: FundManager,
                  attributes: ['id', 'logo', 'businessName', 'businessAddress'],
                },
              ],
            },
          ],
        },
        {
          model: Contract,
          where: {
            deliveryStatus: {
              [Op.in]: [ContractDeliveryStatus.DISPATCHED],
            },
          },
          attributes: [
            'id',
            'deliveryStatus',
            'status',
            'paymentStatus',
            'paidAt',
          ],
        },
        {
          model: DeliverySchedule,
          where: {
            status: { [Op.eq]: OrderStatus.ONGOING },
          },
          include: [
            {
              model: RfqRequestMaterial,
              attributes: [
                'id',
                'name',
                'quantity',
                'status',
                'budget',
                'description',
                'status',
              ],
            },
          ],
        },
        {
          model: DeliverySchedule,
        },
        {
          model: RfqQuote,
        },
      ],
    });

    return {
      orders: orders,
      totalLength: orders.length,
    };
  }

  async getDisputedOrders(user: User): Promise<OrdersResponse> {
    const disputes = await this.disputeModel.findAll({
      where: {
        VendorId: user.VendorId,
        CreatedById: user.id,
      },
      include: [
        {
          model: Contract,
          attributes: ['id', 'deliveryStatus', 'status', 'paymentStatus'],
          include: [
            {
              model: RfqQuote,
              attributes: [
                'status',
                'id',
                'rfqQuoteBargainStatus',
                'lpo',
                'deliveryDate',
              ],
              include: [
                {
                  model: RfqRequestMaterial,
                },
                {
                  model: RfqQuoteMaterial,
                },
              ],
            },
          ],
        },
        {
          model: Builder,
        },
      ],
    });

    return {
      orders: disputes,
      totalLength: disputes.length,
    };
  }

  async getDashboardSummary(user: User, search_param?: string) {
    const { VendorId } = user;

    const result = await Promise.all([
      this.getAllUnfulfilledOrders(VendorId),
      this.ongoingOrders(VendorId),
      this.getDisputedOrders(user),
      this.completedOrders(VendorId),
    ]);

    return {
      unFullfilledOrders: result[0].totalLength,
      ongoingOrders: result[1].length as any,
      disputedOrders: result[2].totalLength,
      completedOrders: result[3].totalLength,
    };
  }

  async getVendorEarnings(user: User, search_param?: string) {
    const userWallet = await this.userService.getUserWallet(
      user.email,
      search_param,
    );

    return {
      lifeEarnings: Number(userWallet.wallet.totalCredit),
      withdrawals: Number(userWallet.wallet.ActualSpend),
      currentBalance: Number(userWallet.wallet.balance),
    };
  }

  async createDispute(body: CreateDisputeDto, contractId: string, user: User) {
    return await this.disputeService.createDispute(body, contractId, user);
  }

  async rateAndReviewBuilder(
    body: RateReviewBuilderDto,
    user: User,
    contractId: string,
  ) {
    return await this.rateReviewVendorService.rateAndReviewBuilder(
      body,
      user,
      contractId,
    );
  }

  async dispatchOrder(
    contractId: string,
    deliveryScheduleId: string,
    body: DispatchDto,
    user: User,
  ) {
    try {
      const order = await this.orderModel.findOne({
        where: { ContractId: contractId, VendorId: user.VendorId },
        include: [
          { model: RfqQuote },
          {
            model: DeliverySchedule,
            where: { id: deliveryScheduleId },
            include: [
              {
                model: RfqRequestMaterial,
              },
            ],
          },
        ],
      });
      if (!order) {
        throw new BadRequestException('Order not found');
      }
      await this.contractService.dispatchContract(
        contractId,
        deliveryScheduleId,
        user,
      );

      const quote = order?.RfqQuote;
      if (quote) {
        quote.startDeliveryDate = body.startDeliveryDate;
        quote.endDeliveryDate = body.endDeliveryDate;
        await quote.save();
      }

      const deliverySchedule = order?.deliverySchedules[0];
      if (!deliverySchedule) {
        throw new BadRequestException(
          `Delivery Schedule with ID ${deliveryScheduleId} not found.`,
        );
      }

      deliverySchedule.status = OrderStatus.ONGOING;
      await deliverySchedule.save();
      await order.save();
      return deliverySchedule;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
