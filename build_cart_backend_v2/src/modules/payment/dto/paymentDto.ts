import {
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
  
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethod, PaymentProvider, PaymentStatus, SystemPaymentPurpose, VaultPayment } from '../types';

export class SystemPaymentDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '83d6b8c0-1854-423b-8d0e-87a1faa5a5a6' })
  reference: string | null;

  @IsDefined()
  @IsEnum(SystemPaymentPurpose, { message: 'Invalid payment type' })
  @IsNotEmpty()
  @ApiProperty({
    example: 'FUND_WALLET',
    enum: SystemPaymentPurpose,
    enumName: 'SystemPaymentPurpose',
    description: 'Type of payment from the frontend.',
  })
  paymentPurpose?: SystemPaymentPurpose

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '83d6b8c0-1854-423b-8d0e-87a1faa5a5a6' })
  orderId?: string | null;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({ example: 200022 })
  amount: number;
  
  @ApiProperty({
    example: 'BANK_TRANSFER',
    enum: PaymentMethod,
    enumName: 'PaymentMethod',
    description: 'Method of payment.',
  })
  @IsEnum(PaymentMethod)
  @IsOptional()
  paymentMethod?: PaymentMethod;

  @ApiProperty({
    example: 'BANK',
    enum: PaymentProvider,
    enumName: 'PaymentProvider',
    description: 'Payment provider.',
  })
  @IsEnum(PaymentProvider)
  @IsOptional()
  paymentProvider?: PaymentProvider;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ example: '83d6b8c0-1854-423b-8d0e-87a1faa5a5a6' })
  projectId?: string | null;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({ example: '83d6b8c0-1854-423b-8d0e-87a1faa5a5a6' })
  vaultId?: string | null;
}
export class vaultPaymentDto {
  @IsDefined()
  @IsEnum(VaultPayment, { message: 'Invalid payment type' })
  @IsNotEmpty()
  @ApiProperty({
    example: VaultPayment.FUND_ORDER,
    enum: VaultPayment,
    description: 'Type of payment from the frontend. Accepted values: FUND_ORDER',
  })
  paymentType?: VaultPayment
    
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '83d6b8c0-1854-423b-8d0e-87a1faa5a5a6' })
  projectId?: string | null;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '83d6b8c0-1854-423b-8d0e-87a1faa5a5a6' })
  orderId?: string | null;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({ example: 200022 })
  amount?: number;
}

export class MetaData {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '83d6b8c0-1854-423b-8d0e-87a1faa5a5a6' })
  projectId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '83d6b8c0-1854-423b-8d0e-87a1faa5a5a6' })
  orderId: string;

  @IsEnum(SystemPaymentPurpose)
  @IsNotEmpty()
  @ApiProperty({ example: SystemPaymentPurpose.FUND_ORDER })
  paymentPurpose: SystemPaymentPurpose;
}

export class RemitaWebhookRequestData {
  @IsEnum(PaymentStatus)
  @IsNotEmpty()
  @ApiProperty({ example: 'SUCCESS' })
  status: PaymentStatus;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '83d6b8c0-1854-423b-8d0e-87a1faa5a5a6' })
  userId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '83d6b8c0-1854-423b-8d0e-87a1faa5a5a6', description: 'Payment reference' })
  reference: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '83d6b8c0-1854-423b-8d0e-87a1faa5a5a6', description: 'Payment reference' })
  remitaReference: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 200022 })
  amount: number;

  @ApiProperty()
  @ValidateNested()
  @IsNotEmpty()
  metadata: MetaData;
}
export class ProjectWebhookRequestData {

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '83d6b8c0-1854-423b-8d0e-87a1faa5a5a6', description: 'Payment reference' })
  reference: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '83d6b8c0-1854-423b-8d0e-87a1faa5a5a6', description: 'userId ' })
  userId: string;

 
}
