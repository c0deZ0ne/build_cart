import { Column, Table, DataType } from 'sequelize-typescript';
import { BaseModel } from 'src/modules/database/base.model';

@Table({
  paranoid: true,
})
export class TemporaryVendor extends BaseModel<TemporaryVendor> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  companyName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  phone: string;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: true,
    get() {
      const rawValue: string = this.getDataValue('categories');
      if (rawValue) {
        return rawValue.replace(/{/g, '[').replace(/}/g, ']');
      }
      return null;
    },
  })
  categories: string[];

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  country: string;
}
