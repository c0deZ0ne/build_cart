import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class superAdminUpdateProfileDto {
  @IsString()
  @IsOptional()
  @IsEmail()
  @ApiProperty({ example: 'builder@cutstruct.com' })
  email: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'https://cloundinary.com' })
  image: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Andrew Allison' })
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: '+2348000000000' })
  phone: string;
}

export class superAdminUpdatePasswordDto {
  @IsString()
  @IsDefined()
  @ApiProperty({ example: 'password' })
  oldPassword: string;

  @IsString()
  @IsDefined()
  @ApiProperty({ example: 'password12' })
  newPassword: string;
}

export class superAdminRequest2faDto {
  @IsString()
  @IsDefined()
  @IsEmail()
  @ApiProperty({ example: 'builder@cutstruct.com' })
  email: string;
}

export class superAdminSetup2faDto {
  @IsNumber()
  @IsDefined()
  @ApiProperty({ example: 125378 })
  otp: number;
}
