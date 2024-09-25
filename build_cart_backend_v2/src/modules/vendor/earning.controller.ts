import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { EarningService } from 'src/modules/contract/earning.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { VendorGuard } from 'src/modules/auth/guards/vendor.guard';
import { GetUser } from 'src/modules/auth/user.decorator';
import { User } from 'src/modules/user/models/user.model';
import { GetEarningsDto } from './dto';

@Controller('vendor')
@ApiTags('vendor')
@ApiBearerAuth()
@UseGuards(VendorGuard)
export class EarningController {
  constructor(private readonly earningService: EarningService) {}

  @ApiOperation({
    summary: 'Retrieve earnings',
  })
  @Get('/earning')
  async getEarnings(
    @GetUser() user: User,
    @Query() { startDate, endDate }: GetEarningsDto,
  ) {
    return await this.earningService.getVendorEarnings(
      user,
      startDate,
      endDate,
    );
  }
}
