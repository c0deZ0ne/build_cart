import { Table, Column, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { BaseModel } from 'src/modules/database/base.model';
import { Vendor } from 'src/modules/vendor/models/vendor.model';
import { RfqRequest } from './rfqRequest.model';

@Table({
  paranoid: true,
})
export class RfqRequestInvitation extends BaseModel<RfqRequestInvitation> {
  @ForeignKey(() => RfqRequest)
  @Column
  RfqRequestId: string;

  @BelongsTo(() => RfqRequest)
  RfqRequest?: RfqRequest;

  @ForeignKey(() => Vendor)
  @Column
  VendorId: string;

  @BelongsTo(() => Vendor)
  Vendor?: Vendor;
}
