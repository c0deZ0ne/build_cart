import { IsString, IsOptional, IsUUID, IsDate } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateGroupNameDto {
  @ApiProperty({
    example: 'A sample group name',
    description: 'The description of the group name',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 'Sample Group',
    description: 'The name of the group',
  })
  @IsOptional()
  @IsString()
  name?: string;
}

export class EditProjectGroupDto {
  @IsUUID()
  groupId?: string;

  @ApiProperty({
    example: 'A sample group name',
    description: 'The description of the group name',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 'Sample Group',
    description: 'The name of the group',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsUUID('4', { each: true })
  @ApiPropertyOptional({
    example: [
      'd1f2c3d5-b720-4e11-b678-678d876e3456',
      'a2b1c3d4-e123-4c67-8a90-098b765c43ef',
    ],
  })
  projectIds: string[];
}

export class CreateNewGroupAddToProjectDto extends CreateGroupNameDto {
  @IsOptional()
  @IsUUID()
  projectId?: string;
}

export class AddExistingGroupToProjectDto {
  @IsUUID()
  groupId: string;

  @IsUUID()
  projectId: string;
}
