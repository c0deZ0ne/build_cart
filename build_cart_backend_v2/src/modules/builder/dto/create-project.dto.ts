import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { randomUUID } from 'crypto';
import { ProjectDto } from 'src/modules/project/dto/create-project.dto';
import { ProjectStatus } from 'src/modules/project/models/project.model';

export class CreateProjectDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Third mainland bridge construction',
    required: true,
  })
  title: string;

  @ApiProperty({ example: new Date(), required: true })
  startDate: Date;

  @ApiProperty({ example: new Date(), required: true })
  endDate: Date;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '12 azumini lagos Nigeria', required: true })
  location: string;
}

export class SapmleResponseCreateProjectDto extends CreateProjectDto {
  @IsNotEmpty()
  @ApiProperty({ example: '273915ac-5c90-4207-9a30-bf5b5c4ee70d' })
  CreatedBy?: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '273915ac-5c90-4207-9a30-bf5b5c4ee70d' })
  BuilderId?: string | null;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '273915ac-5c90-4207-9a30-bf5b5c4ee70d' })
  FundManagerId?: string | null;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: ProjectStatus.ACTIVE })
  status?: ProjectStatus.ACTIVE;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 200 })
  amountSpent?: number | null;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 200 })
  budgetAmount?: number | null;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 200 })
  amountLeft?: number | null;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: new Date().toISOString() })
  migratedAt?: Date | null;
}

export class BuilderCreateProjectDto extends ProjectDto {
  @IsOptional()
  @ApiPropertyOptional({
    example: [
      'd1f2c3d5-b720-4e11-b678-678d876e3456',
      'alex@gmail',
      'a2b1c3d4-e123-4c67-8a90-098b765c43ef',
      'ade@mailinator'
    ],
  })
  newFundManagers: string[];
}

export class FundOrderDto {
  @IsNumber()
  @IsDefined()
  @ApiProperty({ example: 200 })
  amount: number;
}
