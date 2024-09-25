import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/modules/auth/user.decorator';
import { User } from 'src/modules/user/models/user.model';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { ChatService } from './chat.service';
import {
  SendConversationDto,
  startChartDto,
} from './dto/send-conversation.dto';

@Controller('chat')
@ApiTags('chat')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @ApiOperation({
    summary: 'Get my chats',
  })
  @Get()
  async getMyChats(@GetUser() user: User) {
    return await this.chatService.getMyChats(user);
  }

  @ApiOperation({
    summary: 'Get chat between builder and vendor or fund manager',
  })
  @Get(':userId')
  async getChatBetweenBuilderAndVendor(
    @GetUser() user: User,
    @Param('userId') userId: string,
  ) {
    return await this.chatService.getChatBetweenBuilderAndVendor({
      requestingUser: user,
      respondingUser: userId,
    });
  }

  @ApiOperation({
    summary: 'send conversation',
  })
  @Post(':chatId')
  async sendConversation(
    @GetUser() user: User,
    @Param('chatId') chatId: string,
    @Body(ValidationPipe) body: SendConversationDto,
  ) {
    await this.chatService.sendConversation(body, chatId, user);
  }

  @ApiOperation({
    summary: 'Update chat with conversations',
  })
  @Get(':chatId/conversation')
  async getConversations(
    @GetUser() user: User,
    @Param('chatId') chatId: string,
  ) {
    return await this.chatService.getConversations(chatId, user);
  }
  @ApiOperation({
    summary: 'start a chart with user',
  })
  @Post(':userId/start')
  async postChart(
    @GetUser() user: User,
    @Body(ValidationPipe) body: startChartDto,
    @Param('userId') userId: string,
  ) {
    return await this.chatService.startChat({
      fromUser: user,
      toUser: userId,
      body,
    });
  }
}
