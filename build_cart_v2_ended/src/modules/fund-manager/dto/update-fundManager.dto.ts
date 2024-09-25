import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { randomUUID } from 'crypto';

export class UpdateRegisterFundManagerDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Dogubo Joshua' })
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @IsEmail()
  @ApiProperty({ example: 'example@example.com' })
  email: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Best FundManager 2023' })
  about: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Abcd123456' })
  password: string;

  @ApiProperty({ example: '+234 000 000 0000' })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  phone: string;

  @ApiProperty({ example: '13b oginigba trans-Amad ' })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  address: string;

  @ApiProperty({
    example:
      'https://res.cloudinary.com/dzobanav8/image/upload/v1689088952/logo_mvt3z0.png',
  })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  logo: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Nigeria' })
  country: string;

  @ApiProperty({ example: 'Dogubo Joshua' })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  contactName: string;

  @ApiProperty({ example: '+234 000 000 0000' })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  contactPhone: string;

  @ApiProperty({ example: 'example@domain.com' })
  @IsNotEmpty({ message: 'Email address should not be empty' })
  @IsString({ message: 'Email address should be a string' })
  @IsOptional()
  @IsEmail({}, { message: 'Invalid email address format' })
  contactEmail: string;
}

export class AddBuilderToFundManagersDto {
  @ApiProperty({ example: [randomUUID(), randomUUID()] })
  @IsArray()
  buildersId: string[];
}
