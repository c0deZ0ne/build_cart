import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class ResetPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'joshua@abc.com' })
  email: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 123456 })
  resetPasswordOtp: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  @ApiProperty({ example: 'password123456' })
  password: string;
}
