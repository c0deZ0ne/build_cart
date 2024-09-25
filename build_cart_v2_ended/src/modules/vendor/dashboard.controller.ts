import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { VendorGuard } from 'src/modules/auth/guards/vendor.guard';
import { GetUser } from 'src/modules/auth/user.decorator';
import { User } from 'src/modules/user/models/user.model';
import { VendorOrderService } from './vendor-order.services';

@Controller('vendor')
@ApiTags('vendor')
@ApiBearerAuth()
@UseGuards(VendorGuard)
export class DashboardController {
  constructor(private readonly vendorOrderService: VendorOrderService) {}

  @ApiOperation({
    summary: 'get dashboard summary',
  })
  @Get('dashboard-summary')
  async getDashboardSummary(@GetUser() user: User) {
    return await this.vendorOrderService.getDashboardSummary(user);
  }

  @ApiOperation({
    summary: 'get vendor earnings and withdrawals',
  })
  @ApiQuery({
    name: 'number_of_previous_days',
    type: Number,
    required: false,
    example: '7',
  })
  @Get('dashboard-summary/earnings')
  async getVendorEarnings(
    @GetUser() user: User,
    @Query('number_of_previous_days') search_param,
  ) {
    return await this.vendorOrderService.getVendorEarnings(user, search_param);
  }
}
