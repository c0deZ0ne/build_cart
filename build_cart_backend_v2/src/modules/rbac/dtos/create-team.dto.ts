import { IsNotEmpty, IsUUID, IsOptional, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTeamDto {
  @ApiProperty({ type: String, description: 'Name of the team' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ type: String, description: 'Created By User ID' })
  @IsOptional()
  @IsUUID()
  createdById?: string;

  @ApiProperty({ type: String, description: 'Owner User ID' })
  @IsNotEmpty()
  @IsUUID()
  ownerId: string;

  @ApiProperty({ type: String, description: 'Updated By User ID' })
  @IsOptional()
  @IsUUID()
  updatedById?: string;
}
