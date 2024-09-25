import {
  Column,
  DataType,
  Table,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Chat } from 'src/modules/chat/models/chat.model';
import { BaseModel } from 'src/modules/database/base.model';
import { User } from 'src/modules/user/models/user.model';

@Table({
  paranoid: true,
})
export class Conversation extends BaseModel<Conversation> {
  @ForeignKey(() => Chat)
  @Column(DataType.UUID)
  ChatId: string;

  @BelongsTo(() => Chat)
  Chat?: Chat;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  UserId: string;

  @BelongsTo(() => User)
  User?: User;

  @ForeignKey(() => Conversation)
  @Column(DataType.UUID)
  RepliedConversationId: string | null;

  @BelongsTo(() => Conversation)
  RepliedConversation?: Conversation;

  @Column(DataType.STRING)
  text: string;

  @Column(DataType.ARRAY(DataType.STRING))
  images: string[];
}
