import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from 'src/modules/auth/guards/admin.guard';
import { DisputeService } from '../dispute/dispute.service';

@Controller('admin')
@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(AdminGuard)
export class TransactionController {
  constructor(private readonly disputeService: DisputeService) {}

  @ApiOperation({
    summary: 'Retrieve all refunds',
  })
  @Get('/transaction/refunds')
  async getAllRefunds() {
    return await this.disputeService.getRefunds();
  }
}
