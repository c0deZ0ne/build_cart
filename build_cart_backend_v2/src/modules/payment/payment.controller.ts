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
// import { BaniVerifyPaymentDto } from '../payment/bani-payment/dto/bani-verify-payment.dto';
import { PaystackVerifyPaymentDto } from '../payment/paystack-payment/dto/paystack-contractPay-dto';
import { ProjectWalletService } from '../project-wallet/project-wallet.service';
import { BuilderGuard } from '../auth/guards/builder.guard';
import {
  PaymentType,
  RemitterVerifyPaymentRefDto,
} from '../payment/remiter-payment/dto/remiter-contractPay-dto';
import { BuilderService } from '../builder/builder.service';
import { RemitaPaymentService } from './remiter-payment/remitter-payment.service';
import { PaystackPaymentService } from './paystack-payment/paystack-payment.service';
import { SystemPaymentDto,  vaultPaymentDto } from './dto/paymentDto';
import { VaultPaymentService } from './vault-payment/vault-payment.service';
import { FundOrderType, PaymentMethod, PaymentProvider, ProjectPayment, SystemPaymentPurpose, VaultPayment } from './types';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProjectPaymentDto } from './project-payment/dto/project-contractPay-dto';
import { ProjectPaymentService } from './project-payment/project-payment.service';
import { generateReference } from 'src/util/util';

@Controller('payment')
@ApiTags('payment')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
export class SystemPaymentController {
  constructor(
    private paymentService: PaymentService,
    private readonly vaultPaymentService:VaultPaymentService,
    private readonly projectPaymentService:ProjectPaymentService
  ) {}

 

  @ApiOperation({
    summary: 'pay with paystack payment',
  })
  @Post('/paystack/pay')
  async PayPaystack(
    @Body() data: SystemPaymentDto,
    @GetUser() user: User,
  ) {
    if (data.paymentPurpose == SystemPaymentPurpose.FUND_WALLET) {
      return await this.paymentService.creeatPayment({ user, initialDetails: {...data,paymentProvider:PaymentProvider.PAYSTACK,paymentPurpose:SystemPaymentPurpose.FUND_WALLET,vaultId:user.walletId} })
    }
    else if (data.paymentPurpose == SystemPaymentPurpose.PLATFORM_SUBSCRIPTION) {
      return await this.paymentService.creeatPayment({ user, initialDetails: {...data,paymentProvider:PaymentProvider.PAYSTACK,paymentPurpose:SystemPaymentPurpose.PLATFORM_SUBSCRIPTION,amount:20000000} })
      }
    else if (data.paymentPurpose == SystemPaymentPurpose.FUND_ORDER) {
      return await this.paymentService.creeatPayment({ user, initialDetails: {...data,paymentProvider:PaymentProvider.PAYSTACK,paymentPurpose:SystemPaymentPurpose.FUND_ORDER} })
    } 
    else if (data.paymentPurpose == SystemPaymentPurpose.FUND_PROJECT_WALLET) {
      return await this.paymentService.creeatPayment({ user, initialDetails: {...data,paymentProvider:PaymentProvider.PAYSTACK,paymentPurpose:SystemPaymentPurpose.FUND_PROJECT_WALLET} })
    } else {
      throw new BadRequestException('process not allowed please contact admin');
    }
  }
  @ApiOperation({
    summary: 'pay with Remita payment',
  })
  @Post('/remita/pay')
  async remitaPay(
    @Body() data: SystemPaymentDto,
    @GetUser() user: User,
  ) {
    if (data.paymentPurpose == SystemPaymentPurpose.FUND_WALLET) {
      return await this.paymentService.creeatPayment({ user, initialDetails: {...data,paymentProvider:PaymentProvider.REMITA,paymentPurpose:SystemPaymentPurpose.FUND_WALLET,vaultId:user.walletId} })
    }
    else if (data.paymentPurpose == SystemPaymentPurpose.PLATFORM_SUBSCRIPTION) {
      return await this.paymentService.creeatPayment({ user, initialDetails: {...data,paymentProvider:PaymentProvider.REMITA,paymentPurpose:SystemPaymentPurpose.PLATFORM_SUBSCRIPTION,amount:20000000} })
      }
    else if (data.paymentPurpose == SystemPaymentPurpose.FUND_ORDER) {
      return await this.paymentService.creeatPayment({ user, initialDetails: {...data,paymentProvider:PaymentProvider.REMITA,paymentPurpose:SystemPaymentPurpose.FUND_ORDER} })
    } 
    else if (data.paymentPurpose == SystemPaymentPurpose.FUND_PROJECT_WALLET) {
      return await this.paymentService.creeatPayment({ user, initialDetails: {...data,paymentProvider:PaymentProvider.REMITA,paymentPurpose:SystemPaymentPurpose.FUND_PROJECT_WALLET} })
    } else {
      throw new BadRequestException('process not allowed please contact admin');
    }
  }


  @ApiOperation({
    summary: 'Pay With Vault Payment',
  })
  @Post('/vault/pay')
  async vaultPayment(
    @Body() data: vaultPaymentDto,
    @GetUser() user: User,
  ) {
    if (data.paymentType == VaultPayment.FUND_PROJECT_WALLET) {
      return await this.vaultPaymentService.fundProjectWallet({
        amount: data.amount,
        paymentPurpose: SystemPaymentPurpose.RFQ_REQUEST,
        ProjectId: data.projectId,
        description: 'Payment for project wallet',
        walletPin: '',
        paymentMethod: PaymentMethod.BANK_TRANSFER
      },user);
    } else if (data.paymentType == VaultPayment.FUND_ORDER) {
      return await this.vaultPaymentService.PayOrderWithWalletFund(
        data.orderId,
        user,
        data.amount,
        FundOrderType.VAULT
      );
    } else if (data.paymentType == VaultPayment.PLATFORM_SUBSCRIPTION) {
      throw new BadRequestException('process not allowed please contact admin');
      }
    else {
      throw new BadRequestException('process not allowed please contact admin');
    }
  }
  @ApiOperation({
    summary: 'fund order with project wallet',
  })
  @Post('/project/pay')
  async ProjectPayment(
    @Body() data: ProjectPaymentDto,
    @GetUser() user: User,
  ) {
    if (data.paymentPurpose == SystemPaymentPurpose.FUND_ORDER) {
       return await this.paymentService.creeatPayment({ user, initialDetails: {
         ...data, paymentProvider: PaymentProvider.CUTSTRUCT_PAY, paymentPurpose: SystemPaymentPurpose.FUND_ORDER,
         reference: generateReference(),
         amount: data.pay_amount_collected
       } })
    } else {
      throw new BadRequestException('process not allowed please contact admin');
    }
  }
}
