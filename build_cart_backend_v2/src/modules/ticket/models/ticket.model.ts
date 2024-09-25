import {
  Table,
  Column,
  ForeignKey,
  BelongsTo,
  DataType,
} from 'sequelize-typescript';
import { BaseModel } from 'src/modules/database/base.model';
import { User } from 'src/modules/user/models/user.model';
import { Builder } from 'src/modules/builder/models/builder.model';
import { Vendor } from 'src/modules/vendor/models/vendor.model';

export enum TicketStatus {
  OPEN = 'OPEN',
  PROCESSING = 'PROCESSING',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

@Table({
  paranoid: true,
})
export class Ticket extends BaseModel<Ticket> {
  @Column({ type: DataType.STRING, allowNull: false })
  subject: string;

  @Column({ type: DataType.STRING, allowNull: false })
  message: string;

  @Column({
    allowNull: false,
    type: DataType.ENUM(...Object.values(TicketStatus)),
    defaultValue: TicketStatus.OPEN,
  })
  status: TicketStatus;

  @ForeignKey(() => Builder)
  @Column({ type: DataType.UUID, allowNull: true })
  BuilderId: string | null;

  @BelongsTo(() => Builder, { foreignKey: 'BuilderId' })
  Builder?: Builder;

  @ForeignKey(() => Vendor)
  @Column({ type: DataType.UUID, allowNull: true })
  VendorId: string | null;

  @BelongsTo(() => Vendor, { foreignKey: 'VendorId' })
  Vendor?: Vendor;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  UserId: string;

  @BelongsTo(() => User, { foreignKey: 'UserId' })
  User?: User;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: true })
  ResolvedById: string | null;

  @BelongsTo(() => User, { foreignKey: 'ResolvedById' })
  ResolvedBy?: User;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: true })
  ClosedById: string | null;

  @BelongsTo(() => User, { foreignKey: 'ClosedById' })
  ClosedBy?: User;

  @Column({ type: DataType.DATE, allowNull: true })
  resolvedAt: Date;

  @Column({ type: DataType.DATE, allowNull: true })
  closedAt: Date;

  @Column
  migratedAt: Date | null;
}
