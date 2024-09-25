import {
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaymentProvider, PaymentStatus } from '../../models/payment.model';
import { ApiProperty } from '@nestjs/swagger';

export class CutstructPayDto {
  @IsDefined()
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ example: '83d6b8c0-1854-423b-8d0e-87a1faa5a5a6' })
  UserId?: string | null;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ example: 'vendor@cutstruct.com' })
  VendorEmail?: string | null;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 2000000 })
  pay_amount_collected: number | null;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ example: 'vendor@cutstruct.com' })
  buyerEmail?: string | null;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ example: 'vendor@cutstruct.com' })
  VendorName?: string | null;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ example: 'vendor@cutstruct.com' })
  buyerName?: string | null;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'reciept link' })
  reciept_url?: string;

  @IsDefined()
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ example: '83d6b8c0-1854-423b-8d0e-87a1faa5a5a6 ' })
  CreatedById?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ example: 'payed for a contract' })
  title?: string;

  @IsDefined()
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ example: '83d6b8c0-1854-423b-8d0e-87a1faa5a5a6 ' })
  BuilderId?: string | null;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ example: '83d6b8c0-1854-423b-8d0e-87a1faa5a5a6 ' })
  VendorId?: string | null;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ example: '83d6b8c0-1854-423b-8d0e-87a1faa5a5a6 ' })
  vend_token?: string | null;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '83d6b8c0-1854-423b-8d0e-87a1faa5a5a6 ' })
  ContractId: string | null;
  @IsDefined()
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ example: 'BANI, PAYSTACK or BANK' })
  paymentProvider?: PaymentProvider;
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  pay_status: PaymentStatus;
}
