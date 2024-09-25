import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Chat } from './models/chat.model';
import { Conversation } from './models/conversation.model';
import { User, UserType } from 'src/modules/user/models/user.model';
import { Builder } from 'src/modules/builder/models/builder.model';
import { Vendor } from 'src/modules/vendor/models/vendor.model';
import {
  SendConversationDto,
  startChartDto,
} from './dto/send-conversation.dto';
import { WhereOptions } from 'sequelize';
import { FundManager } from '../fund-manager/models/fundManager.model';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat)
    private readonly chatModel: typeof Chat,
    @InjectModel(User)
    private readonly userModel: typeof User,
    @InjectModel(Conversation)
    private readonly conversionModel: typeof Conversation,
  ) {}

  async getChatByIdForUser(chatId: string, user: User) {
    const whereOptions: WhereOptions<Chat> = { id: chatId };
    if (user.VendorId) whereOptions.VendorId = user.VendorId;
    if (user.BuilderId) whereOptions.BuilderId = user.BuilderId;
    if (user.FundManagerId) whereOptions.FundManagerId = user.FundManagerId;
    return this.chatModel.findOrThrow({ where: whereOptions });
  }

  async getChatBetweenBuilderAndVendor({
    requestingUser,
    respondingUser,
  }: {
    requestingUser: User;
    respondingUser: string;
  }) {
    const respondingUserData = await this.userModel.findByPkOrThrow(
      respondingUser,
    );
    const chat = await this.chatModel.findOrCreate({
      where: {
        BuilderId: requestingUser.BuilderId || respondingUserData.BuilderId,
        VendorId: requestingUser.VendorId || respondingUserData.VendorId,
        FundManagerId:
          requestingUser.FundManagerId || respondingUserData.FundManagerId,
      },
      include: [{ model: Vendor }, { model: FundManager }, { model: Builder }],
    });
    return chat[0];
  }

  async getConversations(chatId: string, user: User) {
    await this.getChatByIdForUser(chatId, user);

    const conversations = await this.conversionModel.findAll({
      where: { ChatId: chatId },
      include: [
        {
          model: User,
          attributes: ['userType', 'VendorId', 'BuilderId', 'FundManagerId'],
        },
        {
          model: Conversation,
          as: 'RepliedConversation',
          include: [
            {
              model: User,
              attributes: [
                'userType',
                'VendorId',
                'BuilderId',
                'FundManagerId',
              ],
            },
          ],
        },
      ],
    });
    const medias = [];
    const conversationDta = conversations.map((conversation) => {
      conversation.images.forEach((d) => medias.push(d));
      return {
        ...conversation.toJSON(),
        sender:
          user.BuilderId === conversation.User.BuilderId ||
          user.VendorId === conversation.User.VendorId ||
          user.FundManagerId === conversation.User.FundManagerId,
      };
    });
    return {
      medias,
      conversationDta,
    };
  }

  async getMyChats(user: User) {
    const whereQuery: WhereOptions<Chat> = {};
    if (user.VendorId) whereQuery.VendorId = user.VendorId;
    if (user.BuilderId) whereQuery.BuilderId = user.BuilderId;
    if (user.FundManagerId) whereQuery.FundManagerId = user.FundManagerId;

    const chats = await this.chatModel.findAll({
      where: whereQuery,
      include: [
        { model: Vendor, include: [{ model: User, as: 'owner' }] },
        { model: Builder, include: [{ model: User, as: 'owner' }] },
        { model: FundManager, include: [{ model: User, as: 'owner' }] },
        {
          model: Conversation,
          order: [['createdAt', 'DESC']],
          limit: 1,
        },
      ],
    });

    return chats
      .filter((chat) => chat.Conversations?.[0])
      .map((chat) => {
        const medias = [];
        chat.Conversations.map((d) => {
          d.images.forEach((f) => medias.push(f));
        });
        const recipient =
          user.userType === UserType.BUILDER
            ? {
                name:
                  chat.Vendor?.businessName || chat?.FundManager?.businessName,
                email: chat?.Vendor?.email || chat?.FundManager?.email,
                phone: chat?.Vendor?.phone || chat?.FundManager?.phone,
              }
            : user.userType === UserType.SUPPLIER
            ? {
                name:
                  chat.Builder.owner.businessName ||
                  chat.FundManager.owner.businessName,
                email: chat.Builder.owner.email || chat.FundManager.owner.email,
                phone:
                  chat.Builder.owner.phoneNumber ||
                  chat.FundManager.owner.phoneNumber,
              }
            : {
                name: chat?.Vendor?.businessName || chat?.Builder?.businessName,
                email: chat?.Vendor?.email || chat?.Builder?.email,
                phone: chat?.Vendor?.phone,
              };
        return {
          ...chat.toJSON(),
          medias,
          recipient,
          LastConversation: chat.Conversations?.[0].toJSON(),
        };
      });
  }

  async sendConversation(
    body: SendConversationDto,
    chatId: string,
    user: User,
  ) {
    await this.getChatByIdForUser(chatId, user);

    const { text, images, repliedConversationId } = body;
    await this.conversionModel.create({
      text,
      images,
      RepliedConversationId: repliedConversationId,
      ChatId: chatId,
      UserId: user.id,
    });
  }

  async startChat({
    fromUser,
    toUser,
    body,
  }: {
    fromUser: User;
    toUser: string;
    body: startChartDto;
  }) {
    try {
      const chatData = await this.getChatBetweenBuilderAndVendor({
        requestingUser: fromUser,
        respondingUser: toUser,
      });
      return await this.sendConversation(body, chatData.id, fromUser);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
