import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { OrderService } from '../order/order.services';
import { GetUser } from '../auth/user.decorator';
import { User } from '../user/models/user.model';

import { BuilderGuard } from '../auth/guards/builder.guard';
import { BuilderOrderServices } from './builder-order.services';
import { BuilderWalletService } from './builder-wallet.service';
import { BuilderRfqOrderDto } from './dto/rfq-order.response.dto';
import { RateReviewVendorDto } from './dto/rate-review-vendor.dto';
import { ConfirmDeliveryDto } from '../vendor/dto/confirm-deliveryotp.dto';
import { CreateDisputeDto } from './dto/create-dispute.dto';
import { FundOrderDto } from './dto';
import { FundOrderType } from '../fund-manager/types';

@Controller('builder')
@ApiTags('builder')
@ApiBearerAuth()
@UseGuards(BuilderGuard)
export class BuilderOrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly buyerWalletService: BuilderWalletService,
    private readonly builderOrderServices: BuilderOrderServices,
  ) {}

  @ApiOkResponse({
    description: 'Sample response on success',
    type: BuilderRfqOrderDto,
  })
  @ApiOperation({
    summary: 'get orders for rfq request',
  })
  @Get('order/:rfqRequestId')
  async getOrder(
    @GetUser() user: User,
    @Param('rfqRequestId') rfqRequestId: string,
  ) {
    return await this.builderOrderServices.getBuilderOrdersForRfQ({
      rfqRequestId,
      user,
    });
  }

  @ApiOperation({
    summary: 'get all builder orders',
  })
  @Get('orders')
  async getAllOrders(@GetUser() user: User) {
    return await this.builderOrderServices.allBuilderOrders(user.BuilderId);
  }

  @ApiOperation({
    summary: 'get order Dashboard for ongoing and completed orders',
  })
  @Get('orders/dashboard')
  async getOrdersDashboard(@GetUser() user: User) {
    return await this.builderOrderServices.getOrdersDashboard(user);
  }

  @ApiOperation({
    summary: 'fund order from project wallet or vault',
  })
  @Patch('order/:orderId/pay')
  async payWithWalletFund(
    @GetUser() user: User,
    @Param('orderId') orderId: string,
    @Query('type') type: FundOrderType,
    @Body(ValidationPipe) body: FundOrderDto,
  ) {
    return await this.buyerWalletService.buyerPayOrderWithWalletFund(
      orderId,
      user,
      body.amount,
      type,
    );
  }

  @ApiOperation({
    summary: 'generate OTP to confirming delivery ',
  })
  @Get('order/:orderId/otp')
  async generateOrderOtp(
    @GetUser() user: User,
    @Param('orderId') orderId: string,
  ) {
    return await this.orderService.generateOrderOtp({
      orderId,
      user,
    });
  }

  @ApiOperation({
    summary: 'confirm delivery with generated otp ',
  })
  @Post('order/confirm-delivery')
  async confirmOrderDelivery(
    @GetUser() user: User,
    @Body(ValidationPipe) body: ConfirmDeliveryDto,
  ) {
    return await this.builderOrderServices.confirmDelivery({
      body,
      user,
    });
  }

  @ApiOperation({
    summary: 'rate and review vendor order ',
  })
  @Post('/order/:contractId/rate-order')
  async rateandReviewVendor(
    @GetUser() user: User,
    @Body(ValidationPipe) body: RateReviewVendorDto,
    @Param('contractId') contractId: string,
  ) {
    return await this.builderOrderServices.rateReviewVendor(
      body,
      user,
      contractId,
    );
  }

  @ApiOperation({
    summary: 'opens a  dispute on order',
  })
  @Post('/:contractId/open-dispute')
  async openDisputedOnOrder(
    @GetUser() user: User,
    @Body(ValidationPipe) body: CreateDisputeDto,
    @Param('contractId') id: string,
  ) {
    return await this.builderOrderServices.createDispute(body, id, user);
  }

  @ApiOperation({
    summary: 'Retrieves all disputed orders',
  })
  @Get('/disputed-orders')
  async disputedOrders(@GetUser() user: User) {
    return await this.builderOrderServices.getDisputedOrders(user);
  }
}
