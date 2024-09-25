import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Table,
} from 'sequelize-typescript';
import { Builder } from 'src/modules/builder/models/builder.model';
import { BaseModel } from 'src/modules/database/base.model';
import { Vendor } from 'src/modules/vendor/models/vendor.model';
import { Conversation } from './conversation.model';
import { FundManager } from 'src/modules/fund-manager/models/fundManager.model';

@Table({
  paranoid: true,
  indexes: [
    {
      unique: true,
      fields: ['VendorId', 'BuilderId', 'FundManagerId'],
    },
  ],
})
export class Chat extends BaseModel<Chat> {
  @ForeignKey(() => Builder)
  @Column({ type: DataType.UUID, allowNull: true })
  BuilderId: string;

  @BelongsTo(() => Builder, {
    foreignKey: 'BuilderId',
    onDelete: 'CASCADE',
  })
  Builder?: Builder;

  @ForeignKey(() => Vendor)
  @Column({ type: DataType.UUID, allowNull: true })
  VendorId: string;

  @BelongsTo(() => Vendor, {
    foreignKey: 'VendorId',
    onDelete: 'CASCADE',
  })
  Vendor?: Vendor | null;

  @ForeignKey(() => FundManager)
  @Column({ type: DataType.UUID, allowNull: true })
  FundManagerId: string | null;

  @BelongsTo(() => FundManager, {
    foreignKey: 'FundManagerId',
    onDelete: 'CASCADE',
  })
  FundManager?: FundManager | null;

  @HasMany(() => Conversation)
  Conversations?: Conversation[];
}
