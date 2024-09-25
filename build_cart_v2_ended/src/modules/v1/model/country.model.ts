import { Column, Model, Table, DataType } from 'sequelize-typescript';

@Table({
  paranoid: true,
  tableName: 'countries',
  timestamps: true,
})
export class V1Country extends Model<V1Country> {
  @Column(DataType.STRING)
  name: string;

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
}
