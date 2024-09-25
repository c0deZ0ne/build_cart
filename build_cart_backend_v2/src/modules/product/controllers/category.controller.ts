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
import { CreateCategoryDto } from '../dto/createCategoriesDto';
import { UpdateCategoryDto } from '../dto/updateCategoryDto';
import { ProductCategoryService } from '../services/category.service';

@Controller('product/categories')
@ApiTags('product-categories')
export class CategoryController {
  constructor(
    private readonly productCategoryService: ProductCategoryService,
  ) {}

  @ApiOperation({
    summary: 'Create a new product category',
  })
  @Post('create-category')
  async createCategory(
    @Body(ValidationPipe) createCategoryDto: CreateCategoryDto,
  ) {
    return await this.productCategoryService.createCategory(createCategoryDto);
  }

  @ApiOperation({
    summary: 'Get all Categories',
  })
  @ApiQuery({
    name: 'page_size',
    type: Number,
    required: false,
    example: 100,
  })
  @Get('get-categories')
  async getAllCategory() {
    return await this.productCategoryService.getAllCategory();
  }

  @ApiOperation({
    summary: 'Find a category by ID',
  })
  @ApiParam({
    name: 'id',
    required: true,
    example: '283cb63f-710f-46f7-a27b-9b678f33622f',
  })
  @Get('get-category/:id')
  async getCategoryById(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.productCategoryService.getCategoryById(id);
  }

  @ApiOperation({
    summary: 'Update a category',
  })
  @ApiParam({
    name: 'id',
    required: true,
    example: 'e43c2fd9-20c0-4ec3-aa67-608ea0219a10',
  })
  @Patch('update-category/:id')
  async updateCategory(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body(ValidationPipe) updateCategoryDto: UpdateCategoryDto,
  ) {
    return await this.productCategoryService.updateCategory(
      id,
      updateCategoryDto,
    );
  }

  @ApiOperation({
    summary: 'Delete a category',
  })
  @ApiParam({
    name: 'id',
    required: true,
    example: 'e43c2fd9-20c0-4ec3-aa67-608ea0219a10',
  })
  @Delete('delete-category/:id')
  async deleteCategoryById(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.productCategoryService.deleteCategoryById(id);
  }
}
