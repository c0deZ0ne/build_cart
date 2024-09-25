import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';
import { Subscription } from 'src/modules/platfrom-subscription/model/subscription.model';
import { PlatformSubscriptionService } from 'src/modules/platfrom-subscription/platform-subacription.service';
import { User } from 'src/modules/user/models/user.model';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class SubscriptionInterceptor implements NestInterceptor {
  constructor(
    private readonly subscriptionService: PlatformSubscriptionService,
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const userId = request?.user?.id || request?.body.UserId;

    const user = await this.userModel.findOne({
      where: { id: userId },
      paranoid: false,
    });
    //console.log(userId, 'Checking id');
    if (!user) {
      throw new NotFoundException(`user with id {userId} not found`);
    }
    const subscription: Subscription =
      await this.subscriptionService.checkAndUpdateSubscription(userId);
    if (
      subscription &&
      moment(subscription.expirationDate).isBefore(moment())
    ) {
      throw new ForbiddenException('Subscription has expired');
    }

    return next.handle().pipe(
      map((data) => {
        return data;
      }),
    );
  }
}
