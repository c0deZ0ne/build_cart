import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class ActivateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'joshua@abc.com' })
  email: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 123456 })
  emailOtp: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  @ApiProperty({ example: 'password123456' })
  password: string;
}
