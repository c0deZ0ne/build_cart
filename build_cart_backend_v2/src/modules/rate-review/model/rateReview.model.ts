import { Vendor } from 'src/modules/vendor/models/vendor.model';
import { BaseModel } from '../../database/base.model';
import {
  Table,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Contract } from 'src/modules/contract/models';
import { Builder } from 'src/modules/builder/models/builder.model';

@Table({
  paranoid: true,
})
export class RateReview extends BaseModel<RateReview> {
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

  @Column
  onTimeDelivery: number;

  @Column
  defectControl: number;

  @Column
  effectiveCommunication: number;

  @Column
  specificationAccuracy: number;

  @Column(DataType.TEXT)
  vendorReview: string | null;

  @Column(DataType.TEXT)
  builderReview: string | null;

  @Column(DataType.ARRAY(DataType.STRING))
  deliveryPictures: string[];

  @Column(DataType.INTEGER)
  vendorRateScore: number;

  @Column(DataType.INTEGER)
  builderRateScore: number;
}
