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
import { BusinessSize, VendorStatus, VendorType } from '../models/vendor.model';

export class RegisterVendorDto {
  @ApiProperty({ example: randomUUID() })
  @IsUUID()
  UserId: string;

  @ApiProperty({ example: 'LARGE' })
  @IsEnum(BusinessSize)
  @IsOptional()
  businessSize?: BusinessSize | null;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Splenzert International' })
  businessName?: string;

  @IsOptional()
  @ApiProperty({ example: ' https://example.com/document.png' })
  businessContactSignature?: string | null;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'avior VI' })
  businessAddress?: string | null;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'bid' })
  businessContactId?: string | null;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'cac_12678905' })
  businessRegNo: string | null;

  @IsDefined()
  @IsEnum(VendorType)
  @ApiProperty({ example: `${Object.values(VendorType).toLocaleString()}` })
  VendorType?: VendorType;

  @IsOptional()
  @ApiProperty({ example: 'https://example.com/document.png' })
  certificateOfIncorporation?: string | null;

  @IsOptional()
  @ApiProperty({ example: 'https://example.com/document.png' })
  other?: string | null;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'https://example.com/document.png' })
  UtilityBill?: string | null;

  @IsOptional()
  @ApiProperty({ example: 'https://example.com/document.png' })
  logo?: string | null;

  @ApiProperty({ example: [randomUUID(), randomUUID()] })
  @IsArray()
  @IsOptional()
  categories?: string[];

  @ApiProperty({ example: 'About the vendor...' })
  @IsString()
  @IsOptional()
  about?: string | null;
}
