import {
  Column,
  DataType,
  Table,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Vendor } from 'src/modules/vendor/models/vendor.model';
import { RfqRequest } from './rfqRequest.model';
import { BaseModel } from 'src/modules/database/base.model';

@Table({
  paranoid: true,
})
export class VendorRfqRequest extends BaseModel<VendorRfqRequest> {
  @ForeignKey(() => Vendor)
  @Column(DataType.UUID)
  VendorId: string;

  @BelongsTo(() => Vendor)
  Vendor?: Vendor;

  @ForeignKey(() => RfqRequest)
  @Column(DataType.UUID)
  RfqRequestId: string;

  @BelongsTo(() => RfqRequest)
  RfqRequest?: RfqRequest;
}
