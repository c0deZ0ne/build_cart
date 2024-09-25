import {
  Column,
  Table,
  Model,
  BelongsTo,
  ForeignKey,
  DataType,
} from 'sequelize-typescript';
import { V1Individual } from './individual.model';
import { V1Company } from './company.model';

@Table({ tableName: 'users-permissions_user', paranoid: true })
export class V1User extends Model<V1User> {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column({ allowNull: true })
  username: string;

  @Column({ allowNull: true })
  email: string;

  @Column({ allowNull: true })
  provider: string;

  @Column({ allowNull: true })
  password: string;

  @Column({ allowNull: true })
  confirmed: boolean;

  @Column({ allowNull: true })
  blocked: boolean;

  @Column({ allowNull: true })
  role: number;

  @Column({ allowNull: true })
  resetlink: string;

  @Column({ allowNull: true })
  otp: string;

  @Column({ allowNull: true })
  user_type: 'vendor' | 'individual' | 'admin';

  @Column({ allowNull: true })
  user_mode: 'vendor' | 'company' | 'individual' | 'admin';

  @Column({ allowNull: true })
  unique_id: string;

  @Column({ allowNull: true })
  status: 'inactive' | 'active';

  @Column({ allowNull: true })
  token: string;

  @Column({ allowNull: true })
  last_login: Date;

  @BelongsTo(() => V1Individual)
  Individual: V1Individual;

  @ForeignKey(() => V1Individual)
  @Column
  individual: number | null;

  @Column({ allowNull: true })
  test: string;

  @Column({ allowNull: true })
  created_by: number;

  @Column({ allowNull: true })
  updated_by: number;

  @Column({ allowNull: true })
  created_at: Date;

  @Column({ allowNull: true })
  updated_at: Date;

  @Column({ allowNull: true })
  two_factor: boolean;

  @BelongsTo(() => V1Company)
  Company: V1Company;

  @ForeignKey(() => V1Company)
  @Column
  company: number | null;

  @Column({ allowNull: true })
  bank: number;

  @Column({ allowNull: true })
  picture: string;

  @Column({ allowNull: true })
  kyc: number;

  @Column({ allowNull: true })
  referer: string;

  @Column({ allowNull: true })
  my_vendor: number;

  @Column({ allowNull: true })
  my_vendors: number;

  @Column({ type: DataType.UUID, allowNull: true })
  NewId: string | null;
}
