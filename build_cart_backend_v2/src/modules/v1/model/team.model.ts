import {
  Column,
  Model,
  Table,
  DataType,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { V1User } from './user.model';

@Table({ tableName: 'teams', paranoid: true })
export class V1Team extends Model<V1Team> {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @ForeignKey(() => V1User)
  @Column(DataType.INTEGER)
  user_id: number;

  @BelongsTo(() => V1User)
  User: V1User;

  @Column(DataType.STRING)
  name: string;

  @Column(DataType.STRING)
  email: string;

  @Column(DataType.STRING)
  role: string;

  @Column(DataType.STRING)
  status: 'inactive' | 'active';

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
