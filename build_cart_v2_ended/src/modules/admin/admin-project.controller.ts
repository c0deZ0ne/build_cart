import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { GetUser } from '../auth/user.decorator';
import { User } from '../user/models/user.model';

import { AdminGuard } from '../auth/guards/admin.guard';
import { AdminProjectService } from './admin.project.service';

@Controller('admin')
@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(AdminGuard)
export class AdminProjectController {
  constructor(private readonly adminProjectService: AdminProjectService) {}

  @ApiOperation({
    summary: 'get all projects ',
  })
  @Get('/projects')
  async createRole(@GetUser() user: User) {
    return this.adminProjectService.getAdminAllProjects({ user });
  }
  @ApiOperation({
    summary: 'get details of projects ',
  })
  @Get('/project/:projectId')
  async adminGetProjectDetails(
    @GetUser() user: User,
    @Param('projectId') projectId: string,
  ) {
    return this.adminProjectService.adminGetProjectDetails({ user, projectId });
  }
}
