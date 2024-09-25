import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

@Table({ tableName: 'rfq_quotes_materials', paranoid: true })
export class V1RfqQuoteMaterial extends Model<V1RfqQuoteMaterial> {
  @PrimaryKey
  @Column({ type: DataType.INTEGER, autoIncrement: true })
  id: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  rfq_material_id: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  rfq_request_id: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  rfq_qoute_id: number;

  @Column({ type: DataType.FLOAT, allowNull: true })
  price_per_unit: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  total_cost: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  discount: number;

  @Column({ type: DataType.DATE, allowNull: true })
  published_at: Date;

  @Column({ type: DataType.INTEGER, allowNull: true })
  created_by: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  updated_by: number;

  @Column({ type: DataType.DATE, allowNull: false })
  created_at: Date;

  @Column({ type: DataType.DATE, allowNull: false })
  updated_at: Date;

  @Column({ type: DataType.STRING, allowNull: true })
  vendor_lpo: string;

  @Column({ type: DataType.UUID, allowNull: true })
  NewId: string | null;
}
