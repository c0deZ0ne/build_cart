import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';
import { PaymentMethod } from 'src/modules/user-wallet-transaction/models/user-transaction.model';

export class FundWalletDto {
  @IsNotEmpty()
  @ApiProperty({ type: Number, example: 60000 })
  amount: number;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  ref?: string;
}
