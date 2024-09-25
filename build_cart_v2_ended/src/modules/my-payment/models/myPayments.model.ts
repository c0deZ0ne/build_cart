import { Table, Column, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Builder } from 'src/modules/builder/models/builder.model';
import { Contract } from 'src/modules/contract/models';
import { BaseModel } from 'src/modules/database/base.model';
import { Payment } from 'src/modules/payment/models/payment.model';
import { Vendor } from 'src/modules/vendor/models/vendor.model';

@Table({
  paranoid: true,
})
export class MyPayment extends BaseModel<MyPayment> {
  @ForeignKey(() => Builder)
  @Column
  BuilderId: string;

  @BelongsTo(() => Builder)
  Builder: Builder;

  @ForeignKey(() => Contract)
  @Column
  ContractId: string;

  @ForeignKey(() => Vendor)
  @Column
  VendorId: string;

  @BelongsTo(() => Vendor)
  Vendor: Vendor;

  @ForeignKey(() => Payment)
  @Column
  PaymentId: string;

  @BelongsTo(() => Payment)
  Payment: Payment;
}
