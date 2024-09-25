import { Controller, Get, Query } from '@nestjs/common';
import { BrandService } from './brand.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@Controller('brand')
@ApiTags('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @ApiOperation({
    summary: 'Retrieves all brands',
  })
  @Get()
  async findAll() {
    return this.brandService.findAll();
  }

  @ApiOperation({
    summary: 'Retrieves premium brands',
  })
  @Get('premium')
  async findPremium() {
    return this.brandService.findPremium();
  }

  @ApiOperation({
    summary: 'Get details of a brand',
  })
  @Get(':id')
  async getDetails(@Query('id') id: string) {
    return this.brandService.getDetails(id);
  }
}
