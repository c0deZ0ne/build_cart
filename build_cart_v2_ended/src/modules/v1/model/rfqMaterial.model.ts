import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

@Table({
  paranoid: true,
  tableName: 'rfq_materials',
})
export class V1RfqMaterial extends Model<V1RfqMaterial> {
  @PrimaryKey
  @Column({ type: DataType.INTEGER, autoIncrement: true })
  id: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  rfq_request_id: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  rfq_name_id: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  rfq_description_id: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  rfq_measurement_id: number;

  @Column({ type: DataType.TEXT, allowNull: true })
  description: string;

  @Column({ type: DataType.INTEGER, allowNull: true })
  quantity: number;

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

  @Column({ type: DataType.BIGINT, allowNull: true })
  budget: number;

  @Column({ type: DataType.STRING, allowNull: true })
  measurement_name: string;

  @Column({ type: DataType.UUID, allowNull: true })
  NewId: string | null;
}
