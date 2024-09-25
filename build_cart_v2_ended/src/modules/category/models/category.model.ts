import { Column, DataType, Table } from 'sequelize-typescript';
import { BaseModel } from 'src/modules/database/base.model';

@Table({
  paranoid: true,
  tableName: 'Categories',
})
export class Category extends BaseModel<Category> {
  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  name: string;
}
