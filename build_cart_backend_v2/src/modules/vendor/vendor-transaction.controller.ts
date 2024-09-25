import {
  Body,
  Controller,
  Get,
  Patch,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { GetUser } from 'src/modules/auth/user.decorator';
import { User } from 'src/modules/user/models/user.model';
import { VendorGuard } from '../auth/guards/vendor.guard';
import { TransactionType } from '../user-wallet-transaction/models/user-transaction.model';
import { UserTransactionService } from '../user-wallet-transaction/user-transaction.service';
import { VendorTransactionType, vendorWalletData } from './types';
import { RequestPayment } from './dto/request-payment.dto';

@Controller('vendor')
@ApiTags('vendor')
@ApiBearerAuth()
@UseGuards(VendorGuard)
export class VendorTransactionController {
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
    example: 'inflow, outflow, all',
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
  async getTransactions(
    @GetUser() user: User,
    @Query('transaction_type') transaction_type: string,
    @Query('start_date') start_date: Date,
    @Query('end_date') end_date: Date,
    @Query('search_param') search_param: string,
  ) {
    const data = await this.userTransactionService.getUserTransactions(
      user.walletId,
      transaction_type,
      { start_date, end_date },
      search_param,
    );
    const transactions: VendorTransactionType[] = [];
    const allUserTransaction = data.reduce((curr, acc) => {
      const data: VendorTransactionType = {
        id: acc.id,
        description: acc.description,
        amount: acc.amount,
        paymentType: acc?.RfqRequest?.paymentTerm || 'Request withdrawal',
        status: acc.status,
        customerName:
          acc?.RfqRequest?.CreatedBy?.businessName ||
          acc.CreatedBy.businessName,
        itemName: acc?.RfqRequest?.RfqRequestMaterials[0]?.name || acc.itemName,
        type:
          acc.type == TransactionType.DEPOSIT ||
          acc.type == TransactionType.TRANSFER ||
          acc.type == TransactionType.REFUND
            ? 'inflow'
            : 'outflow',
        date: acc.createdAt,
      };
      curr.push(data);
      return curr;
    }, transactions);
    return allUserTransaction;
  }

  @ApiOperation({
    summary: 'get account transaction details',
  })
  @Get('transaction/account-details')
  async walletDetails(@GetUser() user: User) {
    const walletData: vendorWalletData = {
      id: user.wallet.id,
      currentBalance: user.wallet.balance,
      escrowIncome: user.wallet.totalCredit,
      withdrawals: user.wallet.ActualSpend,
    };
    return walletData;
  }
  @ApiOperation({
    summary:
      'Please request funds less than or equal to your account balance  account ',
  })
  @Patch('transaction/fund-withdrawal')
  async withdrawFromWallet(
    @GetUser() user: User,
    @Body(ValidationPipe) body: RequestPayment,
  ) {
    await this.userTransactionService.requestWalletPayout({ user, body });
  }
}
