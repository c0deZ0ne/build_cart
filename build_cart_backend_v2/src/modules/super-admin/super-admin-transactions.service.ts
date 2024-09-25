import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Project } from '../project/models/project.model';
import { Op } from 'sequelize';

import * as moment from 'moment';
import {
  Contract,
  ContractDeliveryStatus,
  ContractStatus,
} from '../contract/models';
import { Dispute } from '../dispute/models/dispute.model';
import { Builder } from '../builder/models/builder.model';
import { Vendor } from '../vendor/models/vendor.model';
import {
  RfqItem,
  RfqQuote,
  RfqRequest,
  RfqRequestMaterial,
} from '../rfq/models';
import {
  DeliverySchedule,
  OrderStatus,
} from '../order/models/order-schedule.model';
import { Escrow } from '../escrow/models/escrow.model';
import { Order } from '../order/models';

@Injectable()
export class SuperAdminTransactionService {
  constructor(
    @InjectModel(Dispute)
    private readonly disputeModel: typeof Dispute,
    @InjectModel(Contract)
    private readonly contractModel: typeof Contract,
    @InjectModel(Escrow)
    private readonly escrowModel: typeof Escrow,
    @InjectModel(Project)
    private readonly projectModel: typeof Project,
  ) {}

  async getTransactions() {
    const completedContracts = await this.contractModel.findAll({
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
        { model: Vendor },
        { model: Builder },
        {
          model: RfqQuote,
          include: [
            { model: RfqRequestMaterial, include: [{ model: RfqItem }] },
          ],
        },
        { model: RfqRequest },
      ],
      order: [['createdAt', 'DESC']],
    });

    const activeContracts = await this.contractModel.findAll({
      where: {
        deliveryStatus: {
          [Op.in]: [
            ContractDeliveryStatus.PROCESSING,
            ContractDeliveryStatus.INREVIEW,
          ],
        },
      },
      include: [
        { model: Vendor },
        { model: Builder },
        {
          model: RfqQuote,
          include: [
            { model: RfqRequestMaterial, include: [{ model: RfqItem }] },
          ],
        },
        { model: RfqRequest },
      ],
      order: [['createdAt', 'DESC']],
    });

    const disputes = await this.disputeModel.findAll({
      include: [
        {
          model: Contract,
          include: [
            { model: Vendor },
            { model: Builder },
            {
              model: RfqQuote,
              include: [
                { model: RfqRequestMaterial, include: [{ model: RfqItem }] },
              ],
            },
            { model: RfqRequest },
          ],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    let activeTransactionVolume = 0;
    let completedTransactionVolume = 0;
    let disputeTransactionVolume = 0;
    const activeTransactions = [];
    const completedTransactions = [];
    const disputeTransactions = [];

    completedContracts.map((contract) => {
      completedTransactionVolume += Number(contract.totalCost);
      completedTransactions.push(contract);
    });

    activeContracts.map((contract) => {
      activeTransactionVolume += Number(contract.totalCost);
      activeTransactions.push(contract);
    });

    disputes.map((dispute) => {
      disputeTransactionVolume += Number(dispute.Contract.totalCost);
      disputeTransactions.push(dispute.Contract);
    });

    return {
      activeTransactionVolume,
      activeTransactions,
      totalActiveTransactions: activeTransactions.length,

      completedTransactionVolume,
      completedTransactions,
      totalCompletedTransactions: completedTransactions.length,

      disputeTransactionVolume,
      disputeTransactions,
      totalDipsutes: disputeTransactions.length,
    };
  }

  async getProjectsByDateFilter(startDate: string, endDate: string) {
    return await this.projectModel.findAll({
      where: {
        createdAt: {
          [Op.gte]: moment(startDate).startOf('d'),
          [Op.lte]: moment(endDate).startOf('d'),
        },
      },
      include: [
        {
          model: Project,
          as: 'CompanyProjects',
        },
      ],
    });
  }

  async getRevenues() {
    const escrows = await this.escrowModel.findAll({
      include: [
        {
          model: Contract,
          attributes: ['id', 'status', 'paymentStatus'],
          include: [
            {
              model: Vendor,
              attributes: ['id', 'email', 'businessName'],
            },
            {
              model: Builder,
              attributes: ['id', 'email', 'businessName'],
            },
            {
              model: RfqQuote,
              attributes: ['id', 'status', 'deliveryDate'],
              include: [
                {
                  model: RfqRequestMaterial,
                  attributes: ['id', 'name', 'quantity', 'metric'],
                },
              ],
            },
          ],
        },
        // { model: Project },
        {
          model: RfqRequest,
          attributes: [
            'id',
            'deliveryDate',
            'deliveryAddress',
            'deliverySchedule',
          ],
        },
        // { model: Order },
      ],
      order: [['createdAt', 'DESC']],
    });

    let totalRevenue = 0;

    escrows.map((escrow) => {
      totalRevenue += Number(escrow.commisionValue);
    });

    return {
      totalRevenue: Number(totalRevenue.toFixed(2)),
      revenues: escrows,
    };
  }
}
