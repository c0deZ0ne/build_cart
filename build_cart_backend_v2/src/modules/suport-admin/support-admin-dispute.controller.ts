import {
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/modules/auth/user.decorator';
import { User } from 'src/modules/user/models/user.model';
import { SupportAdminDisputeService } from './support-admin-dispute.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorators';
import { UserRoles } from '../rbac/models/role.model';

@Controller('support-admin-dispute')
@ApiTags('support-admin-dispute')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class SupportAdminDisputeController {
  constructor(private readonly disputeService: SupportAdminDisputeService) {}

  @ApiOperation({
    summary: 'Retrieve all disputes',
  })
  @Get('/disputes')
  async getAllDisputes(@Query('type') type: string) {
    return await this.disputeService.getDisputes(type);
  }

  @ApiOperation({
    summary: 'Retrieve vendor business info',
  })
  @Get('/vendor/:vendorId/info')
  async getVendorBusinessInfo(@Param('vendorId') vendorId: string) {
    return await this.disputeService.getVendorBusinessInfo(vendorId);
  }

  @ApiOperation({
    summary: 'Retrieve builder business info',
  })
  @Get('/builder/:builderId/info')
  async getBuilderBusinessInfo(@Param('builderId') builderId: string) {
    return await this.disputeService.getBuilderBusinessInfo(builderId);
  }

  @ApiOperation({
    summary: 'Retrieve disputes by Id',
  })
  @Get('/dispute/:id')
  @Roles(UserRoles.SUPER_ADMIN)
  async getDisputeById(@Param('id') disputeId: string) {
    return await this.disputeService.getDisputeById(disputeId);
  }

  @ApiOperation({
    summary: 'Resolve Dispute mark as completed',
  })
  @Patch('/dispute/:id/resolve')
  @Roles(UserRoles.SUPER_ADMIN)
  async resolveDispute(@Param('id') disputeId: string, @GetUser() user: User) {
    return await this.disputeService.resolveDispute(disputeId, user);
  }

  @ApiOperation({
    summary: 'cancel order and Refund Dispute',
  })
  @Patch('/dispute/:id/refund')
  @Roles(UserRoles.SUPER_ADMIN)
  async refund(@Param('id') disputeId: string, @GetUser() user: User) {
    await this.disputeService.refund(disputeId, user);
  }
}
