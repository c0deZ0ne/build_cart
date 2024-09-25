import {
  Column,
  Model,
  Table,
  DataType,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { V1Country } from './country.model';
import { V1State } from './state.model';

@Table({ tableName: 'individuals', paranoid: true })
export class V1Individual extends Model<V1Individual> {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column(DataType.STRING(500))
  first_name: string;

  @Column(DataType.STRING)
  last_name: string;

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

  @Column(DataType.INTEGER)
  user_id: number;

  @Column(DataType.STRING)
  phone: string;

  @Column(DataType.STRING)
  picture: string;

  @Column(DataType.STRING)
  gender: string;

  @Column(DataType.STRING)
  logo: string;

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

  @Column({ type: DataType.UUID, allowNull: true })
  NewId: string | null;
}
