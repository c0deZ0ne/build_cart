import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AddSpecificationAndPriceToProductDto } from '../dto/addSpecificationToProductDto';
import { CreateProductDto } from '../dto/createProductDto';
import { UpdateProductDto } from '../dto/updateProductDto';
import { ProductService } from '../services/product.service';

@Controller('product')
@ApiTags('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOperation({
    summary: 'Create a new product',
  })
  @Post('create-product')
  async createProduct(
    @Body(ValidationPipe) createProductDto: CreateProductDto,
  ) {
    return await this.productService.createProduct(createProductDto);
  }

  @ApiOperation({
    summary: 'find a product by its ID',
  })
  @ApiParam({
    name: 'id',
    required: true,
    example: 'af618e4e-4be4-44a3-8470-ffe765368428',
  })
  @Get(':id')
  async getProductById(@Param('id', new ParseUUIDPipe()) id: string) {
    const product = await this.productService.getProductById(id);
    return product;
  }

  @ApiOperation({
    summary: 'find all products',
  })
  @ApiQuery({
    name: 'page_size',
    type: Number,
    required: false,
    example: 100,
  })
  @Get()
  async getAllProducts() {
    const products = await this.productService.getAllProducts();
    return products;
  }

  @ApiOperation({
    summary: 'search for products by name',
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
  @Get('search/product')
  async search(@Query('name') name: string) {
    return this.productService.searchForProduct(name);
  }

  @ApiOperation({
    summary: 'Get products by category',
  })
  @ApiParam({
    name: 'id',
    required: true,
    example: 'a365ede1-6df4-4afd-914a-810eacac7a9c',
  })
  @ApiQuery({
    name: 'page_size',
    type: Number,
    required: false,
    example: 100,
  })
  @Get('category/:id')
  async getProductsByCategory(@Param('id', new ParseUUIDPipe()) id: string) {
    const products = await this.productService.getProductsByCategory(id);
    return products;
  }

  @ApiOperation({
    summary: 'Get products by either featured/price-tracker/retail',
  })
  @ApiParam({
    name: 'filter',
    required: true,
    example: 'feature_product',
  })
  @ApiQuery({
    name: 'page_size',
    type: Number,
    required: false,
    example: 100,
  })
  @Get('filter/:filter')
  async getProductsByFilter(@Param('filter') filter: string) {
    const products = await this.productService.getAllProductsByProperty(filter);
    return products;
  }

  @ApiOperation({
    summary: 'update a product',
  })
  @ApiParam({
    name: 'id',
    required: true,
    example: '649bb8cb-0fa4-4c85-a59f-b428d32ac945',
  })
  @Patch(':id')
  async updateProductById(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body(ValidationPipe) updateProductDto: UpdateProductDto,
  ) {
    const updatedProduct = await this.productService.updateProduct(
      id,
      updateProductDto,
    );

    return updatedProduct;
  }

  @ApiOperation({
    summary: 'Add specification and prices to a product',
  })
  @ApiParam({
    name: 'id',
    required: true,
    example: '649bb8cb-0fa4-4c85-a59f-b428d32ac945',
  })
  @Patch('create-specification/:id')
  async createProductSpecification(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body(ValidationPipe)
    updateProductDto: AddSpecificationAndPriceToProductDto,
  ) {
    const { specsAndPrices } = updateProductDto;

    const updatedProduct = await this.productService.addSpecificationToProduct(
      id,
      specsAndPrices,
    );

    return updatedProduct;
  }

  @ApiOperation({
    summary: "Update the price of an existing product's specification",
  })
  @ApiParam({
    name: 'id',
    required: true,
    example: '649bb8cb-0fa4-4c85-a59f-b428d32ac945',
  })
  @Patch('update-price/:id')
  async updatePriceOfProductSpecification(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body(ValidationPipe)
    updateProductDto: AddSpecificationAndPriceToProductDto,
  ) {
    const { specsAndPrices } = updateProductDto;

    const updatedProduct = await this.productService.updateSpecificationPrice(
      id,
      specsAndPrices,
    );
    return updatedProduct;
  }

  @ApiOperation({
    summary: 'delete a product by its ID',
  })
  @ApiParam({
    name: 'id',
    required: true,
    example: 'af618e4e-4be4-44a3-8470-ffe765368428',
  })
  @Delete(':id')
  async deleteProductById(@Param('id', new ParseUUIDPipe()) id: string) {
    const product = await this.productService.deleteProductById(id);
    return product;
  }
}
