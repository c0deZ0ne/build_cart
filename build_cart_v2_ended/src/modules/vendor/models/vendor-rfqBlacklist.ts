import {
  Table,
  ForeignKey,
  Column,
  BelongsTo,
  DataType,
} from 'sequelize-typescript';
import { Vendor } from './vendor.model';
import { BaseModel } from 'src/modules/database/base.model';
import { RfqRequest } from 'src/modules/rfq/models';
import { User } from 'src/modules/user/models/user.model';

@Table({
  paranoid: true,
})
export class VendorRfqBlacklist extends BaseModel<VendorRfqBlacklist> {
  @ForeignKey(() => Vendor)
  @Column
  VendorId: string;

  @ForeignKey(() => RfqRequest)
  @Column
  RfqRequestId: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  CreatedById: string;

  @BelongsTo(() => User, { foreignKey: 'CreatedById' })
  CreatedBy?: User;

  @Column
  createdAt: Date;
  @Column
  updatedAt: Date;
}
