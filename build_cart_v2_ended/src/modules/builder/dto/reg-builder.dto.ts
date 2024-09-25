import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsDateString,
  IsUUID,
  IsDefined,
  IsString,
  IsUrl,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BusinessSize } from 'src/modules/vendor/models/vendor.model';
import { CreditStatus, BuilderTier } from '../models/builder.model';
import { randomUUID } from 'crypto';
import { MediaType } from '../models/builder-portfolio-media';

export class NewBuilderDto {
  @ApiProperty({ example: randomUUID() })
  @IsDefined()
  UserId: string;

  @ApiProperty({ example: '123 Main St, City vile' })
  @IsOptional()
  @IsNotEmpty()
  businessAddress?: string | null;

  @ApiProperty({ enum: BusinessSize, example: 'LARGE', required: false })
  @IsOptional()
  @IsEnum(BusinessSize)
  businessSize: BusinessSize;

  @ApiProperty({ example: '123-456-789', required: false })
  @IsOptional()
  businessRegNo: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isIndividual: boolean;

  @ApiProperty({ example: 'company_logo.png', required: false })
  @IsOptional()
  logo: string;

  @ApiProperty({ example: 'We build dreams!', required: false })
  @IsOptional()
  about: string;
}

export class BasePortFolioDto {
  @ApiProperty({ example: 'We build dreams!', required: false })
  @IsOptional()
  title: string;

  @ApiProperty({
    example: 'We started from the bottom, now we are here!',
    required: false,
  })
  @IsOptional()
  about: string;

  @ApiProperty({
    example: 'We started from the bottom, now we are here!',
    required: false,
  })
  @IsOptional()
  description: string;
}

export class BuilderPortFolioDto extends BasePortFolioDto {
  @IsOptional()
  portFolioMedias?: BasePortFolioMediaUploadDto[] | null;
}

export class BasePortFolioMediaUploadDto {
  @ApiProperty({
    description: 'URL of the media',
    example: 'https://example.com/media.jpg',
  })
  @IsDefined()
  @IsUrl()
  url: string;

  @ApiProperty({
    description: 'Title of the media',
    example: 'Media Title',
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    description: 'Description of the media',
    example: 'Media Description',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Media userType',
    enum: MediaType,
    example: 'IMAGE',
  })
  @IsDefined()
  @IsEnum(MediaType)
  mediaType: MediaType;
}
export class AddPortFolioMediaDTO extends BasePortFolioMediaUploadDto {
  @ApiProperty({
    description: 'Unique identifier of the portfolio',
    example: randomUUID(),
  })
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  portFolioId: string;
}

export class UpdatePortFolioDTO extends BasePortFolioDto {
  @ApiProperty({
    description: 'Unique identifier of the portfolio',
    example: randomUUID(),
  })
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  portFolioId: string;
}

export class updateBuilderDto extends NewBuilderDto {
  @ApiProperty({ example: 'CertificateOfLocation.pdf', required: false })
  @IsOptional()
  certificateOfLocation: string;

  @ApiProperty({ example: 'BankStatement.pdf', required: false })
  @IsOptional()
  BankStatement: string;

  @ApiProperty({ example: 'UtilityBill.pdf', required: false })
  @IsOptional()
  UtilityBill: string;
}

export class AdminUpdatedBuilder extends NewBuilderDto {
  @ApiProperty({ enum: BuilderTier, example: 'two' })
  @IsEnum(BuilderTier)
  tier: BuilderTier;

  @ApiProperty({ example: '123-456-789', required: false })
  @IsOptional()
  businessRegNo: string;

  @ApiProperty({ enum: CreditStatus, example: 'APPROVED' })
  @IsEnum(CreditStatus)
  @IsOptional()
  creditStatus: CreditStatus;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isBusinessVerified: boolean;
}
