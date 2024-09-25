import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { SuperAdminBuilderService } from './super-admin-builder.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
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
import { superAdminCreateBuilderProjectDto } from './dto/super-admin-create-builder-projectDto';
import {
  UpdateBuilderDto,
  superAdminCreateBuilderDto,
} from './dto/super-admin-create-builderDto';
import { RfqService } from '../rfq/rfq.service';
import { CreateRfqRequestDto } from '../builder/dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadFileDto } from '../material-schedule-upload/dto/upload-file.dto';
import { RfqUploadTypeBody } from '../material-schedule-upload/type/rfq-upload-material';
import { MaterialService } from '../material-schedule-upload/material.service';
import { AdminUploadDocumentsDto } from './dto/super-admin-invite-vendorDto';

@Controller('superAdmin')
@ApiTags('superAdmin-builder')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class superAdminBuilderController {
  constructor(
    private readonly builderService: SuperAdminBuilderService,
    private readonly rfqService: RfqService,
    private readonly materialService: MaterialService,
  ) {}

  @ApiOperation({
    summary: 'Create Builders',
  })
  @Post('/builders')
  @Roles(UserRoles.SUPER_ADMIN)
  async createBuilder(
    @Body(ValidationPipe) body: superAdminCreateBuilderDto,
    @GetUser() user: User,
  ) {
    return await this.builderService.createBuilder(body, user.id);
  }

  @ApiOperation({
    summary: 'Create Builder Project',
  })
  @Post('/builders/:builderId/projects')
  @Roles(UserRoles.SUPER_ADMIN)
  async createBuilderProject(
    @Body(ValidationPipe) body: superAdminCreateBuilderProjectDto,
    @Param('builderId') builderId: string,
    @GetUser() user: User,
  ) {
    return await this.builderService.createBuilderProject(
      body,
      builderId,
      user.id,
    );
  }

  @ApiOperation({
    summary: 'Create Builder Project rfq by builderId',
  })
  @Post('/builders/:builderId/rfqs')
  @Roles(UserRoles.SUPER_ADMIN)
  async createBuilderProjectRfq(
    @Body(ValidationPipe) body: CreateRfqRequestDto,
    @Param('builderId') builderId: string,
  ) {
    const user = await this.builderService.getBuilderDetails(builderId);

    return await this.rfqService.createRequest(body, user);
  }

  @ApiOperation({
    summary: 'Upload builder material schedule document',
  })
  @Post('/builder/material-schedule-upload')
  @UseInterceptors(FileInterceptor('materialSchedule'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description:
      'CSV or Excel file to upload from downloaded material schedule template',
    type: UploadFileDto,
  })
  async uploadFile(@UploadedFile() file: any, @Body() body: RfqUploadTypeBody) {
    return await this.materialService.uploadFile(file, body);
  }

  @ApiOperation({
    summary: 'Get all Builders',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description:
      'Search query for Builders. Searches by builders businessName ',
  })
  @Get('/builders')
  @Roles(UserRoles.SUPER_ADMIN)
  async getbuilders(@Query('search') search?: string) {
    return await this.builderService.getBuilders(search);
  }

  @ApiOperation({
    summary: 'Get all Builders Projects',
  })
  @Get('/builders/projects')
  @Roles(UserRoles.SUPER_ADMIN)
  async getbuilderProjects() {
    return await this.builderService.getBuildersProjects();
  }

  @ApiOperation({
    summary: 'Get a Builder Project by projectId',
  })
  @Get('/builders/projects/:projectId')
  @Roles(UserRoles.SUPER_ADMIN)
  async getbuilderProjectByProjectId(@Param('projectId') projectId: string) {
    return await this.builderService.getProjectDetails(projectId);
  }

  @ApiOperation({
    summary: 'Update a Builder profile',
  })
  @Patch('/builders/:builderId/profile')
  @Roles(UserRoles.SUPER_ADMIN)
  async updateBuilderProfile(
    @Body(ValidationPipe) body: UpdateBuilderDto,
    @Param('builderId') builderId: string,
  ) {
    return await this.builderService.updateBuilderProfile(body, builderId);
  }

  @ApiOperation({
    summary: 'Get all Builder projects by builderId',
  })
  @Get('/projects/builders/:builderId')
  @Roles(UserRoles.SUPER_ADMIN)
  async getBuilderProjects(@Param('builderId') builderId: string) {
    return await this.builderService.getBuilderProjects(builderId);
  }

  @ApiOperation({
    summary: 'Get a Builder data by builderId',
  })
  @Get('/builders/:builderId')
  @Roles(UserRoles.SUPER_ADMIN)
  async getBuilderById(@Param('builderId') builderId: string) {
    return await this.builderService.getBuilderById(builderId);
  }

  @ApiOperation({
    summary: 'assign a ProcurementManagers to a Builder profile',
  })
  @Patch('/builders/:builderId/procurementManagers')
  @Roles(UserRoles.SUPER_ADMIN)
  async assignProcurementManagersTobuilders(
    @Param('builderId') builderId: string,
    @Query('procurementManagerUserId') procurementManagerUserId: string,
  ) {
    return await this.builderService.assignProcurementManagersToBuilders(
      builderId,
      procurementManagerUserId,
    );
  }

  @ApiOperation({
    summary: 'Upload a Bulder documents',
  })
  @Patch('/builders/:builderId/document')
  @Roles(UserRoles.SUPER_ADMIN)
  async updateBuilderDocs(
    @Body(ValidationPipe) body: AdminUploadDocumentsDto,
    @Param('builderId') builderId: string,
  ) {
    return await this.builderService.updateBuilderDocuments(body, builderId);
  }

  @ApiOperation({
    summary: 'get all RFQs Bids',
  })
  @Get('/rfqs/:rfqRequestId/bids')
  @Roles(UserRoles.SUPER_ADMIN)
  async getBidsForRequest(@Param('rfqRequestId') rfqRequestId: string) {
    return await this.rfqService.getBidsForRequest({ rfqRequestId });
  }

  @ApiOperation({
    summary: 'get RFQs order',
  })
  @Get('/orders/:builderId')
  @Roles(UserRoles.SUPER_ADMIN)
  async getOrders(@Param('builderId') builderId: string) {
    return await this.builderService.getOrders(builderId);
  }
}
