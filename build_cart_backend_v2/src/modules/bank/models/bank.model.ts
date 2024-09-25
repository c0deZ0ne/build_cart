import {
  Column,
  Table,
  ForeignKey,
  BelongsTo,
  DataType,
} from 'sequelize-typescript';
import { Builder } from 'src/modules/builder/models/builder.model';
import { BaseModel } from 'src/modules/database/base.model';
import { User } from 'src/modules/user/models/user.model';
import { Vendor } from 'src/modules/vendor/models/vendor.model';

@Table({
  paranoid: true,
})
export class Bank extends BaseModel<Bank> {
  @Column
  accountName: string;

  @Column({ unique: true })
  accountNumber: string;

  @Column
  bankName: string;

  @Column
  bankSlug: string;

  @Column
  bankCode: string;

  @ForeignKey(() => Vendor)
  @Column({ type: DataType.UUID, unique: true, allowNull: true })
  VendorId: string;

  @BelongsTo(() => Vendor)
  vendor: Vendor;

  @ForeignKey(() => Builder)
  @Column({ type: DataType.UUID, unique: true, allowNull: true })
  BuilderId: string;

  @BelongsTo(() => Builder)
  builder: Builder;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID })
  UpdatedById: string;

  @BelongsTo(() => User)
  updatedBy: User;

  @Column
  migratedAt: Date | null;
}
