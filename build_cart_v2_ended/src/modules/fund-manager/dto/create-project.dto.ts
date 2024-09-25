import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { randomUUID } from 'crypto';
import { CreateProjectDto } from 'src/modules/builder/dto/create-project.dto';
import { ProjectDto } from 'src/modules/project/dto/create-project.dto';
import { CreateGroupNameDto } from 'src/modules/project/dto/creeate-group.dto';
import { ProjectStatus } from 'src/modules/project/models/project.model';

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
export { CreateProjectDto };

export class SponsorCreateProjectDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Third mainland bridge construction' })
  title: string;

  @IsOptional()
  @ApiProperty({ example: new Date() })
  startDate?: Date;

  @IsOptional()
  @ApiProperty({ example: new Date() })
  endDate?: Date;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @ApiProperty({ example: '12 azumini lagos Nigeria' })
  location: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @ApiProperty({ example: randomUUID() })
  contractorId?: string;
}

export class fundManagerCreateProjectDto extends ProjectDto {
  @IsOptional()
  // @IsUUID('4', { each: false })
  @ApiPropertyOptional({
    example: [
      'd1f2c3d5-b720-4e11-b678-678d876e3456',
      'a2b1c3d4-e123-4c67-8a90-098b765c43ef',
    ],
  })
  newDevelopers: string[];
  @IsOptional()
  // @IsUUID('4', { each: false })
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
