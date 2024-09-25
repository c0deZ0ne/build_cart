import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { MyFundManager } from './models/myFundManager.model';
import { MyFundManagerService } from './my-fundManager.service';

@Module({
  imports: [SequelizeModule.forFeature([MyFundManager])],
  providers: [MyFundManagerService],
  exports: [MyFundManagerService],
})
export class MyFundManagerModule {}
