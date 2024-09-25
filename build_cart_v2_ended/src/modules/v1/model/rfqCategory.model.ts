import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

@Table({ tableName: 'rfq_categories', paranoid: true })
export class V1RfqCategory extends Model<V1RfqCategory> {
  @PrimaryKey
  @Column({ type: DataType.INTEGER, autoIncrement: true })
  id: number;

  @Column({ type: DataType.STRING, allowNull: true })
  title: string;

  @Column({ type: DataType.INTEGER, allowNull: true })
  created_by: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  updated_by: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  created_at: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  updated_at: Date;

  @Column({ type: DataType.BOOLEAN, allowNull: true })
  active: boolean;
}
