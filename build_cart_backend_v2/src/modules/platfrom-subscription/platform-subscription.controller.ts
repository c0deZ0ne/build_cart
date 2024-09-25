
import { Controller, Post, Get, Param, Put, Delete, Body, ValidationPipe, BadRequestException } from '@nestjs/common';
import { CreateSubscriptionDto, PremiumSubscription, UpdateSubscriptionDto } from './dto';
import { PlatformSubscriptionService } from './platform-subacription.service';
import { Subscription } from './model/subscription.model';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { SubscriptionType } from './types';
import { Sequelize } from 'sequelize-typescript';

@ApiTags('platform-subscriptions')
@Controller('subscriptions')
export class SubscriptionController {
  constructor(
    private readonly PlatformSubscriptionService: PlatformSubscriptionService,
    private readonly sequelize: Sequelize
  ) { }

  @Post("/subscribe-free")
  @ApiOperation({ summary: 'Subscribe to free plan subscription' })
  @ApiResponse({ status: 201, description: 'The subscription has been successfully created.', type: Subscription })
  async subscribeToFreePlan(@Body(ValidationPipe) createSubscriptionDto: CreateSubscriptionDto): Promise<Subscription> {
      const dbTransaction = await this.sequelize.transaction()
    try {
      const res = await this.PlatformSubscriptionService.createSubscription({ ...createSubscriptionDto, type: SubscriptionType.FREE, dbTransaction });
      await dbTransaction.commit()
      return res
    } catch (error) {
      await dbTransaction.rollback()
      throw new BadRequestException(error.message)
    }
  }

  @Post("/subscribe-premium")
  @ApiOperation({ summary: 'upgrade to premium plan ' })
  @ApiResponse({ status: 201, description: 'The subscription has been successfully created.', type: Subscription })
  async subscribeToPremium (@Body(ValidationPipe) createSubscriptionDto: PremiumSubscription): Promise<Subscription> {
      const dbTransaction = await this.sequelize.transaction()
    try {
      const res = await this.PlatformSubscriptionService.createSubscription({ ...createSubscriptionDto, type: SubscriptionType.PREMIUM,dbTransaction });
      await dbTransaction.commit()
      return res
    } catch (error) {
      await dbTransaction.rollback()
      throw new BadRequestException(error.message)
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get subscription by ID' })
  @ApiParam({ name: 'id', description: 'Subscription ID' })
  @ApiResponse({ status: 200, description: 'Returns the subscription.', type: Subscription })
  async getSubscriptionById(@Param('id') id: string): Promise<Subscription> {
    return this.PlatformSubscriptionService.getSubscriptionById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update subscription by ID' })
  @ApiParam({ name: 'id', description: 'Subscription ID' })
  @ApiResponse({ status: 200, description: 'Returns the updated subscription.', type: Subscription })
  async updateSubscription(@Param('id') id: string, @Body() updateSubscriptionDto: UpdateSubscriptionDto): Promise<Subscription> {
    return this.PlatformSubscriptionService.updateSubscription(id, updateSubscriptionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete subscription by ID' })
  @ApiParam({ name: 'id', description: 'Subscription ID' })
  @ApiResponse({ status: 204, description: 'The subscription has been successfully deleted.' })
  async deleteSubscription(@Param('id') id: string): Promise<void> {
    return this.PlatformSubscriptionService.deleteSubscription(id);
  }
}
