import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';

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
