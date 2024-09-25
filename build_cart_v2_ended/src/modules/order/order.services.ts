import {
  BadRequestException,
  Inject,
  Logger,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/sequelize';
import {
  Contract,
  ContractPaymentStatus,
  ContractStatus,
} from '../contract/models';
import { EmailService } from '../email/email.service';
import { Payment } from '../payment/models/payment.model';
import { RfqQuoteService } from '../rfq/rfq-quote.service';
import { RfqService } from '../rfq/rfq.service';
import { Order, OrderStatus } from './models';
import { CreateOrderDto, GroupedOrdersByVendorDto } from './dto/order.dto';
import { Sequelize } from 'sequelize-typescript';
import { User } from '../user/models/user.model';
import { Vendor } from '../vendor/models/vendor.model';
import {
  RfqCategory,
  RfqQuote,
  RfqQuoteMaterial,
  RfqQuoteStatus,
  RfqRequest,
  RfqRequestMaterial,
} from '../rfq/models';
import { Op } from 'sequelize';
import * as moment from 'moment';
import { randomNumberGenerator } from 'src/util/util';
import { UserWallet } from '../user-wallet/models/user-wallet.model';

export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    @InjectModel(Order)
    private readonly orderModel: typeof Order,
    @InjectModel(Contract)
    private readonly contractModel: typeof Contract,
    @InjectModel(Payment)
    private readonly paymentModel: typeof Payment,
    private readonly configService: ConfigService,
    private readonly sequelize: Sequelize, // private readonly emailService: EmailService, // private configService: ConfigService,
  ) {}
  async createOrder({
    body,
    user,
  }: {
    body: CreateOrderDto;
    user: User;
  }): Promise<Order> {
    try {
      return await this.orderModel.create({
        ...body,
        acceptedAt: new Date(),
        status: OrderStatus.PENDING,
        createdAt: new Date(),
        CreatedById: user.id,
        FundManagerId: user.FundManagerId || null,
        BuilderId: user.BuilderId || null,
      });
    } catch (error) {
      if (error.name === 'SequelizeForeignKeyConstraintError') {
        this.logger.warn(`Foreign Key Constraint Error: ${error.message}`);
        throw new BadRequestException(`${error.original.detail}`);
      }
    }
  }

  async getOrderById(id: string): Promise<Order | null> {
    return await this.orderModel.findByPk(id, { include: { all: true } });
  }

  async getProjectOrderDetails(projectId: string): Promise<unknown> {
    const ordersData = await this.orderModel.findAndCountAll({
      where: {
        ProjectId: projectId,
      },
      include: { model: RfqQuote },
    });
    return await ordersData.rows.reduce(
      (acc, curr) => {
        if (
          curr.status == OrderStatus.PENDING ||
          curr.status == OrderStatus.ONGOING
        ) {
          acc.pendingOrder += Number(curr?.RfqQuote?.totalCost);
        } else if (curr.status == OrderStatus.PAID) {
          acc.paidOrder += Number(curr?.RfqQuote?.totalCost);
        }
        acc.total = Number(acc.paidOrder) + Number(acc.pendingOrder);
        acc.totalOrderCounts = ordersData.count;
        return acc;
      },
      {
        pendingOrder: 0,
        paidOrder: 0,
        total: 0,
        totalOrderCounts: 0,
      },
    );
  }

  async deletOrderById(id: string) {
    return await this.orderModel.destroy({
      where: { id },
    });
  }

  async getAllOrders(): Promise<Order[]> {
    return await this.orderModel.findAll();
  }

  async getGroupedOrdersByVendorAndStatusPending(
    projectId: string,
  ): Promise<any> {
    const groupedOrders = await this.orderModel.findAll({
      where: {
        ProjectId: projectId,
        status: {
          [Op.or]: [OrderStatus.PENDING],
        },
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
            ProjectId: projectId,
            status: OrderStatus.PENDING,
          },
          include: [
            { model: RfqQuote },
            { model: Contract },
            { model: RfqRequestMaterial, include: [{ model: RfqCategory }] },
            {
              model: Vendor,
              attributes: ['companyName', 'id', 'email', 'address'],
            },
          ],
        });

        const aggregatedData = VendorOrders.reduce(
          (acc, current) => {
            acc.totalBudget += parseFloat(
              current.RfqQuote.totalCost.toString(),
            );
            acc.totalcost += parseFloat(current.RfqQuote.totalCost.toString());
            acc.totalLogisticCost += parseFloat(
              current.RfqQuote.logisticCost.toString(),
            );
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
          parseFloat((aggregatedData.VAT / 100).toFixed(2)) *
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
  async getGroupedOrdersByVendorAndStatusPaid(
    projectId: string,
  ): Promise<unknown> {
    const groupedOrders = await this.orderModel.findAll({
      where: {
        ProjectId: projectId,
        status: {
          [Op.or]: [OrderStatus.PAID, OrderStatus.COMPLETED],
        },
      },
      attributes: [
        [Sequelize.literal('"Order"."VendorId"'), 'VendorId'],
        [Sequelize.literal('"Order"."id"'), 'id'],
        [
          Sequelize.fn('count', Sequelize.literal('"Order"."id"')),
          'PendingOrderCount',
        ],
      ],
      group: ['Order.VendorId', 'Order.id'],
    });

    const data = await Promise.all(
      groupedOrders.map(async (d) => {
        const VendorOrders = await this.contractModel.findAll({
          where: {
            VendorId: d.VendorId,
            ProjectId: projectId,
            paymentStatus: ContractPaymentStatus.CONFIRMED,
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
          ],
        });

        const aggregatedData = VendorOrders.reduce(
          (acc, current) => {
            acc.totalBudget += parseFloat(
              current.RfqQuote.totalCost.toString(),
            );
            acc.totalcost += parseFloat(current.RfqQuote.totalCost.toString());
            acc.VAT += parseFloat(current.RfqQuote.tax.toString());
            acc.totalLogisticCost += parseFloat(
              current.RfqQuote.logisticCost.toString(),
            );
            return acc;
          },
          {
            totalcost: 0,
            totalBudget: 0,
            totalLogisticCost: 0,
            VAT: 0,
            VendorOrders,
            orderId: groupedOrders[0].id,
          },
        );
        const vatTotalCost =
          parseFloat((aggregatedData.VAT / 100).toFixed(2)) *
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

  async getSponsorOrders(fundManagerId: string): Promise<unknown> {
    const groupedOrders = await this.orderModel.findAll({
      where: {
        FundManagerId: fundManagerId,
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
        const VendorOrders = await this.contractModel.findAll({
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
          ],
        });

        const aggregatedData = VendorOrders.reduce(
          (acc, current) => {
            acc.totalBudget += parseFloat(
              current.RfqQuote.totalCost.toString(),
            );
            acc.totalcost += parseFloat(current.RfqQuote.totalCost.toString());
            acc.VAT += parseFloat(current.RfqQuote.tax.toString());
            acc.totalLogisticCost += parseFloat(
              current.RfqQuote.logisticCost.toString(),
            );
            return acc;
          },
          {
            totalcost: 0,
            totalBudget: 0,
            totalLogisticCost: 0,
            VAT: 0,
            VendorOrders,
          },
        );
        const vatTotalCost =
          parseFloat((aggregatedData.VAT / 100).toFixed(2)) *
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

  async generateOrderOtp({ user, orderId }: { user: User; orderId: string }) {
    const OrderOtp = randomNumberGenerator(6);
    const OrderOtpExpiry = moment()
      .add(this.configService.get('OTP_EXPIRY_IN_SEC') ?? 3600, 's')
      .toDate();
    const orderdata = await this.orderModel.findOne({
      where: {
        id: orderId,
        FundManagerId: user.FundManagerId,
      },
      include: [
        { model: Contract },
        { model: RfqRequest },
        {
          model: RfqQuote,
          include: [
            {
              model: User,
              as: 'CreatedBy',
              include: [{ model: UserWallet }],
            },
          ],
        },
        { model: User, as: 'CreatedBy', include: [{ model: UserWallet }] },
      ],
    });
    if (orderdata.orderVerified)
      throw new BadRequestException(
        'this order is already verified and completed ',
      );
    if (!orderdata)
      throw new UnauthorizedException(
        'This request does not belong to you or does not exist ',
      );
    orderdata.orderOtp = OrderOtp;
    orderdata.orderOtpExpiry = OrderOtpExpiry;
    await orderdata.save();

    return orderdata;
  }
}
