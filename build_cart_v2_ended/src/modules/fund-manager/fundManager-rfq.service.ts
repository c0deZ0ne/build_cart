import { Injectable, BadRequestException } from '@nestjs/common';
import { RfqQuoteService } from '../rfq/rfq-quote.service';
import { User } from '../user/models/user.model';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class SponsorRfqService {
  constructor(
    private readonly rfqQuoteService: RfqQuoteService,
    private readonly sequelize: Sequelize,
  ) {}

  async fundManagerAcceptBid({
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
  async SponsorDeclineOrder({
    user,
    orderId,
  }: {
    user: User;
    orderId: string;
  }) {
    const dbTransaction = await this.sequelize.transaction();
    try {
      const orderdeclined = await this.rfqQuoteService.declineOrder({
        user,
        orderId,
        dbTransaction,
      });
      dbTransaction.commit();
      return orderdeclined;
    } catch (error) {
      dbTransaction.rollback();
      throw new BadRequestException(error.message);
    }
  }
}
