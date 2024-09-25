import {
  BadRequestException,
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
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { OrderService } from '../order/order.services';
import { GroupedOrdersByVendorDto } from '../order/dto/order.dto';
import { SponsorGuard } from '../auth/guards/fundManager.guard';
import { randomUUID } from 'crypto';
import { GetUser } from '../auth/user.decorator';
import { User } from '../user/models/user.model';
import { SponsorWalletService } from './fundManager-wallet.services';
import { SponsorOrderServices } from './fundManager-order.services';
import { FundManagerOrderType, FundOrderType } from './types';
import { FundOrderDto } from '../builder/dto';
import { PaymentType, RemitterVerifyPaymentRefDto } from '../payment/remiter-payment/dto/remiter-contractPay-dto';
import { FundManagerService } from './fundManager.service';
import { UseSubscription } from '../platfrom-subscription/platform-subscription.decorator';

@Controller('fundManager')
@ApiTags('fundManager')
@ApiBearerAuth()
@UseGuards(SponsorGuard)
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly fundManagerOrderServices: SponsorOrderServices,
    private readonly fundManagerWalletService: SponsorWalletService,
    private readonly fundManagerService: FundManagerService,
  ) {}

  @ApiOperation({
    summary: `get all pending orders and grouped according to vendors`,
    description: 'this Api create an orde in the orders table',
  })
  @ApiParam({
    name: 'projectId',
    description: 'ID of the project',
    example: randomUUID(),
  })
  @ApiOkResponse({
    description: 'Get grouped orders by vendor and status pending',
  })
  @UseSubscription()
  @Get('orders/:projectId/pending-orders')
  async getGroupedOrdersByVendorAndStatusPending(
    @Param('projectId') projectId: string,
    @GetUser() user: User,
  ): Promise<FundManagerOrderType[]> {
    return this.fundManagerOrderServices.groupedPendingOrders({
      user,
      projectId,
    });
  }

  @ApiOperation({
    summary: `get all paid orders and grouped according to vendors`,
    description: 'this Api get Paid order in the orders table',
  })
  @ApiParam({
    name: 'projectId',
    description: 'ID of the project',
    example: randomUUID(),
  })
  @ApiOkResponse({
    description: 'Get grouped orders by vendor and status pending',
    type: [GroupedOrdersByVendorDto],
  })
  @UseSubscription()
  @Get('orders/:projectId/paid-orders')
  async getGroupedOrdersByVendorAndStatusPaid(
    @Param('projectId') projectId: string,
    @GetUser() user: User,
  ): Promise<unknown> {
    return this.fundManagerOrderServices.groupedPaidOrders({ user, projectId });
  }
  @UseSubscription()
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
    return await this.fundManagerWalletService.SponsorPayOrderWithWalletFund(
      orderId,
      user,
      body.amount,
      type,
    );
  }
  @UseSubscription()
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

  
}
