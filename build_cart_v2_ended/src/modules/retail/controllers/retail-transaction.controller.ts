import {
  Body,
  Controller,
  Get,
  Post,
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
import { BuilderGuard } from 'src/modules/auth/guards/builder.guard';
import { GetUser } from 'src/modules/auth/user.decorator';
import { User } from 'src/modules/user/models/user.model';
import { CreateRetailTransactionDto } from '../dto/create-retail-transaction.dto';
import { RetailService } from '../retail.service';
import { GetTransactionsDto } from '../dto/get-retail-transaction.dto';

@Controller('retail/transaction')
@ApiTags('retail-transaction')
@ApiBearerAuth()
@UseGuards(BuilderGuard)
export class RetailTransactionController {
  constructor(private readonly retailService: RetailService) {}

  @ApiOperation({
    summary: 'Create a new retail transaction',
  })
  @Post('')
  async createTransaction(
    @Body(ValidationPipe) body: CreateRetailTransactionDto,
  ) {
    return await this.retailService.createTransaction(body);
  }

  @ApiOperation({
    summary: 'Gets all builders transactions',
  })
  @ApiQuery({
    name: 'status',
    type: String,
    required: false,
    enum: ['PENDING', 'COMPLETE', 'FAILED'],
    example: 'PENDING',
  })
  @Get('')
  async getTransactions(
    @GetUser() user: User,
    @Query() query: GetTransactionsDto,
  ) {
    return this.retailService.getAllTransactions(user.BuilderId, query.status);
  }
}
