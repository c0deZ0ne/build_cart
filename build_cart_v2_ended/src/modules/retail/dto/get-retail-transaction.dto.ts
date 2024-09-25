import { IsEnum } from 'class-validator';
import { STATUS } from '../models/retail-transaction.model';

export class GetTransactionsDto {
  @IsEnum(STATUS)
  status?: STATUS;
}
