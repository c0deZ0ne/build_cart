import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PaystackPaymentService } from './paystcak-payment.service';
import { Payment } from '../models/payment.model';
import { PaymentModule } from '../payment.module';
import { Contract } from 'src/modules/contract/models';

@Module({
  imports: [
    SequelizeModule.forFeature([Payment, Contract]),
    forwardRef(() => PaymentModule),
  ],
  controllers: [],
  providers: [PaystackPaymentService],
  exports: [PaystackPaymentService],
})
export class PaystackPaymentModule {}
