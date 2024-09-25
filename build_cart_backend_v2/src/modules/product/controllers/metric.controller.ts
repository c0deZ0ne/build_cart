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
import { CreateMetricDto } from '../dto/createMetricDto';
import { UpdateMetricDto } from '../dto/updateMetricDto';
import { ProductMetricService } from '../services/metric.service';

@Controller('product/metrics')
@ApiTags('product-metrics')
export class MetricController {
  constructor(private readonly productMetricService: ProductMetricService) {}

  @ApiOperation({
    summary: 'Create a new product metric',
  })
  @Post('create-metric')
  async createMetric(@Body(ValidationPipe) createMetricDto: CreateMetricDto) {
    return await this.productMetricService.createMetric(createMetricDto);
  }

  @ApiOperation({
    summary: 'Get all Metrics',
  })
  @ApiQuery({
    name: 'page_size',
    type: Number,
    required: false,
    example: 100,
  })
  @Get('get-metrics')
  async getAllCategory() {
    return await this.productMetricService.getAllMetic();
  }

  @ApiOperation({
    summary: 'Get a particular metric by ID',
  })
  @ApiParam({
    name: 'id',
    required: true,
    example: '65df572d-7201-4f4e-a3d2-902e8e6b86ca',
  })
  @Get('get-metric/:id')
  async getMetric(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.productMetricService.getMetricById(id);
  }

  @ApiOperation({
    summary: 'Update a metric',
  })
  @ApiParam({
    name: 'id',
    required: true,
    example: '302c7816-029f-49ef-b428-5b4ea3e76bac',
  })
  @Patch('update-metric/:id')
  async updateMetric(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body(ValidationPipe) updateMetricDto: UpdateMetricDto,
  ) {
    return await this.productMetricService.updateMetric(id, updateMetricDto);
  }

  @ApiOperation({
    summary: 'Delete a metric',
  })
  @ApiParam({
    name: 'id',
    required: true,
    example: '65df572d-7201-4f4e-a3d2-902e8e6b86ca',
  })
  @Delete('delete-metric/:id')
  async deleteMetric(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.productMetricService.deleteMetricById(id);
  }
}
