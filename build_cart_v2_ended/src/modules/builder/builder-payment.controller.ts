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
import { PaymentProvider } from '../payment/models/payment.model';
import { CutstructPayDto } from '../payment/cutstuct-payment/dto/cutstruct-create-payment.dto';
import { CutstructPayService } from '../payment/cutstuct-payment/custruct-payment.service';
import { PaymentService } from '../payment/payment.service';
import { BaniVerifyPaymentDto } from '../payment/bani-payment/dto/bani-verify-payment.dto';
import { PaystackVerifyPaymentDto } from '../payment/paystack-payment/dto/paystack-contractPay-dto';
import { ProjectWalletService } from '../project-wallet/project-wallet.service';
import { PayforContratcwithWalletDto } from '../project-wallet/dto/contract-wallet-pay.dto';
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

  @Get('/:provider/paytoken/:contractId')
  async getPayToken(
    @GetUser() user: User,
    @Param('contractId') contractId: string,
    @Param('provider') provider: PaymentProvider,
  ) {
    await this.contractService.getContractById(contractId);

    return await this.paymentService.getContractPayToken({
      user: user,
      contractId,
      provider,
    });
  }

  @ApiOperation({
    summary: 'confrim payment by bani',
  })
  @Post('/bani/payment-confirm')
  async confirmPayment(
    @Body(ValidationPipe) data: BaniVerifyPaymentDto,
    @GetUser() user: User,
  ) {
    await this.builderService.PayContractWithBaniReference({ data, user });
  }

  @ApiOperation({
    summary: 'pay with paystack payment',
  })
  @Post('/paystack/pay')
  async PayPaystack(
    @Body() data: RemitterVerifyPaymentRefDto,
    @GetUser() user: User,
  ) {
    const pay_ref = data.pay_ref;
    if (data.paymentType == PaymentType.ACCOUNT_WALLET_TOP_UP) {
      return await this.builderService.paystackWalletTopUp({ user, pay_ref });
    } else if (data.paymentType == PaymentType.ORDER_PAYMENT) {
      throw new BadRequestException('process not allowed please contact admin');
    } else {
      throw new BadRequestException('process not allowed please contact admin');
    }
  }

  @ApiOperation({
    summary: 'pay with remitter payment',
  })
  @Post('/remita/pay')
  async PayContractWithRemittanceReference(
    @Body() data: RemitterVerifyPaymentRefDto,
    @GetUser() user: User,
  ) {
    const pay_ref = data.pay_ref;
    if (data.paymentType == PaymentType.ACCOUNT_WALLET_TOP_UP) {
      return await this.builderService.remitaWalletTopUp({ user, pay_ref });
    } else if (data.paymentType == PaymentType.ORDER_PAYMENT) {
      return await this.builderService.payOrderWithRemita({
        user,
        pay_ref,
        orderId: data.orderId,
        description: 'pay order',
      });
    } else {
      throw new BadRequestException('process not allowed please contact admin');
    }
  }

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

  @ApiOperation({
    summary: 'confirm paystack payment',
  })
  @Post('/paystack/:reference')
  async PayforContractWithPaystackReference(
    @Body() data: PaystackVerifyPaymentDto,
    @Query('reference') pay_ref: string,
    @GetUser() user: User,
  ) {
    await this.builderService.PayforContractWithPaystackReference({
      data,
      user,
    });
  }
}
