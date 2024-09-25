import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsArray,
} from 'class-validator';

export class CreateTemporaryVendorDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'John Doe' })
  companyName: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'john_doe@mailer.com' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '+2349123456789' })
  phone: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Nigeria' })
  country: string;

  @IsArray()
  @IsOptional()
  @ApiProperty({ example: ['Cement'] })
  categories: string[];
}
