import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { PaymentMethod } from 'src/modules/payment/types';

export class CreateTransactionDto {
  @IsNotEmpty()
  @ApiProperty({ type: Number, example: 60000 })
  amount: number;

  @IsNotEmpty()
  @ApiProperty({ type: Number, example: 2945067890 })
  account_number: bigint;

  @IsNotEmpty()
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @IsNotEmpty()
  @IsString()
  description: string;
}
