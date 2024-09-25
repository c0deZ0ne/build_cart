import { Module } from '@nestjs/common';
import { EscrowController } from './escrow.controller';
import { EscrowService } from './escrow.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Escrow } from './models/escrow.model';
import { Commission } from './models/commision.model';

@Module({
  imports: [SequelizeModule.forFeature([Escrow, Commission])],
  controllers: [EscrowController],
  providers: [EscrowService],
})
export class EscrowModule {}
