import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDefined,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { randomUUID } from 'node:crypto';
import { UserType } from 'src/modules/user/models/user.model';

export class RegisterFundManagerDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: randomUUID() })
  UserId: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Dogubo Joshua' })
  businessName: string;

  @IsNotEmpty()
  @IsString()
  @IsDefined()
  @IsEmail()
  @ApiProperty({ example: 'joshua@fundManager.com' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'abc_1234' })
  businessRegNo: string;

  @IsNotEmpty()
  @IsDefined()
  @IsString()
  @IsDefined()
  @ApiProperty({ example: 'password123456' })
  password: string;

  @IsOptional()
  @ApiProperty({ example: 'Best FundManager 2023' })
  about: string | null;

  @ApiProperty({ example: '+234 000 000 0000' })
  @IsString()
  @IsOptional()
  phoneNumber: string | null;

  @ApiProperty({ example: '13b oginigba trans-Amad ' })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  businessAddress: string;

  @ApiProperty({
    example:
      'https://res.cloudinary.com/dzobanav8/image/upload/v1689088952/logo_mvt3z0.png',
  })
  @IsString()
  @IsOptional()
  logo: string | null;

  @IsBoolean()
  @IsDefined()
  @ApiProperty({ description: 'User name', example: true })
  acceptTerms: boolean;

  @ApiProperty({ example: 'FUND_MANAGER' })
  @IsEnum(UserType)
  @IsOptional()
  userType?: UserType | null;
}
