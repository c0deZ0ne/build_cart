import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested, IsArray } from 'class-validator';
import { SpecificationDto } from 'src/modules/product/dto/createProductDto';
import { SpecAndPriceDTO } from 'src/modules/vendor/dto/addProductsToVendor';

export class AddSpecificationAndPriceToVendorProductDto {
  @ApiProperty({ type: [SpecificationDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SpecificationDto)
  specsAndPrices: SpecificationDto[];
}

export class AddSpecificationAndPriceToVendorProductData {
  @ApiProperty({ type: [SpecificationDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SpecificationDto)
  specsAndPrices: SpecAndPriceDTO[];

  vendorProductId: string;
}
