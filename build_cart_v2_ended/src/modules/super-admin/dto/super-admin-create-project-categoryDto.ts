import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsArray,
  ValidateNested,
  IsNumber,
  IsDefined,
  IsBoolean,
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

export class ItemDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({ example: 'item name' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({ example: 'item image' })
  image: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({
    example: '29cf3d98-84dc-40f4-b641-eef44b681d56',
    description: 'the measurement id',
  })
  metricId: string;

  @ApiProperty({ type: [SpecificationDto] })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => SpecificationDto)
  specsAndPrices: SpecificationDto[];

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({ example: '4000 - 5000' })
  priceRange: string;
}

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Coated Binding Wires' })
  name: string;

  @ApiProperty({ type: [ItemDto] })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ItemDto)
  items: ItemDto[];
}

export class CreateMeasurementDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '2289394hbdjfird-bnfjdj-33' })
  id: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'kg' })
  name: string;
}

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Otedola Cement' })
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: '100' })
  quantity: string;

  @ApiProperty({ type: CreateMeasurementDto })
  @IsOptional()
  @Type(() => CreateMeasurementDto)
  measurement: CreateMeasurementDto;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: '4000 - 4500' })
  price: string;
}
export class CommissionDto {
  @IsNumber()
  @IsDefined()
  @IsNotEmpty()
  @ApiProperty({ example: 20 })
  percentageNumber: number;
}

export class UpdateCommissionDto {
  @IsNumber()
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ example: 20 })
  percentageNumber: number;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ example: true })
  active: boolean;
}
