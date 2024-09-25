import { Column, HasMany, DataType, Table } from 'sequelize-typescript';
import { BaseModel } from 'src/modules/database/base.model';
import { RetailTransaction } from 'src/modules/retail/models/retail-transaction.model';

export enum SPECIFICATION {
  DOMESTIC = 'DOMESTIC',
  COMMERCIAL = 'COMMERCIAL',
  INDUSTRIAL = 'INDUSTRIAL',
}

@Table({
  paranoid: true,
})
export class LabourHack extends BaseModel<LabourHack> {
  @Column(DataType.STRING)
  name: string;

  @Column({
    type: DataType.ENUM(...Object.values(SPECIFICATION)),
    defaultValue: null,
  })
  specification: SPECIFICATION;

  @HasMany(() => RetailTransaction)
  transactions: RetailTransaction[];
}
