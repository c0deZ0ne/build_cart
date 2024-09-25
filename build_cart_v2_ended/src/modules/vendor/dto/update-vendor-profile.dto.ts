import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { BusinessSize, VendorType } from '../models/vendor.model';
import { ApiProperty } from '@nestjs/swagger';
import { randomUUID } from 'crypto';

export class UpdateVendorProfileDto {
  @IsString()
  @IsOptional()
  @IsEnum(BusinessSize)
  businessSize?: BusinessSize;

  @IsString()
  @IsOptional()
  businessContactId?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'B Adewale Kolawole Crescent, Lekki - Lagos' })
  businessAddress?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: '+23440404040' })
  phone?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Joshua Dogubo' })
  name?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Dealers of quality plumbing pipes' })
  about?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'business email' })
  email?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Lagos Abuja' })
  location?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'https://example.com/logo.png' })
  @IsUrl()
  logo?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'https://example.com/logo.png' })
  @IsUrl()
  certificateOfLocation?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'https://example.com/logo.png' })
  @IsUrl()
  certificateOfIncorporation?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'https://example.com/logo.png' })
  @IsUrl()
  UtilityBill?: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ example: true })
  twoFactorAuthEnabled?: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ example: true })
  smsNotificationEnabled?: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ example: true })
  emailNotificationEnabled?: boolean;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @ApiProperty({
    example: ['https://example.com/sign.png', 'https://example.com/sign.png'],
    nullable: true,
  })
  signatures?: string[];
}
export class UpdateVendorDocuments {
  @ApiProperty({
    example: 'https://example.com/pin_document.pdf',
    description: 'NIN Document URL.',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsUrl()
  PIN_DocumentURl: string | null;

  @ApiProperty({
    example: 'https://example.com/certificate_location.pdf',
    description: 'Certificate of Location document.',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsUrl()
  CertificateOfLocation: string | null;

  @ApiProperty({
    example: 'https://example.com/business_name_doc.pdf',
    description: 'Business Name document.',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsUrl()
  BusinessNameDoc: string | null;

  @ApiProperty({
    example: 'https://example.com/bank_statement.pdf',
    description: 'Bank Statement document.',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsUrl()
  BankStatement: string | null;

  @ApiProperty({
    example: 'https://example.com/utility_bill.pdf',
    description: 'Utility Bill document.',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsUrl()
  UtilityBill: string | null;
}

export class UpdateVendorCategoryDto {
  @IsArray()
  @IsString({ each: true })
  @ApiProperty({ example: [randomUUID(), randomUUID()], nullable: false })
  RfqCategories?: string[];
}
export class DeleteVendorCategoryDto {
  @IsArray()
  @IsString()
  @ApiProperty({ example: randomUUID() })
  categoryId?: string;
}

export class AdminUpdateVendorProfileDto extends UpdateVendorProfileDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'praise company' })
  businessName?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: '3440404040' })
  businessRegNo?: string;

  @IsString()
  @IsOptional()
  @IsEnum(VendorType)
  vendorType?: VendorType;
}
