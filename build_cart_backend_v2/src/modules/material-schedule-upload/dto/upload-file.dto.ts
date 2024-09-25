import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class UploadFileDto {
  @ApiProperty({ type: 'string', format: 'binary', example: 'csv file' })
  materialSchedule: string;

  @IsString()
  @ApiProperty({ example: 'Material Schedule Title' })
  title: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'https://example.com/csvfile.csv' })
  csvUrl?: string;

  @IsUUID()
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174001' })
  ownerId: string;

  @IsUUID()
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174002' })
  ProjectId: string;

  // @ApiProperty({
  //   type: 'array',
  //   name: 'materials',
  //   items: { type: 'object' },
  //   example: [
  //     { name: 'cement', category: 'cement', budget: 20000 },
  //     { name: 'GooglePPe', category: 'Health and safety', budget: 40000 },
  //   ],
  // })
  // materials: Array<any>;
}
