import {
  IsDefined,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { SharedProjectStatus } from '../models/shared-project.model';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSharedProjectDto {
  @IsNotEmpty()
  @IsEmail()
  @IsDefined()
  @ApiProperty({ example: 'joshua.dogubo@gmail.com' })
  email: string;

  @IsEmail()
  @IsOptional()
  @ApiProperty({ example: 'builder@custruct.com' })
  buyerEmail?: string;

  @IsEmail()
  @IsOptional()
  @ApiProperty({ example: 'fundManager@custruct.com' })
  fundManagerEmail?: string;

  @IsOptional()
  @IsEnum(SharedProjectStatus)
  @ApiProperty({ example: 'PENDING,ACCEPTED or DECLINED' })
  status: SharedProjectStatus;

  @IsOptional()
  @ApiProperty({ example: '83d6b8c0-1854-423b-8d0e-87a1faa5a5a6 ' })
  FundManagerId?: string;

  @IsOptional()
  @ApiProperty({ example: '83d6b8c0-1854-423b-8d0e-87a1faa5a5a6 ' })
  BuilderId?: string;

  @IsNotEmpty()
  @IsDefined()
  @ApiProperty({ example: '83d6b8c0-1854-423b-8d0e-87a1faa5a5a6 ' })
  ProjectId: string;

  @IsOptional()
  @ApiProperty({ example: '83d6b8c0-1854-423b-8d0e-87a1faa5a5a6' })
  CreatedById: string;
}
