import { Table, Column, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Builder } from 'src/modules/builder/models/builder.model';
import { BaseModel } from 'src/modules/database/base.model';
import { Vendor } from 'src/modules/vendor/models/vendor.model';

@Table({
  paranoid: true,
})
export class MyVendor extends BaseModel<MyVendor> {
  @ForeignKey(() => Builder)
  @Column
  BuilderId: string;

  @BelongsTo(() => Builder)
  Builder: Builder;

  @ForeignKey(() => Vendor)
  @Column
  VendorId: string;

  @BelongsTo(() => Vendor)
  Vendor: Vendor;
}
