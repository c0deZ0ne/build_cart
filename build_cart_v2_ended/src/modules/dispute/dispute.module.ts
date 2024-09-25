import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DisputeService } from './dispute.service';
import { Dispute } from './models/dispute.model';
import { ContractModule } from 'src/modules/contract/contract.module';

@Module({
  imports: [SequelizeModule.forFeature([Dispute]), ContractModule],
  controllers: [],
  providers: [DisputeService],
  exports: [DisputeService],
})
export class DisputeModule {}
