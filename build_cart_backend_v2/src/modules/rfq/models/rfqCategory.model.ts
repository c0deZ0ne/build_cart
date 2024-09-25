import { Column, Table } from 'sequelize-typescript';
import { BaseModel } from 'src/modules/database/base.model';

@Table({
  paranoid: true,
  tableName: 'RfqCategories',
})
export class RfqCategory extends BaseModel<RfqCategory> {
  @Column
  title: string;

  @Column
  isActive: boolean;
}
