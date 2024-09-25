import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { SponsorGuard } from 'src/modules/auth/guards/fundManager.guard';
import { GetUser } from 'src/modules/auth/user.decorator';
import { User } from 'src/modules/user/models/user.model';
import { UserTransactionService } from '../user-wallet-transaction/user-transaction.service';
import { UseSubscription } from '../platfrom-subscription/platform-subscription.decorator';

@Controller('fundManager')
@ApiTags('fundManager')
@ApiBearerAuth()
  @UseGuards(SponsorGuard)
  @UseSubscription()

export class SponsorTransactionController {
  constructor(
    private readonly userTransactionService: UserTransactionService,
  ) {}

  @ApiOperation({
    summary: 'get account transactions history',
  })
  @ApiQuery({
    name: 'page_size',
    type: Number,
    required: false,
    example: 10,
  })
  @ApiQuery({
    name: 'transaction_type',
    type: String,
    required: true,
    example: 'inflow',
    examples: {
      INFLOW: { summary: 'Paused status example', value: 'inflow' },
      OUTFLOW: { summary: 'Active status example', value: 'outflow' },
    },
  })
  @ApiQuery({
    name: 'start_date',
    type: Date,
    required: false,
    example: '2023-01-01T00:00:00.000Z',
  })
  @ApiQuery({
    name: 'end_date',
    type: Date,
    required: false,
    example: '2023-01-01T00:00:00.000Z',
  })
  @ApiQuery({
    name: 'search_param',
    type: String,
    required: false,
    example: '10000',
  })
  @Get('transaction/history')
  async createProject(
    @GetUser() user: User,
    @Query('transaction_type') transaction_type: string,
    @Query('start_date') start_date: Date,
    @Query('end_date') end_date: Date,
    @Query('search_param') search_param: string,
  ) {
    return await this.userTransactionService.getUserTransactions(
      user.walletId,
      transaction_type,
      { start_date, end_date },
      search_param,
    );
  }
}
