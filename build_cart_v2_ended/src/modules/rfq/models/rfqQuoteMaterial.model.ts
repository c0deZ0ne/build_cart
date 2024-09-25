import {
  BelongsTo,
  Column,
  ForeignKey,
  Table,
  DataType,
} from 'sequelize-typescript';
import { BaseModel } from 'src/modules/database/base.model';
import { User } from 'src/modules/user/models/user.model';
import { RfqQuote, RfqRequest, RfqRequestMaterial } from '.';

@Table({
  paranoid: true,
})
export class RfqQuoteMaterial extends BaseModel<RfqQuoteMaterial> {
  @ForeignKey(() => RfqRequestMaterial)
  @Column
  RfqRequestMaterialId: string;

  @BelongsTo(() => RfqRequestMaterial)
  RfqRequestMaterial?: RfqRequestMaterial;

  @ForeignKey(() => RfqQuote)
  @Column
  RfqQuoteId: string;

  @BelongsTo(() => RfqQuote)
  RfqQuote?: RfqQuote;

  @ForeignKey(() => RfqRequest)
  @Column
  RfqRequestId: string;

  @BelongsTo(() => RfqRequest)
  RfqRequest?: RfqRequest;

  @Column({ allowNull: false })
  price: number;

  @Column({})
  quantity: number;

  @Column({ allowNull: false, defaultValue: 0 })
  discount: number;

  @Column({ type: DataType.TEXT })
  description: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  CreatedById: string;

  @BelongsTo(() => User, { foreignKey: 'CreatedById' })
  CreatedBy?: User;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: true })
  UpdatedById: string | null;

  @BelongsTo(() => User, { foreignKey: 'UpdatedById' })
  UpdatedBy?: User;
}
