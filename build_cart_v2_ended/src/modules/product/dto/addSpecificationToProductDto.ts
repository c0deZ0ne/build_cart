import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
  IsArray,
} from 'class-validator';

export class SpecificationDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '0.16mm' })
  specification: string;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({ example: 400 })
  price: number;
}
export class AddSpecificationAndPriceToProductDto {
  @ApiProperty({ type: [SpecificationDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SpecificationDto)
  specsAndPrices: SpecificationDto[];
}
