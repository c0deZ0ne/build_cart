import {
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PaystackVerifyPaymentDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ example: '83d6b8c0-1854-423b-8d0e-87a1faa5a5a6' })
  BuilderId?: string | null;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ example: 'testing ' })
  title?: string | null;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '83d6b8c0-1854-423b-8d0e-87a1faa5a5a6 ' })
  vend_token: string;
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '83d6b8c0-1854-423b-8d0e-87a1faa5a5a6 ' })
  pay_ref: string;
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '83d6b8c0-1854-423b-8d0e-87a1faa5a5a6 ' })
  ContractId: string;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({ example: 200022 })
  pay_amount_collected?: number;
}
