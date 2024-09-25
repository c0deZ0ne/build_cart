import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';

export class UpdateSubBlogDto {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({ example: '6d0493bd-0d15-40d6-931b-6036f18474e1' })
  id: string;

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
