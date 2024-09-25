import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { MyPayment } from '../my-payment/models/myPayments.model';
import { Contract } from '../contract/models';
import { Payment } from '../payment/models/payment.model';
import { PaymentModule } from '../payment/payment.module';
import { BaniWebhookController } from './webhook-bani.controller';
import { WebhookBaniPaymentService } from './webhook-bani.sevice';
@Module({
  imports: [
    SequelizeModule.forFeature([MyPayment, Contract, Payment]),
    PaymentModule,
  ],
  controllers: [BaniWebhookController],
  providers: [WebhookBaniPaymentService],
  exports: [BaniWebhookController, WebhookBaniPaymentService],
})
export class WebhooksModule {}
