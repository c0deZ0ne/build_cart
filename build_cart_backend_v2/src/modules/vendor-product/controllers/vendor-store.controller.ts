import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { VendorProductService } from '../services/vendor-product.service';

@Controller('vendor-product')
@ApiTags('vendor-product')
export class VendorStoreController {
  constructor(private readonly vendorProductService: VendorProductService) {}

  // get vendor store products from store number

  @ApiOperation({
    summary: 'Get vendor store products',
  })
  @Get(':storeNumber')
  async getVendorStoreProducts(@Param('storeNumber') storeNumber: string) {
    return await this.vendorProductService.getVisibleVendorStoreProducts(
      storeNumber,
    );
  }

  @ApiOperation({
    summary: 'Search for vendor products',
  })
  @ApiQuery({
    name: 'name',
    type: String,
    required: true,
    example: 'Coated',
  })
  @ApiQuery({
    name: 'page_size',
    type: Number,
    required: false,
    example: 100,
  })
  @Get('search/product/:storeNumber')
  async searchForProducts(
    @Query('name') name: string,
    @Param('storeNumber') storeNumber: string,
  ) {
    return await this.vendorProductService.searchForVendorProduct(
      storeNumber,
      name,
    );
  }
}
