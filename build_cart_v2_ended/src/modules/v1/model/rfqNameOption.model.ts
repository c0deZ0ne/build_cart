import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

@Table({ tableName: 'rfq_name_options', paranoid: true })
export class V1RfqNameOption extends Model<V1RfqNameOption> {
  @PrimaryKey
  @Column({ type: DataType.INTEGER, autoIncrement: true })
  id: number;

  @Column({ type: DataType.STRING, allowNull: true })
  title: string;

  @Column({ type: DataType.INTEGER, allowNull: true })
  created_by: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  updated_by: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  created_at: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  updated_at: Date;

  @Column({ type: DataType.INTEGER, allowNull: true })
  rfq_category: number;

  @Column({ type: DataType.STRING, allowNull: true })
  SPECIFICATION: string;

  @Column({ type: DataType.STRING, allowNull: true })
  PRODUCT: string;

  @Column({ type: DataType.STRING, allowNull: true })
  metric: string;

  @Column({ type: DataType.STRING, allowNull: true })
  Carbon_Count_kg: string;

  @Column({ type: DataType.UUID, allowNull: true })
  NewId: string | null;
}
