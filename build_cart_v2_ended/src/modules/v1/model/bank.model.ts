import { Model, Column, Table, DataType } from 'sequelize-typescript';

@Table({
  paranoid: true,
  tableName: 'banks',
})
export class V1Bank extends Model<V1Bank> {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column
  users_permissions_user: number;

  @Column
  bank_name: string;

  @Column
  acoount_name: string;

  @Column
  acccount_number: string;

  @Column
  default: boolean;

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
  user: number;

  @Column({ type: DataType.UUID, allowNull: true })
  NewId: string | null;
}
