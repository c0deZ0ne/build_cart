import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class UploadDocumentsDto {
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  @ApiProperty({ example: 'https://cloudinary.com' })
  businessCertificate: string;

  @IsString()
  @IsNotEmpty()
  @IsUrl()
  @ApiProperty({ example: 'https://cloudinary.com' })
  vatCertificate: string;

  @IsString()
  @IsNotEmpty()
  @IsUrl()
  @ApiProperty({ example: 'https://cloudinary.com' })
  insuranceCertificate: string;

  @IsString()
  @IsNotEmpty()
  @IsUrl()
  @ApiProperty({ example: 'https://cloudinary.com' })
  proofOfIdentity: string;

  @IsNotEmpty()
  @IsUrl()
  @ApiProperty({ example: 'https://cloudinary.com' })
  confirmationOfAddress: string;
}
