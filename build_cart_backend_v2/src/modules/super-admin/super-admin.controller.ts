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
import { SuperAdminService } from './super-admin.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorators';
import { UserRoles } from '../rbac/models/role.model';
import { GetUser } from '../auth/user.decorator';
import { User } from '../user/models/user.model';
import {
  superAdminRequest2faDto,
  superAdminSetup2faDto,
  superAdminUpdatePasswordDto,
  superAdminUpdateProfileDto,
} from './dto/super-admin-profileDto';
import {
  CommissionDto,
  UpdateCommissionDto,
} from './dto/super-admin-create-project-categoryDto';
import { AdminUploadDocumentsDto } from './dto/super-admin-invite-vendorDto';

@Controller('superAdmin')
@ApiTags('superAdmin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class superAdminController {
  constructor(private readonly superAdminService: SuperAdminService) {}

  @ApiOperation({
    summary: 'Get SuperAdmin Dashboard',
  })
  @Get('/dashboard')
  @Roles(UserRoles.SUPER_ADMIN)
  async getDashboard() {
    return await this.superAdminService.getDashboard();
  }

  @ApiOperation({
    summary: 'Get SuperAdmin Profile',
  })
  @Get('/profile')
  @Roles(UserRoles.SUPER_ADMIN)
  async getProfile(@GetUser() user: User) {
    return await this.superAdminService.getProfile(user.id);
  }

  @ApiOperation({
    summary: 'get all admin Roles',
  })
  @Get('/roles')
  @Roles(UserRoles.SUPER_ADMIN)
  async getRoles() {
    return await this.superAdminService.getRoles();
  }

  @ApiOperation({
    summary: 'get all Procurement Managers profile',
  })
  @Get('/procurementManagers/:roleId')
  @Roles(UserRoles.SUPER_ADMIN)
  async getProcurementManagers(@Param('roleId') roleId: string) {
    return await this.superAdminService.getProcurementManagers(roleId);
  }

  @ApiOperation({
    summary: 'update admin profile',
  })
  @Patch('/profile')
  @Roles(UserRoles.SUPER_ADMIN)
  async updateProfile(
    @Body(ValidationPipe) body: superAdminUpdateProfileDto,
    @GetUser() user: User,
  ) {
    return await this.superAdminService.updateProfile(user.id, body);
  }

  @ApiOperation({
    summary: 'update admin password',
  })
  @Patch('/password')
  @Roles(UserRoles.SUPER_ADMIN)
  async updatePassword(
    @Body(ValidationPipe) body: superAdminUpdatePasswordDto,
    @GetUser() user: User,
  ) {
    return await this.superAdminService.updatePassword(user.id, body);
  }

  @ApiOperation({
    summary: 'Request 2Fa token',
  })
  @Patch('/request/2faToken')
  @Roles(UserRoles.SUPER_ADMIN)
  async request2faOtp(@Body(ValidationPipe) body: superAdminRequest2faDto) {
    return await this.superAdminService.request2faOtp(body.email);
  }

  @ApiOperation({
    summary: 'setup 2fa settings',
  })
  @Patch('/setup/2fa')
  @Roles(UserRoles.SUPER_ADMIN)
  async set2faProfile(
    @Body(ValidationPipe) body: superAdminSetup2faDto,
    @GetUser() user: User,
  ) {
    return await this.superAdminService.set2faProfile(user.id, body.otp);
  }

  @ApiOperation({
    summary: 'get admin logs',
  })
  @Get('/userLogs')
  @Roles(UserRoles.SUPER_ADMIN)
  async getUserLogs() {
    return await this.superAdminService.getUserLogs();
  }

  @ApiOperation({
    summary: 'get a single admin log',
  })
  @Get('/userLogs/:logId')
  @Roles(UserRoles.SUPER_ADMIN)
  async getAUserLog(@Param('logId') logId: string) {
    return await this.superAdminService.getAUserLog(logId);
  }

  @ApiOperation({
    summary: 'get logs belonging to a user',
  })
  @Get('/userLogs/users/:userId')
  @Roles(UserRoles.SUPER_ADMIN)
  async getUserLogsByUserId(@Param('userId') userId: string) {
    return await this.superAdminService.getUserLogsByUserId(userId);
  }

  @ApiOperation({
    summary: 'add commission percentage',
  })
  @Post('/commissions')
  @Roles(UserRoles.SUPER_ADMIN)
  async addCommisionPercentage(@Body(ValidationPipe) body: CommissionDto) {
    return await this.superAdminService.addCommisionPercentage(
      body.percentageNumber,
    );
  }

  @ApiOperation({
    summary: 'get commission percentage',
  })
  @Get('/commissions')
  @Roles(UserRoles.SUPER_ADMIN)
  async getAllCommisionPercentage() {
    return await this.superAdminService.getAllCommisionPercentage();
  }

  @ApiOperation({
    summary: 'update commission percentage',
  })
  @Patch('/commissions/:commissionId')
  @Roles(UserRoles.SUPER_ADMIN)
  async updateCommisionPercentage(
    @Param('commissionId') commissionId: string,
    @Body(ValidationPipe) body: UpdateCommissionDto,
  ) {
    return await this.superAdminService.updateCommisionPercentage(
      commissionId,
      body,
    );
  }

  @ApiOperation({
    summary: 'Upload a User documents',
  })
  @Patch('/users/:userId/document')
  @Roles(UserRoles.SUPER_ADMIN)
  async updateBuilderDocs(
    @Body(ValidationPipe) body: AdminUploadDocumentsDto,
    @Param('userId') userId: string,
  ) {
    return await this.superAdminService.updateUserDocuments(body, userId);
  }
}
