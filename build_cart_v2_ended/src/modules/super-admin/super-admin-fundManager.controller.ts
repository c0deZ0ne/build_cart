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
import { SuperAdminFundManagerService } from './super-admin-fundManager.service';
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
import { superAdminCreateFundManageProjectDto } from './dto/super-admin-create-fundManager-project';
import { superAdminCreateFundManagerDto } from './dto/super-admin-create-fundManagerDto';
import { UpdateFundManagerDto } from './dto/super-admin-update-fund-manager-dto';
import { FundManagerProjectService } from '../fund-manager/fundManager-project.services';

@Controller('superAdmin')
@ApiTags('superAdmin-fundManager')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class superAdminFundManagerController {
  constructor(
    private readonly fundManagerProjectService: FundManagerProjectService,
    private readonly superAdminFundManagerService: SuperAdminFundManagerService,
  ) {}

  @ApiOperation({
    summary: 'Create Fund Managers',
  })
  @Post('/fundManagers')
  @Roles(UserRoles.SUPER_ADMIN)
  async createFundManager(
    @Body(ValidationPipe) body: superAdminCreateFundManagerDto,
    @GetUser() user: User,
  ) {
    return await this.superAdminFundManagerService.createFundManager(
      body,
      user.id,
    );
  }

  @ApiOperation({
    summary: 'Create FundManager Project',
  })
  @Post('/fundManagers/:fundmanagerId/projects')
  @Roles(UserRoles.SUPER_ADMIN)
  async createFundManagerProject(
    @Body(ValidationPipe) body: superAdminCreateFundManageProjectDto,
    @Param('fundmanagerId') fundmanagerId: string,
    @GetUser() user: User,
  ) {
    return await this.superAdminFundManagerService.createFundManagerProject(
      body,
      fundmanagerId,
      user.id,
    );
  }

  @ApiOperation({
    summary: 'Get all Fund Managers',
  })
  @Get('/fundManagers')
  @Roles(UserRoles.SUPER_ADMIN)
  async getFundManagers() {
    return await this.superAdminFundManagerService.getFundManagers();
  }

  @ApiOperation({
    summary: 'Get a Fund Managers by fundmanagerId',
  })
  @Get('/fundManagers/:fundmanagerId')
  @Roles(UserRoles.SUPER_ADMIN)
  async getFundManagerById(@Param('fundmanagerId') fundmanagerId: string) {
    return await this.superAdminFundManagerService.getFundManagerById(
      fundmanagerId,
    );
  }

  @ApiOperation({
    summary: 'Get all Projects',
  })
  @Get('/projects')
  @Roles(UserRoles.SUPER_ADMIN)
  async getProjects() {
    return await this.superAdminFundManagerService.getProjects();
  }

  @ApiOperation({
    summary: 'Get Fund Managers Projects by search',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description:
      'Search query for fundmanager projects. Searches by fund manager businessName ',
  })
  @Get('/projects/fundmanagers')
  @Roles(UserRoles.SUPER_ADMIN)
  async getFundManagerProjectsSearch(@Query('search') search: string) {
    return await this.superAdminFundManagerService.getProjectsByFundManagerBusinessName(
      search,
    );
  }

  @ApiOperation({
    summary: 'Get Fund Managers Project by ProjectId',
  })
  @Get('/fundManagers/projects/:projectId')
  @Roles(UserRoles.SUPER_ADMIN)
  async getFundManagerProjectByProjectId(
    @Param('projectId') projectId: string,
  ) {
    return await this.superAdminFundManagerService.getFundManagerProjectByProjectId(
      projectId,
    );
  }

  @ApiOperation({
    summary: 'Get Fund Managers Project details by ProjectId',
  })
  @Get('/fundManagers/projects/:projectId/details')
  @Roles(UserRoles.SUPER_ADMIN)
  async getProjectDetails(@Param('projectId') projectId: string) {
    return await this.superAdminFundManagerService.getFundManagerProjectDetails(
      projectId,
    );
  }

  @ApiOperation({
    summary: 'Accept a project bid',
  })
  @Patch('/fundManagers/projects/bids')
  @Roles(UserRoles.SUPER_ADMIN)
  async acceptProjectStatus(
    @Query('projectId') projectId: string,
    @Query('bidId') bidId: string,
  ) {
    return await this.superAdminFundManagerService.acceptProjectStatus(
      projectId,
      bidId,
    );
  }

  @ApiOperation({
    summary: 'Update a Fund Manager profile',
  })
  @Patch('/fundManagers/:fundmanagerId')
  @Roles(UserRoles.SUPER_ADMIN)
  async completeFundManagerProfile(
    @Body(ValidationPipe) body: UpdateFundManagerDto,
    @Param('fundmanagerId') fundmanagerId: string,
  ) {
    return await this.superAdminFundManagerService.completeFundManagerProfile(
      body,
      fundmanagerId,
    );
  }

  @ApiOperation({
    summary: 'assign a ProcurementManagers to a Fund Manager profile',
  })
  @Patch('/procurementManagers/fundManagers/:fundmanagerId')
  @Roles(UserRoles.SUPER_ADMIN)
  async assignProcurementManagersToFundManagers(
    @Param('fundmanagerId') fundmanagerId: string,
    @Query('procurementManagerUserId') procurementManagerUserId: string,
  ) {
    return await this.superAdminFundManagerService.assignProcurementManagersToFundManagers(
      fundmanagerId,
      procurementManagerUserId,
    );
  }

  @ApiOperation({
    summary: 'get all bids',
  })
  @Get('/projects/:projectId/bids')
  @Roles(UserRoles.SUPER_ADMIN)
  async getProjectBids(@Param('projectId') projectId: string) {
    return await this.superAdminFundManagerService.getBids(projectId);
  }

  @ApiOperation({
    summary: 'get a bid by bidId',
  })
  @Get('/bids/:bidId/')
  @Roles(UserRoles.SUPER_ADMIN)
  async getBidById(@Param('bidId') bidId: string) {
    return await this.superAdminFundManagerService.getBidById(bidId);
  }

  @ApiOperation({
    summary: 'Retrieve bids for request',
  })
  @Get('rfq/:rfqRequestId/bids')
  async getBidsForRequest(@Param('rfqRequestId') rfqRequestId: string) {
    return await this.fundManagerProjectService.getBidsForRFQ(rfqRequestId);
  }
}
