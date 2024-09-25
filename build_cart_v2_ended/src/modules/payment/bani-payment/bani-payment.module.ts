import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BaniPaymentService } from './bani-payment.service';
import { Payment } from '../models/payment.model';
import { ContractModule } from 'src/modules/contract/contract.module';
import { VendorModule } from 'src/modules/vendor/vendor.module';
import { MyPaymentModule } from 'src/modules/my-payment/my-payment.module';
import { ConfigModule } from '@nestjs/config';
import { PaymentModule } from '../payment.module';
import { PaymentService } from '../payment.service';
import { Contract } from 'src/modules/contract/models';

@Module({
  imports: [
    SequelizeModule.forFeature([Payment, Contract]),
    forwardRef(() => ContractModule),
    forwardRef(() => VendorModule),
    ConfigModule,
    forwardRef(() => PaymentModule),

    MyPaymentModule,
  ],
  controllers: [],
  providers: [BaniPaymentService, PaymentService],
  exports: [BaniPaymentService, PaymentService],
})
export class BaniPaymentModule {}
