import { Controller, Get, UseGuards } from '@nestjs/common';
import { RfqService } from './rfq.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('rfq')
@ApiTags('rfq')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RfqController {
  constructor(private readonly rfqService: RfqService) {}

  @ApiOperation({
    summary: 'Retrieves all rfq categories',
  })
  @Get('category')
  async fetchCategories() {
    return this.rfqService.fetchCategories();
  }

  @ApiOperation({
    summary: 'Retrieves all rfq items',
  })
  @Get('item')
  async fetchItems() {
    return this.rfqService.fetchItems();
  }
}
