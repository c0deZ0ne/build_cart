import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Order, OrderStatus } from '../order/models';
import { Contract } from '../contract/models'; // Remove duplicated import
import { User } from '../user/models/user.model';
import { Op } from 'sequelize';
import { Vendor } from '../vendor/models/vendor.model';
import { Project } from '../project/models/project.model';
import { RfqQuote, RfqRequestMaterial } from '../rfq/models';
import { Sequelize } from 'sequelize-typescript';
import { Payment } from '../payment/models/payment.model';
import { ConfigService } from '@nestjs/config';
import { FundManagerOrderType } from './types';

@Injectable()
export class SponsorOrderServices {
  constructor(
    @InjectModel(Order)
    private readonly orderModel: typeof Order,
    @InjectModel(Contract)
    private readonly contractModel: typeof Contract,
    @InjectModel(Payment)
    private readonly paymentModel: typeof Payment,
    private readonly configService: ConfigService,
    private readonly sequelize: Sequelize,
  ) {}
  async groupedPendingOrders({
    projectId,
  }: {
    user?: User;
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
          attributes: [
            'logo',
            'companyName',
            'contactName',
            'tradingName',
            'companyName',
          ],
        },
        { model: RfqQuote },
        { model: RfqRequestMaterial },
        { model: Contract, include: [{ model: Project }] },
      ],
    });

    const pendingData: FundManagerOrderType[] = allPendingOrderByProject.reduce(
      (processedOrder: FundManagerOrderType[], currentOrder: Order) => {
        const existData: FundManagerOrderType = processedOrder.find(
          (data: FundManagerOrderType) =>
            data.VendorId === currentOrder.VendorId,
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

  async groupedPaidOrders({ projectId }: { user?: User; projectId: string }) {
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
          attributes: [
            'logo',
            'companyName',
            'contactName',
            'tradingName',
            'companyName',
          ],
        },
        { model: RfqQuote },
        { model: RfqRequestMaterial },
        { model: Contract, include: [{ model: Project }] },
      ],
    });

    const paidData: FundManagerOrderType[] = allPaidOrderByProject.reduce(
      (processedOrder: FundManagerOrderType[], currentOrder: Order) => {
        const existData: FundManagerOrderType = processedOrder.find(
          (data: FundManagerOrderType) =>
            data.VendorId === currentOrder.VendorId,
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
}
