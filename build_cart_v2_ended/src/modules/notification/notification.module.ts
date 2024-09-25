import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { Notification } from './models/notification.model';
@Module({
  imports: [SequelizeModule.forFeature([Notification])],
  providers: [NotificationService],
  controllers: [NotificationController],
  exports: [NotificationService],
})
export class NotificationModule {}
