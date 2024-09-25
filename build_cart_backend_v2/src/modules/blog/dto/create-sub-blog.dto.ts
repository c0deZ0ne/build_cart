import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class SubBlogDto {
  @IsString()
  @MaxLength(200000)
  @ApiProperty({
    example: 'Reinforced Steel',
  })
  subTitle: string;

  @IsString()
  @MaxLength(200000)
  @ApiProperty({ example: 'Reinforced steel, also known as rebar...' })
  subContent: string;
}
