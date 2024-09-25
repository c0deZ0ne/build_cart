import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { BusinessSize } from 'src/modules/vendor/models/vendor.model';

export class superAdminCreateBuilderDto {
  @IsNotEmpty()
  @IsString()
  @IsDefined()
  @IsEmail()
  @ApiProperty({ example: 'builder@cutstruct.com' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @IsDefined()
  @ApiProperty({ example: 'Eazy concept' })
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

export class UpdateBuilderDto {
  @ApiProperty({ example: 'A1-234566' })
  @IsString({ message: 'business reg number should be a string' })
  @IsOptional()
  businessRegNo: string;

  @ApiProperty({ example: 'MICRO' })
  @IsString({ message: 'business size should be a string' })
  @IsOptional()
  businessSize: BusinessSize;

  @ApiProperty({ example: '2 waka street makurdi' })
  @IsString({ message: 'business address should be a string' })
  @IsOptional()
  businessAddress: string;
}
