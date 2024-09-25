import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

@Table({ tableName: 'rfq_requests', paranoid: true })
export class V1RfqRequest extends Model<V1RfqRequest> {
  @PrimaryKey
  @Column({ type: DataType.INTEGER, autoIncrement: true })
  id: number;

  @Column({ type: DataType.STRING, allowNull: true })
  title: string;

  @Column({ type: DataType.INTEGER, allowNull: true })
  rfq_category_id: number;

  @Column({ type: DataType.STRING, allowNull: true })
  status: string;

  @Column({ type: DataType.BIGINT, allowNull: true })
  budget: number;

  @Column({ type: DataType.BOOLEAN, allowNull: true })
  budget_visibility: boolean;

  @Column({ type: DataType.DATEONLY, allowNull: true })
  delivery_date: Date;

  @Column({ type: DataType.DATEONLY, allowNull: true })
  qoute_deadline: Date;

  @Column({ type: DataType.STRING, allowNull: true })
  delivery_address: string;

  @Column({ type: DataType.STRING, allowNull: true })
  request_type: string;

  @Column({ type: DataType.BOOLEAN, allowNull: true })
  task: boolean;

  @Column({ type: DataType.FLOAT, allowNull: true })
  tax_percentage: number;

  @Column({ type: DataType.STRING, allowNull: true })
  rfq_file: string;

  @Column({ type: DataType.STRING, allowNull: true })
  rfq_delivery_status: string;

  @Column({ type: DataType.BOOLEAN, allowNull: true })
  rfq_delivery_confirmation: boolean;

  @Column({ type: DataType.INTEGER, allowNull: true })
  rfq_project_id: number;

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

  @Column({ type: DataType.TEXT, allowNull: true })
  address_json: string;

  @Column({ type: DataType.STRING, allowNull: true })
  longitude: string;

  @Column({ type: DataType.STRING, allowNull: true })
  latitude: string;

  @Column({ type: DataType.JSONB, allowNull: true })
  test_json: object;

  @Column({ type: DataType.STRING, allowNull: true })
  city: string;

  @Column({ type: DataType.STRING, allowNull: true })
  state: string;

  @Column({ type: DataType.STRING, allowNull: true })
  country: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  contract_text: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  delivery_instructions: string;

  @Column({ type: DataType.INTEGER, allowNull: true })
  user: number;

  @Column({ type: DataType.STRING, allowNull: true })
  payment_term: string;

  @Column({ type: DataType.BOOLEAN, allowNull: true })
  active: boolean;

  @Column({ type: DataType.STRING, allowNull: true })
  LPO: string;

  @Column({ type: DataType.UUID, allowNull: true })
  NewId: string | null;
}
