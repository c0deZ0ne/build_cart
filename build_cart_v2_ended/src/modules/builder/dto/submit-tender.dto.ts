import { IsString, IsOptional, IsUUID, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MediaType } from 'src/modules/project-media/models/project-media.model';

export class TenderBidDto {
  @ApiProperty({ required: false, example: 'Description of the bid' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    required: true,
    type: 'array',
    name: 'documents',
    items: { type: 'object' },
    example: [
      {
        title: 'Document Title',
        url: 'https://example.com',
        type: MediaType.FILE,
      },
      {
        title: 'Document Title',
        url: 'https://example.com',
        type: MediaType.VIDEO,
      },
      {
        title: 'Document Title',
        url: 'https://example.com',
        type: MediaType.IMAGE,
      },
    ],
  })
  documents?: Array<{ title: string; url: string; type: MediaType }> | null;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174001' })
  @IsUUID()
  ProjectId: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174002' })
  @IsUUID()
  ProjectTenderId: string;
}
