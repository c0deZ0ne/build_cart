import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

export class VerifyEmailDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 123456 })
  emailOtp: number;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'joshua@abc.com' })
  email: string;
}
