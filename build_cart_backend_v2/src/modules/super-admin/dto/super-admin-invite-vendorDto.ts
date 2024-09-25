import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class superAdminInviteVendorDto {
  @IsNotEmpty()
  @IsString()
  @IsDefined()
  @IsEmail()
  @ApiProperty({ example: 'fundManager@cutstruct.com' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @IsDefined()
  @ApiProperty({ example: 'dele@gmail.com' })
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

export class AdminUploadDocumentsDto {
  @IsString()
  @IsOptional()
  @IsUrl()
  @ApiProperty({ example: 'https://cloudinary.com' })
  businessCertificate: string;

  @IsString()
  @IsOptional()
  @IsUrl()
  @ApiProperty({ example: 'https://cloudinary.com' })
  vatCertificate: string;

  @IsString()
  @IsOptional()
  @IsUrl()
  @ApiProperty({ example: 'https://cloudinary.com' })
  insuranceCertificate: string;

  @IsString()
  @IsUrl()
  @IsOptional()
  @ApiProperty({ example: 'https://cloudinary.com' })
  proofOfIdentity: string;

  @IsString()
  @IsOptional()
  @IsUrl()
  @ApiProperty({ example: 'https://cloudinary.com' })
  confirmationOfAddress: string;
}
