import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorators';
import { UserRoles } from '../rbac/models/role.model';
import { SuperAdminPayoutService } from './super-admin-payout.service';

@Controller('superAdmin')
@ApiTags('superAdmin-payout')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class superAdminPayoutController {
  constructor(
    private readonly superAdminPayoutService: SuperAdminPayoutService,
  ) {}

  @ApiOperation({
    summary: 'fetch Payouts',
  })
  @Get('/payouts')
  @Roles(UserRoles.SUPER_ADMIN)
  async getPayouts() {
    return await this.superAdminPayoutService.getPayouts();
  }
}
