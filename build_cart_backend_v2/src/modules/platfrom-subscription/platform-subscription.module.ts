import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PlatformSubscriptionService } from './platform-subacription.service';
import { Subscription } from './model/subscription.model';
import { SubscriptionController } from './platform-subscription.controller';

@Module({
  imports: [SequelizeModule.forFeature([Subscription])],
  controllers: [SubscriptionController],
  providers: [PlatformSubscriptionService],
  exports:[PlatformSubscriptionService]
})
export class PlatformSubscriptionModule {}
