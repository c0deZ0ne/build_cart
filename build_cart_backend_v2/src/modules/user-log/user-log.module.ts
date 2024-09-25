import { Module } from '@nestjs/common';
import { UserLogController } from './user-log.controller';
import { UserLogService } from './user-log.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserLog } from './models/user-log.model';
import { User } from '../user/models/user.model';

@Module({
  imports: [SequelizeModule.forFeature([UserLog,User])],
  controllers: [UserLogController],
  providers: [UserLogService],
  exports:[UserLogService]
})
export class UserLogModule {}
