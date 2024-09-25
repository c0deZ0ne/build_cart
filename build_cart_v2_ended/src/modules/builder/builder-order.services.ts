import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Order, OrderStatus } from '../order/models';
import { Contract, ContractDeliveryStatus } from '../contract/models';
import { User } from '../user/models/user.model';
import { Op } from 'sequelize';
import { BuilderOrderType, BuilderRfqOrderType } from './types';
import { Vendor } from '../vendor/models/vendor.model';
import { Project } from '../project/models/project.model';
import {
  RfqCategory,
  RfqQuote,
  RfqRequest,
  RfqRequestMaterial,
} from '../rfq/models';
import { Sequelize } from 'sequelize-typescript';
import { Payment } from '../payment/models/payment.model';
import { ConfigService } from '@nestjs/config';
import {
  DeliverySchedule,
  RfqRequestPaymentTerm,
} from '../order/models/order-schedule.model';
import * as moment from 'moment';
import { ConfirmDeliveryDto } from '../vendor/dto/confirm-deliveryotp.dto';
import { ContractService } from '../contract/contract.service';
import { RateReviewService } from '../rate-review/rate-review.service';
import { CreateDisputeDto, RateReviewVendorDto } from './dto';
import { DisputeService } from '../dispute/dispute.service';
import { OrdersResponse } from '../vendor/dto/register-vendor-from-market.dto';
import { Dispute } from '../dispute/models/dispute.model';
import { FundManager } from '../fund-manager/models/fundManager.model';
import { RateReview } from '../rate-review/model/rateReview.model';

@Injectable()
export class BuilderOrderServices {
  constructor(
    @InjectModel(Order)
    private readonly orderModel: typeof Order,
    @InjectModel(Contract)
    private readonly contractModel: typeof Contract,
    @InjectModel(Dispute)
    private readonly disputeModel: typeof Dispute,
    @InjectModel(Payment)
    private readonly paymentModel: typeof Payment,
    private readonly configService: ConfigService,
    private readonly sequelize: Sequelize,
    private readonly contractService: ContractService,
    private readonly rateReviewService: RateReviewService,
    private readonly disputeService: DisputeService,
  ) {}

  async groupedPendingOrders({
    user,
    projectId,
  }: {
    user: User;
    projectId: string;
  }) {
    const allPendingOrderByProject = await this.orderModel.findAll({
      where: {
        ProjectId: projectId,
        status: {
          [Op.or]: [OrderStatus.PENDING],
        },
      },
      include: [
        {
          model: Vendor,
          attributes: ['logo', 'businessName'],
        },
        { model: RfqQuote },
        { model: RfqRequestMaterial },
        { model: Contract, include: [{ model: Project }] },
      ],
    });

    const pendingData: BuilderOrderType[] = allPendingOrderByProject.reduce(
      (processedOrder: BuilderOrderType[], currentOrder: Order) => {
        const existData: BuilderOrderType = processedOrder.find(
          (data: BuilderOrderType) => data.VendorId === currentOrder.VendorId,
        );
        if (!existData) {
          processedOrder.push({
            VendorId: currentOrder.VendorId,
            logo: currentOrder.Vendor.logo,
            vat: Number(currentOrder.RfqQuote.tax),
            totalNumberOfPayment: allPendingOrderByProject.length,
            margin: 0,
            totalBudget: Number(currentOrder.RfqRequestMaterial.budget),
            name:
              currentOrder.Vendor.businessName ||
              currentOrder.Vendor.businessName ||
              currentOrder.Vendor.businessName,
            location: currentOrder.Contract.Project.location,
            totalCost: Number(currentOrder.Contract.totalCost),
            VendorOrders: [JSON.parse(JSON.stringify(currentOrder))],
          });
        } else {
          existData.totalCost += Number(currentOrder.Contract.totalCost);
          existData.totalBudget += Number(
            currentOrder.RfqRequestMaterial.budget,
          );
          existData.margin =
            Number(existData.totalCost) - Number(existData.totalBudget);
          existData.VendorOrders.push(JSON.parse(JSON.stringify(currentOrder)));
        }
        return processedOrder;
      },
      [],
    );
    return pendingData;
  }

  async groupedPaidOrders({
    user,
    projectId,
  }: {
    user: User;
    projectId: string;
  }) {
    const allPaidOrderByProject = await this.orderModel.findAll({
      where: {
        ProjectId: projectId,
        status: {
          [Op.or]: [OrderStatus.PAID],
        },
      },
      include: [
        {
          model: Vendor,
          attributes: ['logo', 'businessName'],
        },
        { model: RfqQuote },
        { model: RfqRequestMaterial },
        { model: Contract, include: [{ model: Project }] },
      ],
    });

    const paidData: BuilderOrderType[] = allPaidOrderByProject.reduce(
      (processedOrder: BuilderOrderType[], currentOrder: Order) => {
        const existData: BuilderOrderType = processedOrder.find(
          (data: BuilderOrderType) => data.VendorId === currentOrder.VendorId,
        );
        if (!existData) {
          processedOrder.push({
            VendorId: currentOrder.VendorId,
            logo: currentOrder.Vendor.logo,
            vat: Number(currentOrder.RfqQuote.tax),
            totalNumberOfPayment: allPaidOrderByProject.length,
            margin: 0,
            totalBudget: Number(currentOrder.RfqRequestMaterial.budget),
            name:
              currentOrder.Vendor.businessName ||
              currentOrder.Vendor.businessName,
            location: currentOrder.Contract.Project.location,
            totalCost: Number(currentOrder.Contract.totalCost),
            VendorOrders: [JSON.parse(JSON.stringify(currentOrder))],
          });
        } else {
          existData.totalCost += Number(currentOrder.Contract.totalCost);
          existData.totalBudget += Number(
            currentOrder.RfqRequestMaterial.budget,
          );
          existData.margin =
            Number(existData.totalCost) - Number(existData.totalBudget);
          existData.VendorOrders.push(JSON.parse(JSON.stringify(currentOrder)));
        }
        return processedOrder;
      },
      [],
    );
    return paidData;
  }

  async getBuilderOrdersForRfQ({
    user,
    rfqRequestId,
  }: {
    user: User;
    rfqRequestId: string;
  }) {
    const data = await this.orderModel.findAll({
      where: { RfqRequestId: rfqRequestId },
      include: [
        { model: RfqRequest },
        { model: Contract },
        { model: RfqQuote, include: [{ model: Vendor }] },
        { model: RfqRequestMaterial, include: [{ model: RfqCategory }] },
        { model: DeliverySchedule },
      ],
    });
    const resData: BuilderRfqOrderType = {
      id: '',
      rfqMaterialName: '',
      totalQuantity: 0,
      metric: null,
      deliveryAddress: '',
      category: '',
      completed: 0,
      ongoing: 0,
      amount: 0,
      budget: 0,
      vendorName: '',
      estimatedDeliveryDate: new Date(),
      paymentType: RfqRequestPaymentTerm.ESCROW,
      deliverySchedule_Orders: [],
    };
    data.reduce((acc, curr) => {
      acc.id = curr.id;
      acc.rfqMaterialName = curr.RfqRequestMaterial.name;
      acc.metric = curr.RfqRequestMaterial.metric;
      acc.totalQuantity = curr.RfqRequestMaterial.quantity;
      acc.deliveryAddress = curr.RfqRequest.deliveryAddress;
      acc.estimatedDeliveryDate = curr.RfqRequest.deliveryDate;
      acc.category = curr.RfqRequestMaterial.category.title;
      acc.vendorName = curr.RfqQuote.Vendor.businessName;
      acc.amount = curr.Contract.totalCost;
      acc.budget = curr.RfqRequest.totalBudget;
      acc.deliverySchedule_Orders = curr.deliverySchedules.map((d) => {
        if (
          d.status == OrderStatus.PENDING ||
          d.status == OrderStatus.PAID ||
          d.status == OrderStatus.ONGOING
        ) {
          acc.ongoing += 1;
        }
        if (d.status == OrderStatus.COMPLETED) {
          acc.completed += 1;
        }
        const targetTime = d.dueDate;
        const targetMoment = moment(targetTime, 'YYYY-MM-DD HH:mm:ss');
        const currentMoment = moment();
        const isDue = currentMoment.isAfter(targetMoment);

        return {
          id: d.id,
          status: isDue ? 'Due' : d.status,
          quantity: d.quantity,
          description: d.description,
          deliveryDate: d.dueDate,
        };
      });
      return acc;
    }, resData);
    return resData;
  }

  /**
   * Confirm a contract/order delivery
   * @param ConfirmDeliveryDto - the data needed for order/contract delivery confirmation
   * @param user - the user(builder) confirming delivery the contract
   */
  async confirmDelivery({
    body,
    user,
  }: {
    body: ConfirmDeliveryDto;
    user: User;
  }) {
    const dbTransaction = await this.sequelize.transaction();
    const orderdata = await this.orderModel.findOne({
      where: { id: body.orderId },
      include: [{ model: Contract }],
    });

    try {
      if (orderdata?.orderVerified)
        throw new BadRequestException(
          'this order is already completed and closed',
        );
      if (!orderdata)
        throw new UnauthorizedException(
          'this order does not belong to you or insufficient access',
        );

      await this.contractService.confirmContract({
        contractId: orderdata.ContractId,
        user,
        dbTransaction,
      });
      orderdata.orderVerified = true;
      orderdata.orderOtp = null;
      orderdata.updatedAt = new Date();
      orderdata.UpdatedById = user.id;
      orderdata.status = OrderStatus.COMPLETED;
      await orderdata.save({ transaction: dbTransaction });
      await dbTransaction.commit();
      return orderdata;
    } catch (error) {
      await dbTransaction.rollback();
      throw new BadRequestException(error.message);
    }
  }

  async rateReviewVendor(
    data: RateReviewVendorDto,
    user: User,
    contractId: string,
  ) {
    await this.rateReviewService.rateAndReviewVendor(data, user, contractId);
    return { message: ' vendor was successfully rated' };
  }

  async createDispute(body: CreateDisputeDto, contractId: string, user: User) {
    return await this.disputeService.createDispute(body, contractId, user);
  }

  async getDisputedOrders(user: User): Promise<OrdersResponse> {
    const disputes = await this.disputeModel.findAll({
      where: {
        BuilderId: user.BuilderId,
        CreatedById: user.id,
      },
      include: [
        {
          model: Contract,
          attributes: ['id', 'deliveryStatus', 'status', 'paymentStatus'],
          include: [
            {
              model: RfqQuote,
              attributes: ['status', 'id', 'rfqQuoteBargainStatus', 'lpo'],
              include: [
                {
                  model: RfqRequestMaterial,
                },
              ],
            },
          ],
        },
        {
          model: Vendor,
        },
      ],
    });

    return {
      orders: disputes,
      totalLength: disputes.length,
    };
  }

  async allBuilderOrders(builderId: string): Promise<OrdersResponse> {
    const orders = await this.orderModel.findAll({
      where: {
        BuilderId: builderId,
      },
      attributes: [
        'id',
        'paidAt',
        'orderVerified',
        'createdAt',
        'BuilderId',
        'ContractId',
        'status',
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
          ],
          include: [
            {
              model: User,
              as: 'CreatedBy',
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
                ContractDeliveryStatus.INREVIEW,
                ContractDeliveryStatus.DELIVERED,
                ContractDeliveryStatus.DISPATCHED,
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
          include: [
            {
              model: Vendor,
              attributes: [
                'id',
                'logo',
                'businessName',
                'businessAddress',
                'email',
                'phone',
                'status',
              ],
            },
          ],
        },
      ],
    });

    const ordersWithPendingCount = orders.map((order) => {
      const pendingCount = order.deliverySchedules.filter(
        (schedule) => schedule.status !== 'COMPLETED',
      ).length;

      return {
        ...order.toJSON(),
        pendingCount: pendingCount,
      };
    });

    return {
      orders: ordersWithPendingCount,
      totalLength: orders.length,
    };
  }

  async completedOrders(builderId: string) {
    return await this.orderModel.findAll({
      where: {
        BuilderId: builderId,
      },
      include: [
        {
          model: Contract,
          where: {
            deliveryStatus: ContractDeliveryStatus.DELIVERED,
          },
        },
      ],
    });
  }

  async ongoingOrders(builderId: string) {
    return await this.orderModel.findAll({
      where: {
        BuilderId: builderId,
      },
      include: [
        {
          model: Contract,
          where: {
            deliveryStatus: {
              [Op.in]: [
                ContractDeliveryStatus.DISPATCHED,
                ContractDeliveryStatus.INREVIEW,
              ],
            },
          },
        },
      ],
    });
  }

  async getOrdersDashboard(user: User) {
    const result = await Promise.all([
      await this.completedOrders(user.BuilderId),
      await this.ongoingOrders(user.BuilderId),
    ]);
    return {
      ongoingOrders: result[1].length,
      completedOrders: result[0].length,
    };
  }
}
