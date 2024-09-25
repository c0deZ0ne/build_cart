import {
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  isEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RemitterVerifyPaymentDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ example: '83d6b8c0-1854-423b-8d0e-87a1faa5a5a6' })
  userId?: string | null;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ example: 'testing ' })
  title?: string | null;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '83d6b8c0-1854-423b-8d0e-87a1faa5a5a6' })
  pay_ref: string | null;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '83d6b8c0-1854-423b-8d0e-87a1faa5a5a6' })
  orderId: string | null;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '83d6b8c0-1854-423b-8d0e-87a1faa5a5a6' })
  ContractId: string | null;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({ example: 200022 })
  pay_amount_collected?: number;
}

export enum PaymentType {
  ACCOUNT_WALLET_TOP_UP = 'ACCOUNT_WALLET_TOP_UP',
  ORDER_PAYMENT = 'ORDER_PAYMENT',
  PROJECT_WALLET_TOP_UP = 'PROJECT_WALLET_TOP_UP',
  PLATFORM_SUBSCRIPTION = 'PLATFORM_SUBSCRIPTION',
}
export class RemitterVerifyPaymentRefDto {
 
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '83d6b8c0-1854-423b-8d0e-87a1faa5a5a6' })
  pay_ref: string | null;

  @IsDefined()
  @IsEnum(PaymentType, { message: 'Invalid payment type' })
  @IsNotEmpty()
  @ApiProperty({
    example: PaymentType,
    enum: PaymentType,
    description: 'Type of payment from the frontend. Accepted values: ACCOUNT_WALLET_TOP_UP, ORDER_PAYMENT, PROJECT_WALLET_TOP_UP, PLATFORM_SUBSCRIPTION',
  })
  paymentType:PaymentType

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '83d6b8c0-1854-423b-8d0e-87a1faa5a5a6' })
  orderId: string | null;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({ example: 200022 })
  pay_amount_collected?: number;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '83d6b8c0-1854-423b-8d0e-87a1faa5a5a6' })
  ContractId: string | null;

}
export class vaultPaymentDto {
 
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '83d6b8c0-1854-423b-8d0e-87a1faa5a5a6' })
  pay_ref: string | null;

  @IsDefined()
  @IsEnum(PaymentType, { message: 'Invalid payment type' })
  @IsNotEmpty()
  @ApiProperty({
    example: PaymentType,
    enum: PaymentType,
    description: 'Type of payment from the frontend. Accepted values: ACCOUNT_WALLET_TOP_UP, ORDER_PAYMENT, PROJECT_WALLET_TOP_UP, PLATFORM_SUBSCRIPTION',
  })
  paymentType:PaymentType

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '83d6b8c0-1854-423b-8d0e-87a1faa5a5a6' })
  orderId: string | null;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({ example: 200022 })
  pay_amount_collected?: number;

 

}
