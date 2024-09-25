import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { VendorService } from 'src/modules/vendor/vendor.service';
import { MyVendorService } from '../my-vendor/my-vendor.service';
import { GetUser } from 'src/modules/auth/user.decorator';
import { User } from 'src/modules/user/models/user.model';
import { VendorStatus } from '../vendor/models/vendor.model';
import { SponsorGuard } from '../auth/guards/fundManager.guard';
import { FundManagerService } from './fundManager.service';
import { PlatformInvitation } from '../invitation/dto/platformInvitation.dto';
import { UseSubscription } from '../platfrom-subscription/platform-subscription.decorator';

@Controller('fundManager')
@ApiTags('fundManager')
@ApiBearerAuth()
  @UseGuards(SponsorGuard)
  @UseSubscription()
export class SponsorVendorController {
  constructor(
    private readonly vendorService: VendorService,
    private readonly fundManagerService: FundManagerService,
  ) {}

  @ApiOperation({
    summary: 'Retrieve all vendors',
  })
  @Get('vendor')
  async fetchVendors() {
    return await this.vendorService.fetchVendors(VendorStatus.APPROVED);
  }
  @ApiOperation({
    summary: 'invite vendor to platform',
  })
  @Post('vendor/invite')
  async invitevendor(
    @GetUser() user: User,
    @Body(ValidationPipe) data: PlatformInvitation,
  ) {
    return await this.fundManagerService.platformInvitation({ user, data });
  }

  @ApiOperation({
    summary: 'Retrieve vendor details',
  })
  @Get('vendor/:id')
  async getVendorById(@Param('id') id: string) {
    return await this.vendorService.getVendorById(id);
  }

  @ApiOperation({
    summary: 'Retrieve vendors by category',
  })
  @Get('vendor/:rfqCategoryId/all-vendor')
  async fetchVendorsForCategory(@Param('rfqCategoryId') rfqCategoryId: string) {
    return await this.vendorService.fetchVendorsForCategory(rfqCategoryId);
  }
}
