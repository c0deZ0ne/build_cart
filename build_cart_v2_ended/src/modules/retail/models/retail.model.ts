import { Column, Table } from 'sequelize-typescript';
import { BaseModel } from 'src/modules/database/base.model';

@Table({
  paranoid: true,
})
export class RetailUser extends BaseModel<RetailUser> {
  @Column
  name: string;

  @Column
  email: string;

  @Column
  phone: string;

  @Column
  enquiry: string;

  @Column
  is_phone_number_on_whatsapp: boolean;

  @Column
  can_receive_marketing_info: boolean;
}
