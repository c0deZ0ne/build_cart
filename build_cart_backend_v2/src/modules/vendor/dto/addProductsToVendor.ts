import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

export class AddProductsToVendorDto {
  @IsArray()
  @ApiProperty({
    type: [String],
    example: ['290c11b9-95d6-4307-83b1-756d8b11fb01'],
  })
  productsIDs: string[];
}

export class SpecAndPriceDTO {
  @IsString()
  @ApiProperty({ example: '0.16mm' })
  specification: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ example: 400 })
  price?: number | null;
}

export class ProductDTO {
  @IsUUID()
  @ApiProperty({
    type: () => String,
    example: '290c11b9-95d6-4307-83b1-756d8b11fb01',
  })
  productId: string;

  @ArrayMinSize(1)
  @IsOptional()
  @ValidateNested({ each: true })
  @ApiProperty({
    type: () => String,
    example: [
      {
        specification: '0.16mm',
        price: 400,
      },
    ],
  })
  @Type(() => SpecAndPriceDTO)
  specsAndPrices: SpecAndPriceDTO[];
}

export class AddProductsToVendorWithSpecsAndPricesDto {
  @ApiProperty({
    type: () => [ProductDTO],
  })
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ProductDTO)
  products: ProductDTO[];
}
