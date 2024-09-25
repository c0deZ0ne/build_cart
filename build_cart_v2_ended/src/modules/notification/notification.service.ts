import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Notification } from './models/notification.model';
import { WhereOptions, Op } from 'sequelize';
@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification)
    private readonly notificationModel: typeof Notification,
  ) {}

  async createNotificationWithCtas(
    message: string,
    UserId: string,
    ctas: { label: string; url: string }[],
  ): Promise<Notification> {
    return this.notificationModel.create({
      message,
      UserId,
      isRead: false,
      ctas,
    });
  }

  async getAllNotifications({
    UserId,
    search,
  }: {
    UserId: string;
    search: string;
  }): Promise<Notification[]> {
    const whereOptions: WhereOptions<Notification> = {};
    whereOptions.UserId = UserId;
    if (search) {
      whereOptions[Op.or] = [{ message: { [Op.iLike]: `%${search}%` } }];
    }

    return this.notificationModel.findAll({ where: whereOptions });
  }

  async markNotificationAsRead({
    UserId,
    notificationId,
  }: {
    notificationId: string;
    UserId: string;
  }): Promise<Notification> {
    try {
      const notification = await this.notificationModel.findOne({
        where: { id: notificationId, UserId },
      });
      if (notification) {
        notification.isRead = true;
        notification.updatedAt = new Date();
        return await notification.save();
      } else {
        throw new NotFoundException();
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async deleteNotification({
    UserId,
    notificationId,
  }: {
    notificationId: string;
    UserId: string;
  }): Promise<unknown> {
    try {
      const notification = await this.notificationModel.findOne({
        where: { id: notificationId, UserId },
      });
      if (notification) {
        return await notification.destroy({ force: true });
      } else {
        throw new NotFoundException();
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
