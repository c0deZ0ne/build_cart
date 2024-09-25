import {
  Table,
  Column,
  ForeignKey,
  DataType,
  BelongsTo,
} from 'sequelize-typescript';
import { BaseModel } from 'src/modules/database/base.model';
import { RfqCategory } from './rfqCategory.model';

@Table({
  paranoid: true,
})
export class RfqItem extends BaseModel<RfqItem> {
  @Column
  name: string;

  @ForeignKey(() => RfqCategory)
  @Column({ type: DataType.UUID, allowNull: true })
  rfqCategoryId: string;

  @BelongsTo(() => RfqCategory, { foreignKey: 'rfqCategoryId' })
  category: RfqCategory;

  @Column
  specification: string | null;

  @Column
  product: string;

  @Column
  metric: string;

  @Column
  carbonCount: number;

  @Column
  migratedAt: Date | null;
}
