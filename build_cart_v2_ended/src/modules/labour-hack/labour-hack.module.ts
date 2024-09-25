import { Module } from '@nestjs/common';
import { LabourHackService } from './labour-hack.service';
import { LabourHackController } from './labour-hack.controller';
import { LabourHack } from './models/labour-hack.model';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [SequelizeModule.forFeature([LabourHack])],
  providers: [LabourHackService],
  controllers: [LabourHackController],
  exports: [LabourHackService],
})
export class LabourHackModule {}
