import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDefined,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

import { randomUUID } from 'crypto';
import { BusinessSize } from 'src/modules/vendor/models/vendor.model';

export class CreateBuilderDto {
  @ApiProperty({ example: randomUUID() })
  @IsUUID()
  @IsDefined()
  UserId: string;

  @IsString()
  @IsDefined()
  @ApiProperty({ example: 'John Doe' })
  name: string;

  @IsEmail()
  @IsDefined()
  @ApiProperty({ example: 'builder@example.com' })
  email: string;

  @IsBoolean()
  @IsDefined()
  @ApiProperty({ example: true })
  isIndividual: boolean;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: '+1234567890' })
  phone?: string | null;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'About the builder' })
  about?: string | null;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Splenzert International' })
  companyName?: string | null;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'lagos nigeria' })
  companyLocation?: string | null;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'cac_12678905' })
  RC_Number?: string | null;

  @IsString({ message: 'provide a string datatype' })
  @IsOptional({ message: 'your NIN is requred or any natitional ID Number' })
  @ApiProperty({ example: '123457678' })
  PIN?: string | null;

  @IsString({ message: 'provide a string datatype' })
  @IsOptional({ message: 'your NIN is requred or any natitional ID Number' })
  @ApiProperty({ example: 'https://example.com/document.png' })
  PIN_DocumentURl?: string | null;

  @IsString({ message: 'provide a string datatype' })
  @IsOptional({ message: 'your NIN is requred or any natitional ID Number' })
  @ApiProperty({ example: 'https://example.com/document.png' })
  CertificateOfLocation?: string | null;

  @IsString({ message: 'provide a string datatype' })
  @IsOptional({ message: 'your NIN is requred or any natitional ID Number' })
  @ApiProperty({ example: 'https://example.com/document.png' })
  BusinessNameDoc?: string | null;

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

  @ApiProperty({ example: 'United States' })
  @IsString()
  @IsOptional()
  country?: string | null;

  @ApiProperty({ example: 'California' })
  @IsString()
  @IsOptional()
  state?: string | null;

  @ApiProperty({ example: 'Finance' })
  @IsOptional()
  categories?: string | null;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsOptional()
  contactName?: string | null;

  @ApiProperty({ example: '9876543210' })
  @IsString()
  @IsOptional()
  contactPhone?: string | null;

  @ApiProperty({ example: 'john.doe@example.com' })
  @IsString()
  @IsOptional()
  contactEmail?: string | null;

  @ApiProperty({ example: false })
  @IsBoolean()
  @IsOptional()
  legalInfo?: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsOptional()
  taxCompliance?: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsOptional()
  racialEquity?: boolean;
}
