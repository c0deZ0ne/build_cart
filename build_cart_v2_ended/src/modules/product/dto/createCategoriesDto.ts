import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Test Category' })
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example:
      'https://res.cloudinary.com/cutstruct-technology-limited/image/upload/v1697712000/Product%20Inventory/coated-binding-wires.png',
  })
  image_url: string;
}
