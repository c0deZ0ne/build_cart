import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUser } from '../auth/user.decorator';
import { User } from '../user/models/user.model';
import { ContractService } from '../contract/contract.service';
import { CutstructPayDto } from '../payment/cutstuct-payment/dto/cutstruct-create-payment.dto';
import { CutstructPayService } from '../payment/cutstuct-payment/custruct-payment.service';
import { PaymentService } from '../payment/payment.service';
import { PaystackVerifyPaymentDto } from '../payment/paystack-payment/dto/paystack-contractPay-dto';
import { ProjectWalletService } from '../project-wallet/project-wallet.service';
import { BuilderService } from './builder.service';
import { BuilderGuard } from '../auth/guards/builder.guard';
import {
  PaymentType,
  RemitterVerifyPaymentRefDto,
} from '../payment/remiter-payment/dto/remiter-contractPay-dto';

@Controller('builder')
@ApiTags('builder')
@ApiBearerAuth()
@UseGuards(BuilderGuard)
export class BuilderPaymentController {
  constructor(
    private builderService: BuilderService,
    private paymentService: PaymentService,
    private contractService: ContractService,
    private cutstructPayService: CutstructPayService,
    private projectWalletService: ProjectWalletService,
  ) {}
 
 
  @Post('/wallet/:contractId')
  @ApiOperation({
    summary: 'Pay for rfq  from project wallet',
  })
  async paywithSponsorWallet(
    @GetUser() user: User,
    @Param('contractId') contractId: string,
  ) {
    await this.projectWalletService.payforRfqContractByBuilderWithSponsorFundsOnWallet(
      contractId,
      user,
    );
  }

  @ApiOperation({
    summary: 'request for approve payment for cutstruct payment',
  })
  @Post('/cutstruct/payment-request')
  async CutstructConfirmPaymentRquest(
    @Body(ValidationPipe) data: CutstructPayDto,
    @GetUser() user: User,
  ) {
    return await this.cutstructPayService.createPayment({ data, user });
  }

  
}
