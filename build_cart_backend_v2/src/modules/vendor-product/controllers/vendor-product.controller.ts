import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import {
  AddProductsToVendorDto,
  AddProductsToVendorWithSpecsAndPricesDto,
} from 'src/modules/vendor/dto/addProductsToVendor';
import { VendorGuard } from '../../auth/guards/vendor.guard';
import { GetUser } from '../../auth/user.decorator';
import { User } from '../../user/models/user.model';
import { AddSpecificationAndPriceToVendorProductDto } from '../dto/addSpecificationToVendorProduct.dto';
import { VendorProductService } from '../services/vendor-product.service';

@Controller('vendor-product')
@ApiTags('vendor-product')
@ApiBearerAuth()
@UseGuards(VendorGuard)
export class VendorAndProductController {
  constructor(private readonly vendorProductService: VendorProductService) {}

  @ApiOperation({
    summary: 'Get vendor products',
  })
  @ApiQuery({
    name: 'searchParam',
    required: false,
    example: 'cement',
  })
  @Get('')
  async getVendorProducts(
    @GetUser() user: User,
    @Query('searchParam') searchParam: string,
  ) {
    return await this.vendorProductService.getVendorProducts({
      vendorId: user.VendorId,
      searchParam,
    });
  }

  @ApiOperation({
    summary: 'Get vendor products',
  })
  @Get('/get-store')
  async getVendorProductsForStore(@GetUser() user: User) {
    return await this.vendorProductService.getVendorProductsById(user.VendorId);
  }

  @ApiOperation({
    summary: 'Add product(s) to a vendor',
  })
  @Patch('add-products')
  async addProductToVendor(
    @GetUser() user: User,
    @Body(ValidationPipe) data: AddProductsToVendorWithSpecsAndPricesDto,
  ) {
    const { products } = data;

    const { VendorId } = user;
    return await this.vendorProductService.addProductToVendor({
      vendorId: VendorId,
      products: products,
    });
  }

  @ApiOperation({
    summary: 'Get vendor products by category',
  })
  @ApiParam({
    name: 'categoryId',
    required: true,
    example: 'a365ede1-6df4-4afd-914a-810eacac7a9c',
  })
  @Get('get-vendor-products-by-category/:categoryId')
  async getVendorProductsByCategory(
    @Param('categoryId', new ParseUUIDPipe()) categoryId: string,
    @GetUser() user: User,
  ) {
    return await this.vendorProductService.getVendorProductsByCategory(
      categoryId,
      user.VendorId,
    );
  }

  @ApiOperation({
    summary: 'Remove product(s) from a vendor',
  })
  @Patch('remove-products')
  async removeProductFromVendor(
    @GetUser() user: User,
    @Body(ValidationPipe) data: AddProductsToVendorDto,
  ) {
    const { productsIDs } = data;
    return await this.vendorProductService.removeProductFromVendor({
      vendorId: user.VendorId,
      products: productsIDs,
    });
  }

  @ApiOperation({
    summary: 'Create specification(s) for a vendor product',
  })
  @Patch('create-specification/:id')
  async addSpecificationToVendorProduct(
    @Param('id', new ParseUUIDPipe()) id: string,
    @GetUser() user: User,
    @Body(ValidationPipe) body: AddSpecificationAndPriceToVendorProductDto,
  ) {
    return await this.vendorProductService.addSpecificationToProduct({
      vendorProductId: id,
      specsAndPrices: body.specsAndPrices,
    });
  }

  @ApiOperation({
    summary: 'Update specification(s) for a vendor product',
  })
  @Patch('update-specification/:id')
  async updateSpecificationPrice(
    @Param('id', new ParseUUIDPipe()) id: string,
    @GetUser() user: User,
    @Body(ValidationPipe) body: AddSpecificationAndPriceToVendorProductDto,
  ) {
    return await this.vendorProductService.updatePriceOfProductSpecification({
      vendorProductId: id,
      specsAndPrices: body.specsAndPrices,
    });
  }

  @Delete('delete-vendor-product-specification/:id')
  async deleteVendorProductSpecification(
    @Param('id', new ParseUUIDPipe()) id: string,
    @GetUser() user: User,
  ) {
    return await this.vendorProductService.deleteVendorProductSpecification(
      id,
      user.VendorId,
    );
  }

  @ApiOperation({
    summary: 'Update the visibility of a vendor product',
  })
  @Patch('update-product-visibility/:id')
  async updateProductVisibility(
    @Param('id', new ParseUUIDPipe()) id: string,
    @GetUser() user: User,
  ) {
    return await this.vendorProductService.toggleVendorProductVisibility(
      id,
      user.VendorId,
    );
  }
}
