import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from 'src/modules/auth/guards/admin.guard';
import { GetUser } from '../auth/user.decorator';
import { User } from '../user/models/user.model';
import { AdminRegisterVendorDto } from './dto/admin-create-vendor.dto';
import { AdminVendorService } from './admin-vendor.services';
import { AdminUpdateVendorProfileDto } from '../vendor/dto';

@Controller('admin')
@ApiTags('admin')
@ApiBearerAuth()
// @UseGuards(AdminGuard)
export class AdminVendorController {
  constructor(private readonly adminVendorService: AdminVendorService) {}

  @ApiOperation({
    summary: 'Return all vendors',
  })
  @Get('/vendors')
  async getAllUsers() {
    return await this.adminVendorService.adminGetAllVendors();
  }

  @ApiOperation({
    summary: 'Register a new vendor',
  })
  @Post('/vendor')
  async registerBuilder(
    @Body(ValidationPipe) body: AdminRegisterVendorDto,
    @GetUser() user: User,
  ) {
    // return await this.adminVendorService.AdminRegisterVendor({ body, user });
  }

  @ApiOperation({
    summary: 'Update vendor details',
  })
  @Patch('/user/vendor/:vendorId')
  async updateVendorDetails(
    @Body(ValidationPipe) body: AdminUpdateVendorProfileDto,
    @Param('vendorId') vendorId: string,
  ) {
    return await this.adminVendorService.adminUpdateVendorProfile(
      vendorId,
      body,
    );
  }

  @ApiOperation({
    summary: 'get vendor details',
  })
  @Get('/user/vendor/:vendorId')
  async getVendorDetails(@Param('vendorId') vendorId: string) {
    return await this.adminVendorService.adminGetVendorProfile(vendorId);
  }

  @ApiOperation({
    summary: 'activate vendor account ',
  })
  @Patch('/vendor/:userId/activate')
  async adminActivateUser(@Param('userId') userId: string) {
    return await this.adminVendorService.adminActivate(userId);
  }
  @ApiOperation({
    summary: 'deactivate vendor account ',
  })
  @Patch('/vendor/:userId/deactivate')
  async adminDeactivateUser(@Param('userId') userId: string) {
    return await this.adminVendorService.adminDeactivate(userId);
  }
}
