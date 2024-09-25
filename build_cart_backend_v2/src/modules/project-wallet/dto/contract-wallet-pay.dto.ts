import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsString,
  IsNotEmpty,
  IsUUID,
  IsNumber,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { PaymentMethod, SystemPaymentPurpose } from 'src/modules/payment/types';

export class PayforContratcwithWalletDto {
  @IsDefined()
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({ example: '83d6b8c0-1854-423b-8d0e-87a1faa5a5a6' })
  contractId: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({ example: '83d6b8c0-1854-423b-8d0e-87a1faa5a5a6 ' })
  FundManagerId: string;
}
export class fundProjectWalletByVaultDto {
  @IsDefined()
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 2399000 })
  amount: number;
}

export class fundProjectWalletDto {
  @IsDefined()
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 2399000 })
  amount: number;

  @ApiProperty({ example: 'BANK_TRANSFER' })
  @IsEnum(PaymentMethod)
  @IsDefined()
  paymentMethod?: PaymentMethod;

  @ApiProperty({ example: 'FUND_PROJECT_WALLET' })
  @IsEnum(SystemPaymentPurpose)
  @IsDefined()
  paymentPurpose?: SystemPaymentPurpose;

  @IsOptional()
  @IsString()
  @IsUUID()
  @ApiProperty({ example: '83d6b8c0-1854-423b-8d0e-87a1faa5a5a6 ' })
  orderId: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  @ApiProperty({ example: '83d6b8c0-1854-423b-8d0e-87a1faa5a5a6 ' })
  projectId: string;
}
