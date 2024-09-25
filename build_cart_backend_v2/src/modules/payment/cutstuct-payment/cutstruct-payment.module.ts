import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CutstructPayService } from './custruct-payment.service';
import { Payment } from '../models/payment.model';
import { ContractModule } from 'src/modules/contract/contract.module';
import { VendorModule } from 'src/modules/vendor/vendor.module';
import { MyPaymentModule } from 'src/modules/my-payment/my-payment.module';
import { ConfigModule } from '@nestjs/config';
import { Contract } from 'src/modules/contract/models';

@Module({
  imports: [
    SequelizeModule.forFeature([Payment, Contract]),
    ContractModule,
    forwardRef(() => VendorModule),
    ConfigModule,
    MyPaymentModule,
  ],
  controllers: [],
  providers: [CutstructPayService],
  exports: [CutstructPayService],
})
export class CutstructPayModule {}
