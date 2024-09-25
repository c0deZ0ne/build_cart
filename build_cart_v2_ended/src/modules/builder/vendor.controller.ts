import { Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { VendorService } from 'src/modules/vendor/vendor.service';
import { MyVendorService } from '../my-vendor/my-vendor.service';
import { GetUser } from 'src/modules/auth/user.decorator';
import { User } from 'src/modules/user/models/user.model';
import { VendorStatus } from '../vendor/models/vendor.model';
import { BuilderGuard } from '../auth/guards/builder.guard';

@Controller('builder')
@ApiTags('builder')
@ApiBearerAuth()
@UseGuards(BuilderGuard)
export class BuilderVendorController {
  constructor(
    private readonly vendorService: VendorService,
    private readonly myVendorService: MyVendorService,
  ) {}

  @ApiOperation({
    summary: 'Retrieve my vendors',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description:
      'Search query for vendors. Searches in fields: businessName, location, VendorType.',
  })
  @Get('vendor/my')
  async getMyVendors(
    @GetUser() { BuilderId }: User,
    @Query('search') search: string,
  ) {
    return await this.myVendorService.getMyVendors(BuilderId, search);
  }

  @ApiOperation({
    summary: 'Retrieve vendor details',
  })
  @Get('vendor/:id')
  async getVendorById(@Param('id') id: string) {
    return await this.vendorService.getVendorById(id);
  }

  @ApiOperation({
    summary: 'Retrieve my vendor details',
  })
  @Get('vendor/my/:id')
  async getmyVendorById(
    @GetUser() { BuilderId }: User,
    @Param('id') id: string,
  ) {
    return await this.myVendorService.getMyVendorById(BuilderId, id);
  }

  @ApiOperation({
    summary: 'Retrieve vendors by category',
  })
  @Get('vendor/category/:category')
  async fetchVendorsForCategory(@Param('category') category: string) {
    return await this.vendorService.fetchVendorsForCategory(category);
  }

  @ApiOperation({
    summary: 'Add vendor to my vendors',
  })
  @Post('vendor/:id')
  async addVendorToMyVendors(
    @Param('id') id: string,
    @GetUser() { BuilderId }: User,
  ) {
    return await this.myVendorService.addVendorToMyVendors(BuilderId, id);
  }
}
