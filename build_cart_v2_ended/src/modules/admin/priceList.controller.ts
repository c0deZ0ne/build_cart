import {
  Body,
  Controller,
  Get,
  Patch,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from 'src/modules/auth/guards/admin.guard';
import { GetUser } from 'src/modules/auth/user.decorator';
import { User } from 'src/modules/user/models/user.model';
import { PriceListService } from '../price-list/price-list.service';
import { UpdatePriceListDto } from '../price-list/dto/update-price-list.dto';

@ApiTags('admin')
@Controller('admin')
export class PriceController {
  constructor(private readonly priceListService: PriceListService) {}

  @ApiOperation({
    summary: 'Retrieve contracts',
  })
  @Get('/pricelist')
  async getPriceLists() {
    return await this.priceListService.retrievePriceList();
  }

  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  @ApiOperation({
    summary: 'Update Price List',
  })
  @ApiBody({ type: [UpdatePriceListDto] })
  @Patch('/pricelist/update')
  async priceList(
    @Body(ValidationPipe)
    body: UpdatePriceListDto[],
    @GetUser() user: User,
  ) {
    return await this.priceListService.bulkUpdatePriceList(body, user);
  }
}
