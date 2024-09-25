import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from 'src/modules/database/base.model';
import { Project } from 'src/modules/project/models/project.model';
import { RfqQuote } from 'src/modules/rfq/models';
import { User } from 'src/modules/user/models/user.model';

export enum RfqBargainStatus {
  ACCEPTED = 'ACCEPTED',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
}

@Table({
  paranoid: true,
})
export class RfqBargain extends BaseModel<RfqBargain> {
  @Column({ type: DataType.DECIMAL })
  price: number;
  @ForeignKey(() => Project)
  @Column({ type: DataType.UUID, unique: false })
  ProjectId: string;

  @BelongsTo(() => Project)
  Project: Project;

  @ForeignKey(() => RfqQuote)
  @Column({ type: DataType.UUID, unique: false })
  RfqQuoteId: string;

  @BelongsTo(() => RfqQuote)
  RfqQuote: RfqQuote;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  createdAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  updatedAt: Date | null;

  @Column({ type: DataType.DATE, allowNull: true })
  deliveryDate: Date | null;

  @Column({
    allowNull: false,
    type: DataType.DECIMAL(15, 2),
  })
  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: true })
  CreatedById: string | null;

  @BelongsTo(() => User, {
    foreignKey: 'CreatedById',
    as: 'CreatedBy',
    onDelete: 'SET NULL',
  })
  CreatedBy?: User;

  @Column({ type: DataType.TEXT, allowNull: true })
  description: string | null;
  @Column
  migratedAt: Date | null;

  @Column({
    allowNull: false,
    type: DataType.ENUM(...Object.values(RfqBargainStatus)),
    defaultValue: RfqBargainStatus.PENDING,
  })
  status: RfqBargainStatus;
}
