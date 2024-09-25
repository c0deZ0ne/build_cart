import { Column, Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { BaseModel } from 'src/modules/database/base.model';
import { RfqCategory } from 'src/modules/rfq/models';
import { Vendor } from './vendor.model';

@Table({
  paranoid: true,
})
export class VendorRfqCategory extends BaseModel<VendorRfqCategory> {
  @ForeignKey(() => Vendor)
  @Column
  VendorId: string;

  @BelongsTo(() => Vendor)
  Vendor?: Vendor;

  @ForeignKey(() => RfqCategory)
  @Column
  RfqCategoryId: string;

  @BelongsTo(() => RfqCategory)
  RfqCategory?: RfqCategory;
}
