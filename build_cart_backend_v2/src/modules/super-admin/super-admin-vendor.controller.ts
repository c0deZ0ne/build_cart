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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '../user/models/user.model';
import { GetUser } from '../auth/user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorators';
import { UserRoles } from '../rbac/models/role.model';
import { superAdminCreateBuilderDto } from './dto/super-admin-create-builderDto';
import {
  AdminUpdateVendorProfileDto,
  UpdateVendorCategoryDto,
} from '../vendor/dto';
import { SuperAdminVendorService } from './super-admin-vendor.service';
import { AdminVendorService } from '../admin/admin-vendor.services';
import { AdminUploadDocumentsDto } from './dto/super-admin-invite-vendorDto';

@Controller('superAdmin')
@ApiTags('superAdmin-vendor')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class superAdminVendorController {
  constructor(
    private readonly superAdminVendorService: SuperAdminVendorService,
    private readonly adminVendorService: AdminVendorService,
  ) {}

  @ApiOperation({
    summary: 'Invite Vendors',
  })
  @Post('/vendors/invite')
  @Roles(UserRoles.SUPER_ADMIN)
  async inviteBuilder(
    @Body(ValidationPipe) body: superAdminCreateBuilderDto,
    @GetUser() user: User,
  ) {
    return await this.superAdminVendorService.inviteVendor(body, user);
  }

  @ApiOperation({
    summary: 'Get all Vendors',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search query for vendors. Searches by vendors businessName ',
  })
  @Get('/vendors')
  @Roles(UserRoles.SUPER_ADMIN)
  async getvendors(@Query('search') search?: string) {
    return await this.superAdminVendorService.getVendors(search);
  }

  @ApiOperation({
    summary: 'add category to vendor account',
  })
  @Post('/vendors/:vendorId/category')
  @Roles(UserRoles.SUPER_ADMIN)
  async addVendorCategory(
    @Body(ValidationPipe) body: UpdateVendorCategoryDto,
    @Param('vendorId') vendorId: string,
  ) {
    return await this.superAdminVendorService.addVendorCategory({
      updateVendorCategory: body,
      vendorId,
    });
  }

  @ApiOperation({
    summary: 'Update a Vendor profile',
  })
  @Patch('/vendors/:vendorId/profile')
  @Roles(UserRoles.SUPER_ADMIN)
  async updateBuilderProfile(
    @Body(ValidationPipe) body: AdminUpdateVendorProfileDto,
    @Param('vendorId') vendorId: string,
  ) {
    return this.adminVendorService.adminUpdateVendorProfile(vendorId, body);
  }

  @ApiOperation({
    summary: 'Get a Vendor by vendorId',
  })
  @Get('/vendors/:vendorId')
  @Roles(UserRoles.SUPER_ADMIN)
  async getBuilderById(@Param('vendorId') vendorId: string) {
    return await this.superAdminVendorService.getVendorById(vendorId);
  }

  @ApiOperation({
    summary: 'Upload a Vendor documents',
  })
  @Patch('/vendors/:vendorId/document')
  @Roles(UserRoles.SUPER_ADMIN)
  async updateBuilderDocs(
    @Body(ValidationPipe) body: AdminUploadDocumentsDto,
    @Param('vendorId') vendorId: string,
  ) {
    return await this.superAdminVendorService.updateVendorDocuments(
      body,
      vendorId,
    );
  }

  @ApiOperation({
    summary: 'assign a ProcurementManagers to a Vendor profile',
  })
  @Patch('/procurementManagers/builders/:builderId')
  @Roles(UserRoles.SUPER_ADMIN)
  async assignProcurementManagersTobuilders(
    @Param('vendorId') vendorId: string,
    @Query('procurementManagerId') procurementManagerId: string,
  ) {
    return await this.superAdminVendorService.assignProcurementManagersToVendor(
      vendorId,
      procurementManagerId,
    );
  }
}
