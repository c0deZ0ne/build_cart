import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { BusinessSize } from '../models/vendor.model';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateLegalDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'praise holdings' })
  tradingName: string;

  @IsEnum(BusinessSize)
  businessSize: BusinessSize;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '111111111' })
  registrationNumber: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'B Adewale Kolawole Crescent, Lekki - Lagos' })
  address: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Nigeria' })
  country: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Lagos' })
  state: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @ApiProperty({ example: ['Logistics', 'Cement'], nullable: false })
  categories: string[];

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Praise' })
  contactName: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'praise@contact.com' })
  contactEmail: string;

  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber()
  @ApiProperty({ example: '+23440404040' })
  contactPhone: string;
}
