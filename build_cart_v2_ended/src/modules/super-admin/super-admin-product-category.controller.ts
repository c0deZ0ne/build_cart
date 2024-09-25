import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorators';
import { UserRoles } from '../rbac/models/role.model';
import { SuperAdminProductService } from './super-admin-product-category.service';
import {
  CreateProductDto,
  UpdateProductDto,
} from './dto/super-admin-create-project-categoryDto';
import { ApiQuery } from '@nestjs/swagger';
@Controller('superAdmin')
@ApiTags('superAdmin-product-category')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class superAdminProductController {
  constructor(
    private readonly superAdminProductService: SuperAdminProductService,
  ) {}
  @ApiQuery({
    name: 'page_size',
    type: Number,
    required: false,
    example: 10,
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
    example: 1,
  })
  @ApiQuery({
    name: 'CategoryStatus',
    type: String,
    required: false,
    example: 'PAUSE',
    enum: ['PAUSE', 'ACTIVE', 'ALL'], 
  })
  @ApiQuery({
    name: 'search_param',
    type: String,
    required: false,
    example: 'Cement',
  })
  @ApiOperation({
    summary: 'Fetch all Product Categories',
  })
  @Get('/products/category')
  @Roles(UserRoles.SUPER_ADMIN)
  async getProductCategories(
    @Query('CategoryStatus') CategoryStatus: string,
    @Query('page_size') page_size: number,
    @Query('search_param') search_param: string,
    @Query('page') page: number,
  ) {
    return await this.superAdminProductService.getProductCategories({ CategoryStatus, search_param });
  }
  

  @ApiOperation({
    summary: 'fetch a product category',
  })
  @Get('/products/category/:categoryId')
  @Roles(UserRoles.SUPER_ADMIN)
  async getProductCategory(@Param('categoryId') categoryId: string) {
    return await this.superAdminProductService.getProductCategory(categoryId);
  }

  @ApiOperation({
    summary: 'create a product and a category',
  })
  @Post('/products')
  @Roles(UserRoles.SUPER_ADMIN)
  async createProduct(@Body(ValidationPipe) body: CreateProductDto) {
    return await this.superAdminProductService.createProduct(body);
  }

  @ApiOperation({
    summary: 'update a product category',
  })
  @Patch('/products/:productId/update')
  @Roles(UserRoles.SUPER_ADMIN)
  async editProduct(
    @Body(ValidationPipe) body: UpdateProductDto,
    @Param('productId') productId: string,
  ) {
    return await this.superAdminProductService.editProduct(productId, body);
  }

  @ApiOperation({
    summary: 'pause a category',
  })
  @Patch('/categories/:categoryId')
  @Roles(UserRoles.SUPER_ADMIN)
  async pauseProductCategory(
    @Param('categoryId') categoryId: string,
    @Query('visibility') visibility: boolean,
  ) {
    return await this.superAdminProductService.pauseCategory(
      categoryId,
      visibility,
    );
  }

  @ApiOperation({
    summary: 'pause a product',
  })
  @Patch('/products/:productId')
  @Roles(UserRoles.SUPER_ADMIN)
  async pauseProduct(
    @Param('productId') productId: string,
    @Query('visibility') visibility: boolean,
  ) {
    return await this.superAdminProductService.pauseProduct(
      productId,
      visibility,
    );
  }
}
