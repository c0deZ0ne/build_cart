import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsArray,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SpecificationDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({ example: '0.16mm' })
  specification: string;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({ example: 400 })
  price: number;
}

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Coated Binding Wires' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({
    example:
      'https://res.cloudinary.com/cutstruct-technology-limited/image/upload/v1697712000/Product%20Inventory/coated-binding-wires.png',
  })
  image_url: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '230df39a-4f61-4f7a-a52c-d393297211c9' })
  categoryID: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '29cf3d98-84dc-40f4-b641-eef44b681d56' })
  metricID: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'This is a coated binding wire' })
  description: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ example: true })
  show_on_retail: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ example: false })
  feature_product: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ example: false })
  show_on_tracker: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ example: false })
  is_todays_pick: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ example: false })
  top_selling_item: boolean;

  @ApiProperty({ type: [SpecificationDto] })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => SpecificationDto)
  specsAndPrices: SpecificationDto[];
}
