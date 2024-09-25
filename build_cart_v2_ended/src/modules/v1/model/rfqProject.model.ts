import {
  Column,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
  DataType,
} from 'sequelize-typescript';
import { V1User } from './user.model';

@Table({ tableName: 'rfq_projects', paranoid: true })
export class V1RfqProject extends Model<V1RfqProject> {
  @Column
  title: string;

  @ForeignKey(() => V1User)
  @Column
  user_id: number;

  @BelongsTo(() => V1User)
  user?: V1User;

  @Column
  published_at: Date;

  @Column
  created_by: number;

  @Column
  updated_by: number;

  @Column
  created_at: Date;

  @Column
  updated_at: Date;

  @Column
  image: string;

  @Column
  description: string;

  @Column
  location: string;

  @Column
  country: string;

  @Column
  state: string;

  @Column
  start_date: Date;

  @Column
  end_date: Date;

  @Column
  duration: string;

  @Column
  active: boolean;

  @Column({ type: DataType.UUID, allowNull: true })
  NewId: string | null;
}
