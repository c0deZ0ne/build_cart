import { Column, Table } from 'sequelize-typescript';
import { BaseModel } from 'src/modules/database/base.model';

@Table({
  paranoid: true,
})
export class Commission extends BaseModel<Commission> {
  @Column({ defaultValue: 0 })
  percentageNumber: number;

  @Column({})
  active: boolean;
}
