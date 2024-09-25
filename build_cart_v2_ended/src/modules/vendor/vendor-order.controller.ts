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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { VendorGuard } from 'src/modules/auth/guards/vendor.guard';
import { GetUser } from 'src/modules/auth/user.decorator';
import { User } from 'src/modules/user/models/user.model';
import { VendorOrderService } from './vendor-order.services';
import { CreateDisputeDto } from '../builder/dto/create-dispute.dto';
import { RateReviewBuilderDto } from '../builder/dto/rate-review-vendor.dto';
import { DeliveryConfirmationDto } from '../email/dto/deliveryConfirmation.dto';

@Controller('vendor')
@ApiTags('vendor')
@ApiBearerAuth()
@UseGuards(VendorGuard)
export class VendorOrderController {
  constructor(private readonly vendorOrderService: VendorOrderService) {}

  @ApiOperation({
    summary: 'Retrieve contracts',
  })
  @Get('/contract')
  async getContracts(@GetUser() user: User) {
    return await this.vendorOrderService.getVendorOrders(user.VendorId);
  }
  @ApiOperation({
    summary: 'bidboard ongoing transaction',
  })
  @Get('/bidboard/ongoing-transaction')
  async ongoingTransaction(@GetUser() user: User) {
    return await this.vendorOrderService.ongoingOrders(user.VendorId);
  }

  @ApiOperation({
    summary: 'Retrieve completed orders',
  })
  @Get('/bidboard/completed-orders')
  async completedTransaction(@GetUser() user: User) {
    return await this.vendorOrderService.completedOrders(user.VendorId);
  }

  @ApiOperation({
    summary: 'Confirms order delivery',
  })
  @Post('/contract/:contractId/comfirm-delivery/:deliveryScheduleId')
  async confirmOrderDelivery(
    @Body(ValidationPipe) body: DeliveryConfirmationDto,
    @Param('contractId') id: string,
    @Param('deliveryScheduleId') deliveryScheduleId: string,
    @GetUser() user: User,
  ) {
    return await this.vendorOrderService.vendorDeliveryConfirmation(
      body,
      id,
      deliveryScheduleId,
      user,
    );
  }

  @ApiOperation({
    summary: 'Retrieves all purchase orders',
  })
  @Get('/bidboard/purchase-orders')
  async purchaseOrders(@GetUser() user: User) {
    return await this.vendorOrderService.getAllPurchaseOrders(user.VendorId);
  }

  @ApiOperation({
    summary: 'Retrieves all unfulfilled orders',
  })
  @Get('/bidboard/unfulfilled-orders')
  async unFulfilledOrders(@GetUser() user: User) {
    return await this.vendorOrderService.getAllUnfulfilledOrders(user.VendorId);
  }

  @ApiOperation({
    summary: 'Retrieves all completed orders',
  })
  @Get('/bidboard/completed-orders')
  async completedOrders(@GetUser() user: User) {
    return await this.vendorOrderService.completedOrders(user.VendorId);
  }

  @ApiOperation({
    summary: 'Retrieves all active orders',
  })
  @Get('/bidboard/active-orders')
  async activeOrders(@GetUser() user: User) {
    return await this.vendorOrderService.getActiveOrders(user.VendorId);
  }

  @ApiOperation({
    summary: 'Retrieves all disputed orders',
  })
  @Get('/bidboard/disputed-orders')
  async disputedOrders(@GetUser() user: User) {
    return await this.vendorOrderService.getDisputedOrders(user);
  }

  @ApiOperation({
    summary: 'opens a  dispute on order',
  })
  @Post('/bidboard/:contractId/open-dispute')
  async openDisputedOnOrder(
    @GetUser() user: User,
    @Body(ValidationPipe) body: CreateDisputeDto,
    @Param('contractId') id: string,
  ) {
    return await this.vendorOrderService.createDispute(body, id, user);
  }

  @ApiOperation({
    summary: 'vendor rates a order',
  })
  @Post('/bidboard/:contractId/rate-order')
  async rateOrder(
    @GetUser() user: User,
    @Body(ValidationPipe) body: RateReviewBuilderDto,
    @Param('contractId') id: string,
  ) {
    return await this.vendorOrderService.rateAndReviewBuilder(body, user, id);
  }
}
