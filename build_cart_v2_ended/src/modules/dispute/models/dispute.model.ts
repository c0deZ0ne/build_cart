import {
  Table,
  Column,
  ForeignKey,
  BelongsTo,
  DataType,
} from 'sequelize-typescript';
import { BaseModel } from 'src/modules/database/base.model';
import { Builder } from 'src/modules/builder/models/builder.model';
import { Vendor } from 'src/modules/vendor/models/vendor.model';
import { Contract } from 'src/modules/contract/models';
import { User } from 'src/modules/user/models/user.model';

export enum DisputeStatus {
  PENDING = 'PENDING',
  RESOLVED = 'RESOLVED',
  REFUNDED = 'REFUNDED',
}

@Table({
  paranoid: true,
})
export class Dispute extends BaseModel<Dispute> {
  @ForeignKey(() => Vendor)
  @Column
  VendorId: string;

  @BelongsTo(() => Vendor)
  Vendor?: Vendor;

  @ForeignKey(() => Builder)
  @Column
  BuilderId: string;

  @BelongsTo(() => Builder)
  Builder?: Builder;

  @Column({ unique: true })
  @ForeignKey(() => Contract)
  ContractId: string;

  @BelongsTo(() => Contract)
  Contract?: Contract;

  @Column({ type: DataType.STRING, allowNull: false })
  reason: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  message: string;

  @Column(DataType.ARRAY(DataType.STRING))
  proofs: string[];

  @Column({
    allowNull: false,
    type: DataType.ENUM(...Object.values(DisputeStatus)),
    defaultValue: DisputeStatus.PENDING,
  })
  status: DisputeStatus;

  @Column({ type: DataType.DATE, allowNull: true })
  resolvedAt: Date | null;

  @Column({ type: DataType.DATE, allowNull: true })
  refundedAt: Date | null;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: true })
  CreatedById: string | null;

  @BelongsTo(() => User, {
    foreignKey: 'CreatedById',
    as: 'CreatedBy',
    onDelete: 'SET NULL',
  })
  CreatedBy?: User;
}
