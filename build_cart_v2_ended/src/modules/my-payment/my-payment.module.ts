import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { MyPayment } from './models/myPayments.model';
import { Contract } from '../contract/models';
import { ContractModule } from '../contract/contract.module';
import { MyPaymentService } from './my-payment.service';

@Module({
  imports: [SequelizeModule.forFeature([MyPayment, Contract]), ContractModule],
  controllers: [],
  providers: [MyPaymentService],
  exports: [MyPaymentService],
})
export class MyPaymentModule {}
