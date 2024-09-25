import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Get,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ProjectSharesService } from './share.service';
import { ProjectShares } from './models/project-shared.model';
import {
  CreateProjectSharesDto,
  ResponseProjectInviteDto,
} from './dto/share-project.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../user/models/user.model';
import { GetUser } from '../auth/user.decorator';

@Controller('project-shares')
@ApiTags('Project Shares')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class ProjectSharesController {
  constructor(private readonly projectSharesService: ProjectSharesService) {}

  @Post()
  @ApiOperation({ summary: 'Create Project Shares' })
  @ApiResponse({
    status: 201,
    description: 'Project Shares created successfully',
    type: ProjectShares,
  })
  async create(
    @Body() createProjectSharesDto: CreateProjectSharesDto,
    @GetUser() user: User,
  ): Promise<ProjectShares> {
    return this.projectSharesService.create({
      body: createProjectSharesDto,
      user,
    });
  }
  @Get('/me')
  @ApiOperation({ summary: 'get Project Shared with me' })
  @ApiResponse({
    status: 201,
    description: 'Project Shares  successfully gotten',
    type: ProjectShares,
  })
  async getMySharedProjects(@GetUser() user: User): Promise<unknown> {
    return await this.projectSharesService.getAllSharedProjectsForUser({
      user,
    });
  }
  @Get('/invites/me')
  @ApiOperation({ summary: 'get Project Shared with me' })
  @ApiResponse({
    status: 201,
    description: 'Project Shares  successfully gotten',
    type: ResponseProjectInviteDto,
  })
  async getInvites(@GetUser() user: User): Promise<unknown> {
    return await this.projectSharesService.getInvitesPending({
      user,
    });
  }

  @Patch('/:sharedId/accept')
  @ApiOperation({ summary: 'Accept Project Shares' })
  @ApiResponse({
    status: 200,
    description: 'Project Shares updated successfully',
    type: ProjectShares,
  })
  async update(
    @Param('sharedId') sharedId: string,
    @GetUser() user: User,
  ): Promise<unknown> {
    return this.projectSharesService.acceptProjectInvite({
      sharedId,
      user,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Project Shares by ID' })
  @ApiResponse({
    status: 200,
    description: 'Project Shares retrieved successfully',
    type: ProjectShares,
  })
  async findOne(@Param('id') id: string): Promise<ProjectShares> {
    return this.projectSharesService.findOne(id);
  }

  @Delete('/:sharedId')
  @ApiOperation({ summary: 'decline Project Shares by ID' })
  @ApiResponse({
    status: 204,
    description: 'Project Shares declined successfully',
  })
  async remove(
    @Param('sharedId') sharedId: string,
    @GetUser() user: User,
  ): Promise<unknown> {
    return this.projectSharesService.remove({ user, sharedId });
  }
}
