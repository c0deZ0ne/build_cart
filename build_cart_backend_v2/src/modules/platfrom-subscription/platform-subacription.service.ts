import { Injectable, NotFoundException, ConflictException, InternalServerErrorException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ModelCtor } from 'sequelize-typescript';
import { Subscription } from './model/subscription.model';
import { CreateSubscriptionDto, UpdateSubscriptionDto } from './dto';
import * as moment from 'moment';
import { SubscriptionStatus, SubscriptionType } from './types';
import { Transaction } from 'sequelize';
@Injectable()
export class PlatformSubscriptionService {
  constructor(
    @InjectModel(Subscription)
    private readonly subscriptionModel: ModelCtor<Subscription>,
  ) {}

  async createSubscription(createSubscriptionDto: CreateSubscriptionDto&{type:SubscriptionType,dbTransaction?:Transaction}): Promise<Subscription> {
    try {
      const { userId, type } = createSubscriptionDto;
      const existingSubscription = await this.subscriptionModel.findOne({ where: { userId } });

      if (existingSubscription) {
        if (existingSubscription.type === SubscriptionType.PREMIUM && type === SubscriptionType.FREE) {
          throw new ConflictException('User cannot downgrade to a free plan');
        }
        if (type === SubscriptionType.PREMIUM) {
          return await this.upgradeSubscriptionToPremium(existingSubscription,createSubscriptionDto.dbTransaction);
        }
        const expirationDate = moment(existingSubscription.expirationDate);
        if (expirationDate.isBefore(moment())) {
          return await this.createOrUpdateSubscription(userId, type,createSubscriptionDto.dbTransaction);
        } else {
          throw new ConflictException('User is already subscribed');
        }
      } else {
        return await this.createOrUpdateSubscription(userId, type,createSubscriptionDto.dbTransaction);
      }
    } catch (error) {
      throw new ConflictException(error.message);
    }
  }

  private async upgradeSubscriptionToPremium(existingSubscription: Subscription,dbTransaction:Transaction): Promise<Subscription> {
    const expirationDate = moment().add(1, 'year').toDate(); 
    return await existingSubscription.update({ type: SubscriptionType.PREMIUM, expirationDate, status: SubscriptionStatus.SUBSCRIBED },{transaction: dbTransaction});
  }

  private async createOrUpdateSubscription(userId: string, type: SubscriptionType, dbTransaction: Transaction): Promise<Subscription> {
    const usedTrialPeriod = type === SubscriptionType.FREE ? true : false;
    const expirationDate = moment()
      .add(type === SubscriptionType.FREE ? 14 : 1, type === SubscriptionType.FREE ? 'days' : 'year')
      .toDate();
    return await this.subscriptionModel.create({
      userId,
      type,
      usedTrialPeriod,
      expirationDate,
      status: SubscriptionStatus.SUBSCRIBED,
    },{transaction:dbTransaction});
  }

  async getSubscriptionById(id: string): Promise<Subscription> {
    const subscription = await this.subscriptionModel.findByPk(id);
    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }
    return subscription;
  }

  async updateSubscription(id: string, updateSubscriptionDto: UpdateSubscriptionDto): Promise<Subscription> {
    const subscription = await this.getSubscriptionById(id);

    if (moment(subscription.expirationDate).isBefore(moment())) {
      throw new ConflictException('Subscription has already expired');
    }

    await subscription.update(updateSubscriptionDto);
    return subscription;
  }

  async deleteSubscription(id: string): Promise<void> {
    const subscription = await this.getSubscriptionById(id);

    if (moment(subscription.expirationDate).isBefore(moment())) {
      throw new ConflictException('Subscription has already expired');
    }

    await subscription.destroy();
  }



  async checkAndUpdateSubscription(userId: string): Promise<Subscription> {
    const existingSubscription = await this.subscriptionModel.findOne({ where: { userId } });
    try {
      if (existingSubscription) {
        const currentDate = new Date();
        const expirationDate = new Date(existingSubscription.expirationDate);

        if (currentDate > expirationDate) {
          await existingSubscription.update({ status: SubscriptionStatus.EXPIRED });
        }
      }
      return  await existingSubscription.reload()
    } catch (error) {
      throw new ForbiddenException(!existingSubscription?"Please subscribe to premium or use our free 14 days trial plan":{existingSubscription});
    }
  }


}
