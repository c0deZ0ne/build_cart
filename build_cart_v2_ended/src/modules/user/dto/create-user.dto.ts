import {
  IsBoolean,
  IsDefined,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserLevel, UserStatus, UserType } from '../models/user.model';
import { UpdatePasswordDto } from './update-password.dto';

export class CreateUserDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({
    description: 'enter Business name',
    example: 'Eco Hotel',
  })
  businessName: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'User name', example: 'Dogubo Joshua' })
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ description: 'User email', example: 'joshua@user.com' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'User password', example: 'password123456' })
  password: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'User name', example: '+2348123445678' })
  phoneNumber: string;

  @IsBoolean()
  @IsDefined()
  @ApiProperty({ description: 'User name', example: true })
  acceptTerms: boolean;

  @ApiProperty({ example: 'BUILDER' })
  @IsEnum(UserType)
  @IsOptional()
  userType?: UserType | null;

  @ApiProperty({ example: 'http://res...' })
  @IsOptional()
  logo?: string;
}

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({
    description: 'enter Business name',
    example: 'Eco Hotel',
  })
  businessName: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Phone Number', example: '+2348123445678' })
  phoneNumber: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'User location' })
  location: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'User name' })
  name: string;
}
