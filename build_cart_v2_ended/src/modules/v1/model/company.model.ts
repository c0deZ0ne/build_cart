import {
  Column,
  Model,
  Table,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { V1User, V1State, V1Country } from '.';

@Table({
  paranoid: true,
  tableName: 'companies',
})
export class V1Company extends Model<V1Company> {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column(DataType.STRING)
  logo: string;

  @Column(DataType.STRING)
  name: string;

  @Column(DataType.STRING)
  cac_regno: string;

  @ForeignKey(() => V1Country)
  @Column(DataType.INTEGER)
  country_id: number;

  @BelongsTo(() => V1Country)
  country: V1Country;

  @ForeignKey(() => V1State)
  @Column(DataType.INTEGER)
  state_id: number;

  @BelongsTo(() => V1State)
  state: V1State;

  @ForeignKey(() => V1User)
  @Column(DataType.INTEGER)
  users_id: number;

  @BelongsTo(() => V1User)
  user: V1User;

  @Column(DataType.STRING)
  phone: string;

  @Column(DataType.STRING)
  address: string;

  @Column(DataType.TEXT)
  about_us: string;

  @Column(DataType.STRING)
  company_email: string;

  @Column(DataType.STRING)
  size: string;

  @Column(DataType.STRING)
  primary_contact_name: string;

  @Column(DataType.STRING)
  primary_contact_phone: string;

  @Column(DataType.STRING)
  primary_contact_email: string;

  @Column(DataType.INTEGER)
  no_of_contracts: number;

  @Column(DataType.BOOLEAN)
  kyc_status: boolean;

  @Column(DataType.DATE)
  published_at: Date;

  @Column(DataType.INTEGER)
  created_by: number;

  @Column(DataType.INTEGER)
  updated_by: number;

  @Column(DataType.DATE)
  created_at: Date;

  @Column(DataType.DATE)
  updated_at: Date;

  @Column(DataType.STRING)
  trading_name: string;

  @Column(DataType.BOOLEAN)
  tax_compliance: boolean;

  @Column(DataType.BOOLEAN)
  racial_equity: boolean;

  @Column(DataType.BOOLEAN)
  term_of_service: boolean;

  @Column({ type: DataType.UUID, allowNull: true })
  NewId: string | null;
}
