import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { RemitterPaymentService } from './remitter-payment.service';
import { Payment } from '../models/payment.model';
import { PaymentModule } from '../payment.module';
import { Contract } from 'src/modules/contract/models';
import { Order } from 'src/modules/order/models';
import { EmailModule } from 'src/modules/email/email.module';
import { ContractModule } from 'src/modules/contract/contract.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Payment, Contract, Order]),
    forwardRef(() => PaymentModule),
    forwardRef(() => ContractModule),
    EmailModule,

  ],
  controllers: [],
  providers: [RemitterPaymentService],
  exports: [RemitterPaymentService],
})
export class RemitterPaymentModule {}
