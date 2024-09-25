import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  ValidationPipe,
  UseGuards,
  Query,
  Patch,
  Delete,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import {
  ApiTags,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiOperation,
} from '@nestjs/swagger';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/user.decorator';
import { User } from '../user/models/user.model';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'get  user notifications',
  })
  @Get('/me')
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search notification messages',
    type: String,
  })
  @ApiQuery({
    name: 'page_size',
    type: Number,
    required: false,
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'Get notifications by user ID',
    type: [CreateNotificationDto],
  })
  async getAllNotifications(
    @GetUser() { id }: User,
    @Query('search') search: string,
  ) {
    return this.notificationService.getAllNotifications({ UserId: id, search });
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'mark notification as read',
  })
  @Patch('/me/:notificationId/read')
  async readNotification(
    @GetUser() { id }: User,
    @Param('notificationId') notificationId: string,
  ) {
    return this.notificationService.markNotificationAsRead({
      notificationId,
      UserId: id,
    });
  }
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'delete notification',
  })
  @Delete('/me/:notificationId/delete')
  async deleteNotification(
    @GetUser() { id }: User,
    @Param('notificationId') notificationId: string,
  ) {
    return this.notificationService.deleteNotification({
      notificationId,
      UserId: id,
    });
  }

  @Post(':userId')
  @ApiParam({ name: 'userId', description: 'User ID', type: String })
  @ApiBody({
    type: CreateNotificationDto,
    description: 'Data for creating notification',
  })
  @ApiResponse({
    status: 201,
    description: 'Create notification with CTAs',
    type: CreateNotificationDto,
  })
  async createNotificationWithCtas(
    @Param('userId') userId: string,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    createNotificationDto: CreateNotificationDto,
  ) {
    return this.notificationService.createNotificationWithCtas(
      createNotificationDto.message,
      userId,
      createNotificationDto.ctas,
    );
  }
}
