import { UseInterceptors, applyDecorators } from '@nestjs/common';
import { SubscriptionInterceptor } from 'src/interceptors/subacription.interceptor';
import { PlatformSubscriptionService } from './platform-subacription.service';
import { Subscription } from './model/subscription.model';
import { UserService } from 'src/modules/user/user.service';
import { User } from '../user/models/user.model';

export function UseSubscription() {
  return applyDecorators(
    UseInterceptors(
      new SubscriptionInterceptor(
        new PlatformSubscriptionService(Subscription),
        User,
      ),
    ),
  );
}
