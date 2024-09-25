import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUser } from '../auth/user.decorator';
import { User } from '../user/models/user.model';
import {
  CreateGroupNameDto,
  EditProjectGroupDto,
} from './dto/creeate-group.dto';
import { ProjectGroupService } from './group.service';
import { SponsorGuard } from '../auth/guards/fundManager.guard';
import { CreateProjectGroupDto } from './dto/add-project-toGroup.dto';

@Controller('project-group')
@ApiTags('project-group')
@ApiBearerAuth()
@UseGuards(SponsorGuard)
export class ProjectGroupController {
  constructor(private readonly projectGroupService: ProjectGroupService) {}

  @ApiOperation({
    summary: 'Create a new project group',
  })
  @Post('create')
  async createProjectGroup(
    @GetUser() user: User,
    @Body(ValidationPipe) createGroupNameDto: CreateGroupNameDto,
  ) {
    return await this.projectGroupService.createGroup({
      body: createGroupNameDto,
      user,
    });
  }

  @ApiOperation({
    summary: 'Edit existing group',
  })
  @Post('edit')
  async EditProjectGroup(
    @Body(ValidationPipe) editGroupDto: EditProjectGroupDto,
  ) {
    return await this.projectGroupService.editGroup({
      body: editGroupDto,
    });
  }

  @ApiOperation({
    summary: 'Add project to a group',
  })
  @Post('addProject')
  async addProjectToGroup(
    @GetUser() user: User,
    @Body(ValidationPipe) addProjectToGroupDto: CreateProjectGroupDto,
  ) {
    return await this.projectGroupService.addProjectToGroup({
      body: addProjectToGroupDto,
      user,
    });
  }

  @ApiOperation({
    summary: 'Get project groups of a users',
  })
  @Get('')
  async getProjectGroups(@GetUser() user: User) {
    return await this.projectGroupService.getGroups(user);
  }

  @ApiOperation({
    summary: 'Get a group details',
  })
  @Get(':groupId/details')
  async getGroupDetails(@Param('groupId') groupId: string) {
    return await this.projectGroupService.getGroupById(groupId);
  }
}
