import { Column, DataType, Table } from 'sequelize-typescript';
import { BaseModel } from 'src/modules/database/base.model';

export enum BrandPackage {
  PREMIUM = 'PREMIUM',
  BASIC = 'BASIC',
}

@Table({
  paranoid: true,
})
export class Brand extends BaseModel<Brand> {
  @Column(DataType.STRING)
  logo: string;

  @Column(DataType.ARRAY(DataType.STRING))
  images: string[];

  @Column(DataType.STRING)
  name: string;

  @Column(DataType.TEXT)
  description: string;

  @Column(DataType.STRING)
  location: string;

  @Column(DataType.ARRAY(DataType.STRING))
  tags: string[];

  @Column(DataType.JSONB)
  specifications: Record<string, unknown>;

  @Column({
    type: DataType.ENUM(...Object.values(BrandPackage)),
    defaultValue: BrandPackage.BASIC,
  })
  package: BrandPackage;
}
