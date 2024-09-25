import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AdminGuard } from 'src/modules/auth/guards/admin.guard';
import { RfqService } from 'src/modules/rfq/rfq.service';
import { RfqQuoteService } from 'src/modules/rfq/rfq-quote.service';
import { GetUser } from '../auth/user.decorator';
import { User } from '../user/models/user.model';

@Controller('admin')
@ApiTags('admin')
@UseGuards(AdminGuard)
@ApiBearerAuth()
export class RfqController {
  constructor(
    private readonly rfqService: RfqService,
    private readonly rfqQuoteService: RfqQuoteService,
  ) {}

  @ApiOperation({
    summary: 'Get all RFQs',
  })
  @Get('rfq')
  async getAllRfq() {
    return this.rfqService.getAllRfq();
  }

  @ApiOperation({
    summary: 'Get RFQ details',
  })
  @Get('/rfq/:id')
  async getRequestDetails(@Param('id') rfqRequestId: string) {
    return await this.rfqService.getRequestDetails(rfqRequestId);
  }

  @ApiOperation({
    summary: 'Retrieve bids for RFQ',
  })
  @Get('/rfq/:id/bid')
  async getBidsForRequest(@Param('id') rfqRequestId: string) {
    return await this.rfqService.getBidsForRequest({ rfqRequestId });
  }

  @ApiOperation({
    summary: 'Get Bid details',
  })
  @Get('bid/:id')
  async getRfqQuoteByIdForUser(
    @GetUser() user: User,
    @Param('id') rfqQuoteId: string,
  ) {
    return await this.rfqQuoteService.getRfqQuoteByIdForUser(rfqQuoteId, user);
  }
}
