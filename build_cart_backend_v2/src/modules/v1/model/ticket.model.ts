import {
  Model,
  Table,
  Column,
  DataType,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';

@Table({ tableName: 'tickets', paranoid: true })
export class V1Ticket extends Model<V1Ticket> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @AllowNull
  @Column(DataType.STRING(255))
  subject!: string | null;

  @AllowNull
  @Column(DataType.TEXT)
  message!: string | null;

  @AllowNull
  @Column(DataType.STRING(255))
  status!: string | null;

  @AllowNull
  @Column(DataType.INTEGER)
  user_id!: number | null;

  @AllowNull
  @Column(DataType.DATE)
  published_at!: Date | null;

  @AllowNull
  @Column(DataType.INTEGER)
  created_by!: number | null;

  @AllowNull
  @Column(DataType.INTEGER)
  updated_by!: number | null;

  @CreatedAt
  @Column(DataType.DATE)
  created_at!: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updated_at!: Date;

  @Column({ type: DataType.UUID, allowNull: true })
  NewId: string | null;
}
