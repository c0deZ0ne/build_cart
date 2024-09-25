import {
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaymentProvider, PaymentStatus } from '../../models/payment.model';
import { ApiProperty } from '@nestjs/swagger';

export class RemitterCreatePaymentDto {
  @IsDefined()
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ example: '83d6b8c0-1854-423b-8d0e-87a1faa5a5a6' })
  UserId?: string | null;
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ example: '83d6b8c0-1854-423b-8d0e-87a1faa5a5a6 ' })
  CreatedById?: string | null;

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
  BuyerId?: string | null;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ example: '83d6b8c0-1854-423b-8d0e-87a1faa5a5a6 ' })
  VendorId?: string | null;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ example: '83d6b8c0-1854-423b-8d0e-87a1faa5a5a6 ' })
  SponsorId?: string | null;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '83d6b8c0-1854-423b-8d0e-87a1faa5a5a6 ' })
  ContractId: string | null;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '83d6b8c0-1854-423b-8d0e-87a1faa5a5a6 ' })
  OrderId: string | null;

  @IsDefined()
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ example: 'BANI, PAYSTACK, BANK , REMITTER' })
  paymentProvider?: PaymentProvider;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  pay_status: PaymentStatus;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '83d6b8c0-1854-423b-8d0e-87a1faa5a5a6 ' })
  RfqRequestId?: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'ref-324234eff2323' })
  pay_ref: string | null;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'pay_ext_ref-324234eff2323' })
  pay_ext_ref: string | null;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: '83d6b8c0-1854-423b-8d0e-87a1faa5a5a6 ' })
  UpdatedById?: string | null;

  @IsOptional()
  @IsObject()
  @ApiProperty({ example: { key: 'value', foo: 'bar' } })
  order_details?: Record<string, any> | null;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ example: 10000 })
  pay_amount_collected?: number | null;

  @IsString()
  @IsOptional()
  confirm_server_url: string | null;

  @IsOptional()
  @IsObject()
  @ApiProperty({ example: { key: 'value', foo: 'bar' } })
  custom_data?: any | null;

  @IsString()
  @IsOptional()
  vend_token: string | null;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ example: 10000 })
  pay_amount?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ example: 0 })
  pay_amount_outstanding?: number;

  @IsNumber()
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ example: 10000 })
  match_amount?: number | null;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: Date.now().toLocaleString() })
  pub_date?: string | null;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: Date.now().toLocaleString() })
  modified_date?: string | null;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'NGN' })
  match_currency?: string | null;
}
