import {
  IsOptional,
  IsString,
  IsNumber,
  IsDateString,
  IsUUID,
  isUUID,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  BaseProjectDocumentUploadDto,
  BaseProjectMediaUploadDto,
} from 'src/modules/builder/dto/create-project-media.dto';
import { CreateGroupNameDto } from './creeate-group.dto';
import { randomUUID } from 'crypto';

export class ProjectDto {
  @IsString()
  @ApiProperty({ example: 'Project Location', required: true })
  location: string;

  @IsOptional()
  projectMedia?: BaseProjectMediaUploadDto[] | null;

  @IsOptional()
  projectDocuments?: BaseProjectDocumentUploadDto[] | null;

  @IsDateString()
  @ApiProperty({ example: '2023-01-01T12:00:00.000Z', required: true })
  startDate: Date;

  @IsDateString()
  @ApiProperty({ example: '2023-12-31T12:00:00.000Z', required: true })
  endDate: Date;

  @IsString()
  @ApiProperty({ example: 'Project Title', required: true })
  title: string;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({ example: 50000 })
  budgetAmount: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Project description', required: false })
  description?: string;
}

export class BaseProjectDto extends ProjectDto {
  @IsOptional()
  @IsUUID('4', { each: true })
  @ApiPropertyOptional({
    example: [
      '52cefa55-5371-4e61-a501-4d7ccf67c8f2',
      'f508db8b-5b86-4042-9a88-837df442f70d',
    ],
  })
  newFundManagers: string[];

  @IsOptional()
  @ApiPropertyOptional({
    example: [
      'd1f2c3d5-b720-4e11-b678-678d876e3456',
      'a2b1c3d4-e123-4c67-8a90-098b765c43ef',
    ],
  })
  newDevelopers: string[];

  @IsOptional()
  @IsUUID('4', { each: true })
  @ApiPropertyOptional({
    example: [
      'd1f2c3d5-b720-4e11-b678-678d876e3456',
      'a2b1c3d4-e123-4c67-8a90-098b765c43ef',
    ],
  })
  groupIds: string[];

  @IsOptional()
  @ApiProperty({ type: CreateGroupNameDto })
  newGroupCreateInfo: CreateGroupNameDto | null;
}

export class updateProjectDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Project Location' })
  location: string;

  @IsOptional()
  projectMedia?: BaseProjectMediaUploadDto[] | null;

  @IsDateString()
  @ApiProperty({ example: '2023-01-01T12:00:00.000Z' })
  startDate: Date;

  @IsDateString()
  @ApiProperty({ example: '2023-12-31T12:00:00.000Z' })
  endDate: Date;

  @IsString()
  @ApiProperty({ example: 'Project Title' })
  title: string;

  @IsOptional()
  @IsUUID('4', { each: true })
  @ApiPropertyOptional({
    example: [
      '52cefa55-5371-4e61-a501-4d7ccf67c8f2',
      'f508db8b-5b86-4042-9a88-837df442f70d',
    ],
  })
  newFundManagers: string[];
}

export class DeleteProjectDocumentDto {
  @IsOptional()
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Unique identifier of the project Media: Optional',
    example: randomUUID(),
  })
  projectMediaId?: string;

  @IsOptional()
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Unique identifier of the project Media: Optional',
    example: randomUUID(),
  })
  projectDocumentId?: string;
}
