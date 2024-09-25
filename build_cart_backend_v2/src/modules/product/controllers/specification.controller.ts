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
import { CreateSpecificationDto } from '../dto/createSpecificationDto';
import { UpdateSpecificationDto } from '../dto/updateSpecificationDto';
import { ProductSpecificationService } from '../services/specification.service';

@Controller('product/specification')
@ApiTags('product-specification')
export class SpecificationController {
  constructor(
    private readonly productSpecificationService: ProductSpecificationService,
  ) {}

  @ApiOperation({
    summary: 'Create a new specifications for products',
  })
  @Post('create-specification')
  async createSpecification(
    @Body(ValidationPipe) createSpecificationDto: CreateSpecificationDto,
  ) {
    return await this.productSpecificationService.createSpecification(
      createSpecificationDto,
    );
  }

  @ApiOperation({
    summary: 'Get all specifications',
  })
  @ApiQuery({
    name: 'page_size',
    type: Number,
    required: false,
    example: 100,
  })
  @Get('get-specifications')
  async getAllSpecification() {
    return await this.productSpecificationService.getAllSpecifications();
  }

  @ApiOperation({
    summary: 'Get a particular specification by ID',
  })
  @ApiParam({
    name: 'id',
    required: true,
    example: 'b82407ed-318f-4d8f-93be-bf05d3652a86',
  })
  @Get('get-specification/:id')
  async getSpecification(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.productSpecificationService.getMetricById(id);
  }

  @ApiOperation({
    summary: 'Update a specification',
  })
  @ApiParam({
    name: 'id',
    required: true,
    example: 'ca3fccbc-8a75-41f1-9015-a1275d169ae6',
  })
  @Patch('update-specification/:id')
  async updateSpecification(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body(ValidationPipe) updateSpecificationDto: UpdateSpecificationDto,
  ) {
    return await this.productSpecificationService.updateSpecification(
      id,
      updateSpecificationDto,
    );
  }

  @ApiOperation({
    summary: 'Delete a specification',
  })
  @ApiParam({
    name: 'id',
    required: true,
    example: 'ca3fccbc-8a75-41f1-9015-a1275d169ae6',
  })
  @Delete('delete-specification/:id')
  async deleteSpecification(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.productSpecificationService.deleteSpecificationById(id);
  }
}
