import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class superAdminCreateFundManagerDto {
  @IsNotEmpty()
  @IsString()
  @IsDefined()
  @IsEmail()
  @ApiProperty({ example: 'fundManager@cutstruct.com' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @IsDefined()
  @ApiProperty({ example: 'Gath Enterprise' })
  businessName: string;

  @IsNotEmpty()
  @IsString()
  @IsDefined()
  @ApiProperty({ example: 'Andrew Allison' })
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsDefined()
  @ApiProperty({ example: '+2348000000000' })
  phone: string;
}
