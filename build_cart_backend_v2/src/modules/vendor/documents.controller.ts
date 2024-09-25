import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { VendorGuard } from 'src/modules/auth/guards/vendor.guard';
import { GetUser } from 'src/modules/auth/user.decorator';
import { User } from 'src/modules/user/models/user.model';
import { VendorService } from './vendor.service';

@Controller('vendor')
@ApiTags('vendor')
@ApiBearerAuth()
@UseGuards(VendorGuard)
export class KycConfirmationsController {
  constructor(private readonly vendorService: VendorService) {}

  @ApiOperation({
    summary: 'Retrieve KYC confirmations',
  })
  @Get('/confirmations')
  async getDocumentConfirmed(@GetUser() user: User) {
    return await this.vendorService.kycStatus(user.VendorId);
  }
}
