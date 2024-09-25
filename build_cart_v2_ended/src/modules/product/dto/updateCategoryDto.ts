import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCategoryDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'testing 123' })
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example:
      'https://res.cloudinary.com/cutstruct-technology-limited/image/upload/v1697712000/Product%20Inventory/coated-binding-wires.png',
  })
  image_url: string;
}
