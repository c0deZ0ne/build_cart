import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDefined,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

import { randomUUID } from 'crypto';
import {
  BusinessSize,
  VendorType,
  VendorStatus,
} from 'src/modules/vendor/models/vendor.model';

export class AdminRegisterVendorDto {
  @ApiProperty({ example: 'LARGE' })
  @IsEnum(BusinessSize)
  @IsOptional()
  businessSize: BusinessSize;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Splenzert International' })
  businessName?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'cac_12678905' })
  businessRegNo?: string;
  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'off white house ' })
  businessAddress?: string;

  @IsDefined()
  @IsEnum(VendorType)
  @ApiProperty({ example: `${Object.values(VendorType).toLocaleString()}` })
  VendorType?: VendorType;

  @IsString({ message: 'provide a string datatype' })
  @IsOptional({ message: 'your NIN is requred or any natitional ID Number' })
  @ApiProperty({ example: 'https://example.com/document.png' })
  certificateOfLocation?: string | null;

  @IsString({ message: 'provide a string datatype' })
  @IsOptional({ message: 'Please provide a bank statement' })
  @ApiProperty({ example: 'https://example.com/document.png' })
  BankStatement?: string | null;

  @IsString({ message: 'provide a string datatype' })
  @ApiProperty({ example: 'https://example.com/document.png' })
  UtilityBill?: string | null;

  @IsString({ message: 'provide a string datatype' })
  @IsOptional()
  @ApiProperty({ example: 'https://example.com/document.png' })
  logo?: string | null;

  @ApiProperty({ example: 'About the vendor...' })
  @IsString()
  @IsOptional()
  about?: string | null;
}
