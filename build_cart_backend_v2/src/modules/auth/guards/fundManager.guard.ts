import { ExecutionContext, Injectable } from '@nestjs/common';
import { UserType } from 'src/modules/user/models/user.model';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UserPayLoad } from '../types';

@Injectable()
export class SponsorGuard extends JwtAuthGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isActivated = await super.canActivate(context);

    if (!isActivated) {
      return false;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as UserPayLoad;

    return user.userType === UserType.FUND_MANAGER;
  }
}
