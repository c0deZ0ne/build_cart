import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ example: 'joshua@abc.com' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'password123456' })
  password: string;
}

export class LoginWithSSODto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ example: 'joshua@abc.com' })
  email: string;
}
