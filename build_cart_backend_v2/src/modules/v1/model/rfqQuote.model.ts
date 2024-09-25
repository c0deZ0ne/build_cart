import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

@Table({ tableName: 'rfq_quotes', paranoid: true })
export class V1RfqQuote extends Model<V1RfqQuote> {
  @PrimaryKey
  @Column({ type: DataType.INTEGER, autoIncrement: true })
  id: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  rfq_request_id: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  company_id: number;

  @Column({ type: DataType.FLOAT, allowNull: true })
  total_cost: number;

  @Column({ type: DataType.DATE, allowNull: true })
  delivery_date: Date;

  @Column({ type: DataType.STRING, allowNull: true })
  status: string;

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
  vendor_status: string;

  @Column({ type: DataType.STRING, allowNull: true })
  tax: string;

  @Column({ type: DataType.INTEGER, allowNull: true })
  rfq_category: number;

  @Column({ type: DataType.BOOLEAN, allowNull: true })
  livevend_logistics: boolean;

  @Column({ type: DataType.FLOAT, allowNull: true })
  livevend_logistic_cost: number;

  @Column({ type: DataType.BOOLEAN, allowNull: true })
  vendor_livevend_logistics: boolean;

  @Column({ type: DataType.STRING, allowNull: true })
  vendor_lpo: string;

  @Column({ type: DataType.UUID, allowNull: true })
  NewId: string | null;
}
