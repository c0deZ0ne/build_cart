import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from 'src/modules/database/base.model';
import { User } from 'src/modules/user/models/user.model';

@Table({
  paranoid: true,
})
export class PriceList extends BaseModel<PriceList> {
  @Column({ type: DataType.STRING, allowNull: false })
  label?: string;

  @Column({ type: DataType.INTEGER, allowNull: true })
  value?: number | null;

  @Column({ type: DataType.INTEGER, allowNull: false })
  price?: number;

  @Column({ type: DataType.STRING, allowNull: false })
  metric?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  color?: string | null;

  @Column({ type: DataType.BOOLEAN, allowNull: true })
  isDisabled?: boolean | null;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: true })
  UpdatedById?: string | null;

  @BelongsTo(() => User, { foreignKey: 'UpdatedById', onDelete: 'SET NULL' })
  UpdatedBy: User;
}
