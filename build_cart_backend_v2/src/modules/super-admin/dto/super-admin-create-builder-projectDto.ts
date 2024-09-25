import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class superAdminCreateBuilderProjectDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ example: '1a450751-bb39-4b00-9c39-e508a6a23e46' })
  fundManagerId: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'project description' })
  description: string;

  @IsDefined()
  @IsString()
  @ApiProperty({ example: 'project title' })
  title: string;

  @IsDefined()
  @IsString()
  @ApiProperty({ example: 'project title' })
  image: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'project title' })
  fileName: string;

  @IsDefined()
  @IsString()
  @ApiProperty({ example: 'project lovation' })
  location: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'message for the invitee' })
  message: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'invitee email address' })
  inviteeEmail: string;

  @IsDefined()
  @IsString()
  @ApiProperty({ example: '2024-01-28T20:07:22.602Z' })
  startDate: Date;

  @IsDefined()
  @IsString()
  @ApiProperty({ example: '2024-01-28T20:07:22.602Z' })
  endDate: Date;
}
