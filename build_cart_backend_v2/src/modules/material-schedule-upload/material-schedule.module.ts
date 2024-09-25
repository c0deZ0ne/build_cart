import { Module } from '@nestjs/common';
import { MaterialService } from './material.service';
import { MaterialController } from './material-schedule.controller';
import { MulterModule } from '@nestjs/platform-express';
import { SequelizeModule } from '@nestjs/sequelize';
import { MaterialSchedule } from './models/material-schedule.model';
import { UserUploadMaterial } from './models/material.model';
import { Project } from '../project/models/project.model';

@Module({
  imports: [
    SequelizeModule.forFeature([MaterialSchedule, UserUploadMaterial,Project]),
    MulterModule,
  ],
  controllers: [MaterialController],
  providers: [MaterialService],
})
export class MaterialScheduleModule {}
