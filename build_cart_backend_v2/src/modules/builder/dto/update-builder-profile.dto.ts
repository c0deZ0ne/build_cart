import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUrl,
} from 'class-validator';
import { randomUUID } from 'crypto';
import { BusinessSize } from 'src/modules/vendor/models/vendor.model';

export class UpdateBuilderProfileDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Dealers of quality plumbing pipes' })
  about?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Makintosh Plastics' })
  businessName?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'B Adewale Kolawole Crescent, Lekki - Lagos' })
  businessAddress?: string;

  @ApiProperty({ example: 'MEDIUM' })
  @IsEnum(BusinessSize)
  @IsOptional()
  businessSize?: BusinessSize | null;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'https://example.com/logo.png' })
  BankStatement?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: '4MNJ4000AGHZMJ9' })
  businessRegNo?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'https://example.com/utility.png' })
  UtilityBill?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: true })
  isIndividual?: boolean;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'https://example.com/certi.png' })
  certificateOfLocation?: string;

  @ApiProperty({ example: 'certificateOfIncorpaoration.pdf', required: false })
  @IsOptional()
  certificateOfIncorporation: string;

  @ApiProperty({ example: 'BusinessContactId.pdf', required: false })
  @IsOptional()
  BusinessContactId: string;

  @ApiProperty({ example: 'BusinessContactSignature.pdf', required: false })
  @IsOptional()
  BusinessContactSignature: string;

  @IsString()
  @IsOptional()
  @IsUrl()
  @ApiProperty({ example: 'https://example.com/logo.png' })
  logo?: string;
}

export class AdminUpdateBuilderProfileDto extends UpdateBuilderProfileDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'praise name' })
  name?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: '3440404040' })
  businessAddress?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: '3440404040' })
  businessRegNo?: string;
}

export class AddFundManagersToBuilderDto {
  @ApiProperty({ example: [randomUUID(), randomUUID()] })
  @IsArray()
  fundmanagersId: string[];
}
