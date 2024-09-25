import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { UpdateSubBlogDto } from './update-subBlog.dto';

export class UpdateBlogDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200000)
  @ApiProperty({
    example:
      'The Significance of High-Quality Construction Materials in Building Projects',
  })
  blogTitle: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200000)
  @ApiProperty({ example: 'When it comes to construction projects...' })
  blogContent: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'https://cloudinary.com' })
  image: string;

  @IsNotEmpty()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateSubBlogDto)
  @ApiProperty({ type: [UpdateSubBlogDto] })
  subBlogs?: UpdateSubBlogDto[];
}
