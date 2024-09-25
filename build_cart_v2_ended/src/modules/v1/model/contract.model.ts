import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

@Table({
  paranoid: true,
  tableName: 'contracts',
})
export class V1Contract extends Model<V1Contract> {
  @PrimaryKey
  @Column({ type: DataType.INTEGER, autoIncrement: true })
  id: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  client_id: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  vendor_id: number;

  @Column({ type: DataType.BOOLEAN, allowNull: true })
  vendor_signed: boolean;

  @Column({ type: DataType.BOOLEAN, allowNull: true })
  company_signed: boolean;

  @Column({ type: DataType.STRING, allowNull: true })
  status: string;

  @Column({ type: DataType.INTEGER, allowNull: true })
  rfq_request_id: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  rfq_qoute_id: number;

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
  insurance_tracking_id: string;

  @Column({ type: DataType.STRING, allowNull: true })
  delivery_status: string;

  @Column({ type: DataType.UUID, allowNull: true })
  NewId: string | null;
}
