import {
  IsUUID,
  IsOptional,
  IsString,
  IsEnum,
  IsDateString,
  IsDefined,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsUrl } from 'class-validator';
import { randomUUID } from 'crypto';

enum MediaType {
  VIDEO = 'VIDEO',
  IMAGE = 'IMAGE',
  FILE = 'FILE',
}

export class BaseProjectDocumentUploadDto {
  @ApiProperty({
    description: 'URL of the media',
    example: 'https://example.com/media.jpg',
  })
  @IsDefined()
  @IsNotEmpty()
  @IsUrl()
  url?: string;

  @ApiProperty()
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  businessCertificate?: string;

  @ApiProperty()
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  vatCertificate?: string;

  @ApiProperty()
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  insuranceCertificate?: string;

  @ApiProperty()
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  proofOfIdentity?: string;

  @ApiProperty()
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  confirmationOfAddress?: string;

  @ApiProperty({
    description: 'Description (optional)',
    example: 'This is a document description.',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Title of the document',
    example: 'Project Image',
  })
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  title?: string;
}

export class BaseProjectMediaUploadDto {
  @ApiProperty({
    description: 'URL of the media',
    example: 'https://example.com/media.jpg',
  })
  @IsDefined()
  @IsNotEmpty()
  @IsUrl()
  url?: string;

  @ApiProperty({
    description: 'Title of the media',
    example: 'Project Image',
  })
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  title?: string;

  @ApiProperty({
    description: 'Media userType',
    enum: MediaType,
    example: 'IMAGE',
  })
  @IsDefined()
  @IsEnum(MediaType)
  mediaType: MediaType;

  @ApiProperty({
    description: 'Description (optional)',
    example: 'This is a media description.',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
export class AddProjectMediaDTO extends BaseProjectMediaUploadDto {
  @ApiProperty({
    description: 'Unique identifier of the project',
    example: randomUUID(),
  })
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  ProjectId: string;
}
