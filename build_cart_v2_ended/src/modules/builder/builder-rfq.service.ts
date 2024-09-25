import { Injectable, BadRequestException } from '@nestjs/common';
import { RfqQuoteService } from '../rfq/rfq-quote.service';
import { User } from '../user/models/user.model';
import { Sequelize } from 'sequelize-typescript';
import { InjectModel } from '@nestjs/sequelize';
import {
  RfqQuote,
  RfqQuoteMaterial,
  RfqRequestMaterial,
  RfqRequestMaterialStatus,
} from '../rfq/models';
import { Op } from 'sequelize';
import { RfqService } from '../rfq/rfq.service';
import { rfqMaterialDetails, vendorBid } from './types';

@Injectable()
export class BuilderRfqService {
  constructor(
    @InjectModel(RfqRequestMaterial)
    private readonly rfqRequestMaterialModel: typeof RfqRequestMaterial,
    private readonly rfqQuoteService: RfqQuoteService,
    private readonly rfqService: RfqService,
    private readonly sequelize: Sequelize,
  ) {}

  async buyerAcceptBid({
    user,
    RfqQuoteId,
  }: {
    user: User;
    RfqQuoteId: string;
  }) {
    const dbTransaction = await this.sequelize.transaction();
    try {
      const data = await this.rfqQuoteService.acceptBid({
        user,
        RfqQuoteId,
        dbTransaction,
      });
      dbTransaction.commit();
      return data;
    } catch (error) {
      dbTransaction.rollback();
      throw new BadRequestException(error.message);
    }
  }
  async buyerDeclineOrder({ user, orderId }: { user: User; orderId: string }) {
    const dbTransaction = await this.sequelize.transaction();
    try {
      const orderdeclined = await this.rfqQuoteService.declineOrder({
        user,
        orderId,
        dbTransaction,
      });
      dbTransaction.commit();
      return {
        order: orderdeclined.Contract,
        scheduledDeliveries: orderdeclined.deliverySchedules,
      };
    } catch (error) {
      dbTransaction.rollback();
      throw new BadRequestException(error.message);
    }
  }

  async getRfqBids({
    user,
    rfqRequestId,
    search,
  }: {
    user: User;
    search?: string;
    rfqRequestId: string;
  }): Promise<rfqMaterialDetails> {
    const data = await this.rfqService.getBidsForRequest({
      rfqRequestId,
      search,
    });
    const processData: rfqMaterialDetails = {
      title: data.title,
      id: data.id,
      category: data.RfqRequestMaterials[0].category.title,
      budget: data.totalBudget,
      deliveryAddress: data.deliveryAddress,
      estimatedDeliveryDate: data.deliveryDate,
      ongoing: 0,
      completed: 0,
      paymentType: data.paymentTerm,
      bids: data.RfqQuotes.map((d: RfqQuote) => {
        const bidData: vendorBid = {
          quoteId: d.id,
          vendorName: d.Vendor?.businessName,
          quantity: data.RfqRequestMaterials[0].quantity,
          amount: d.totalCost,
          deliveryDate: d.deliveryDate,
        };
        return bidData;
      }),
    };

    return processData;
  }
}
