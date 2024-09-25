import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'testing 123' })
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'b21bdf58-bf09-4b53-b43c-22e1eb86caf5' })
  categoryID: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: '4da8a201-348c-48cb-974b-b023bb142c09' })
  metricID: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example:
      'Explore our top-quality construction binding wire, designed for durability and reliability in reinforcing concrete structures. Crafted from high-grade steel with exceptional tensile strength, our binding wires ensure secure connections for your projects. Resistant to corrosion and available in various gauges and lengths, these wires offer long-lasting stability in demanding environments.',
  })
  description: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ example: true })
  show_on_retail: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ example: true })
  feature_product: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ example: true })
  is_todays_pick: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ example: true })
  top_selling_item: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ example: true })
  show_on_tracker: boolean;
}
