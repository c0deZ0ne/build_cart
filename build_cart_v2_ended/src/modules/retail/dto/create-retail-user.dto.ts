import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class CreateRetailUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'John Doe' })
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'john_doe@mailer.com' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber()
  @ApiProperty({ example: '+2349123456789' })
  phone: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Cement' })
  enquiry: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ example: true })
  is_phone_number_on_whatsapp: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ example: true })
  can_receive_marketing_info: boolean;
}
