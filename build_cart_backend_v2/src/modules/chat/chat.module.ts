import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Conversation } from './models/conversation.model';
import { Chat } from './models/chat.model';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { User } from '../user/models/user.model';

@Module({
  imports: [SequelizeModule.forFeature([Chat, Conversation, User])],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
