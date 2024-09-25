import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum } from 'class-validator';
import { randomUUID } from 'crypto';
import { MediaType } from 'src/modules/project-media/models/project-media.model';

export class GetProjectMediaDto {
  @IsOptional()
  @IsString()
  @IsEnum(MediaType)
  @ApiProperty({ example: 'VIDEO' })
  VIDEO?: MediaType;

  @IsOptional()
  @IsString()
  @IsEnum(MediaType)
  @ApiProperty({ example: 'FILE' })
  FILE?: MediaType;

  @IsOptional()
  @IsString()
  @IsEnum(MediaType)
  @ApiProperty({ example: 'IMAGE' })
  IMAGE?: MediaType;

  @IsString()
  @ApiProperty({ example: randomUUID() })
  projectId: string;
}
