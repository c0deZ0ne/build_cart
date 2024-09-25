import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  UseGuards,
  ValidationPipe,
  Delete,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { BuilderGuard } from 'src/modules/auth/guards/builder.guard';
import { GetUser } from 'src/modules/auth/user.decorator';
import { ProjectService } from 'src/modules/project/project.service';
import { User } from 'src/modules/user/models/user.model';
import { CreateProjectDto } from './dto';
import { RfqService } from 'src/modules/rfq/rfq.service';
import { BuilderProjectService } from './builder-project.service';
import { BuilderCreateProjectDto } from './dto/create-project.dto';
import {
  DeleteProjectDocumentDto,
  updateProjectDto,
} from '../project/dto/create-project.dto';
import { TenderBidDto } from './dto/submit-tender.dto';
import { SubmittedBids } from './types';
import { UseSubscription } from '../platfrom-subscription/platform-subscription.decorator';

@Controller('builder')
@ApiTags('builder')
@ApiBearerAuth()
@UseGuards(BuilderGuard)
@UseSubscription()
export class BuilderProjectController {
  constructor(
    private readonly projectService: ProjectService,
    private readonly builderProjectService: BuilderProjectService,
    private readonly rfqService: RfqService,
  ) {}

  @ApiOperation({
    summary: 'Create a project',
  })
  @Post('project/')
  async createProject(
    @GetUser() user: User,
    @Body(ValidationPipe) body: BuilderCreateProjectDto,
  ) {
    return await this.builderProjectService.createProject({ body, user });
  }

  @ApiQuery({
    name: 'search',
    required: false,
    description:
      'Search query for Project. Searches in fields: Project title, location, ',
  })
  @ApiOperation({
    summary: 'company projects',
  })
  @Get('/projects')
  async getAllProjects(@GetUser() user: User, @Query('search') search: string) {
    return await this.builderProjectService.getCompanyProject({ user, search });
  }

  @ApiQuery({
    name: 'search',
    required: false,
    description:
      'Search query for Project. Searches in fields: Project title, location, ',
  })
  @ApiOperation({
    summary: 'Fund Manager Financed Projects',
  })
  @Get('/fund-manager-projects')
  async getAllProjectsFinancedByFundManager(
    @GetUser() user: User,
    @Query('search') search: string,
  ) {
    const projects =
      await this.builderProjectService.getAllProjectsFinancedByFundManager(
        user.BuilderId,
        search,
      );
    return { projects };
  }

  @ApiOperation({
    summary: 'Get builder sponsored projects statistics',
  })
  @Get('sponsored-projects/statistics')
  async getSponsoredProjectStatistics(@GetUser() user: User) {
    return await this.builderProjectService.getSponsoredProjectsStatistics(
      user,
    );
  }

  @ApiOperation({
    summary: 'Update project title',
  })
  @Patch('project/:id')
  async updateProjectTitle(
    @Param('id') projectId: string,
    @GetUser() user: User,
    @Body(ValidationPipe) body: CreateProjectDto,
  ) {
    await this.projectService.updateProjectTitle(projectId, body.title, user);
  }

  @ApiOperation({
    summary: 'Update project details',
  })
  @Patch('project/:id/update')
  async updateProject(
    @Param('id') projectId: string,
    @Body(ValidationPipe) data: updateProjectDto,
    @GetUser() user: User,
  ) {
    return await this.builderProjectService.updateProject(
      projectId,
      data,
      user,
    );
  }

  @ApiOperation({
    summary: 'Delete a project Media or Document',
  })
  @Patch('project/:projectId/delete-media')
  async deleteProjectMediaOrDocument(
    @GetUser() user: User,
    @Param('projectId') projectId: string,
    @Body(ValidationPipe) body: DeleteProjectDocumentDto,
  ) {
    return await this.projectService.deleteProjectMediaOrDocument(
      projectId,
      body,
      user,
    );
  }

  @ApiOperation({
    summary: 'get project details',
  })
  @Get('project/:projectId/details')
  async getProjectDetails(@Param('projectId') projectId: string) {
    return await this.builderProjectService.getProjectDetails(projectId);
  }

  @ApiOperation({
    summary: 'move project to completed if no ongoing or pending activities',
  })
  @Get('project/:projectId/complete')
  async moveToCompletedProject(
    @Param('projectId') projectId: string,
    @GetUser() user: User,
  ) {
    return await this.builderProjectService.moveToCompleted({
      projectId,
      user,
    });
  }
  @ApiOperation({
    summary: 'Get project statistics',
  })
  @Get('project/statistics')
  async getCompanyProjectStatistics(@GetUser() user: User) {
    return await this.builderProjectService.getCompanyProjectStatistics(user);
  }

  @ApiOperation({
    summary: 'All Project Invitations listing',
  })
  @Get('project/invitation-listing')
  async getProjectInvitations(@GetUser() user: User) {
    return await this.builderProjectService.getBuilderProjectInvitations({
      user,
    });
  }

  @ApiOkResponse({
    description: 'Tender response for project bid by builder',
    type: Promise<TenderBidDto>,
  })
  @ApiOperation({
    summary: 'Bid on a project',
  })
  @Post('project/doc-tender')
  async bid(
    @GetUser() user: User,
    @Body(ValidationPipe) body: TenderBidDto,
  ): Promise<TenderBidDto> {
    return await this.builderProjectService.bidForProject({
      user,
      body,
    });
  }
  @ApiOkResponse({
    description: 'get submitted bids by user',
    type: Promise<SubmittedBids>,
  })
  @ApiOperation({
    summary: 'Get all project bids submitted',
  })
  @Get('project/submitted-tenders')
  async builderSubmitted(
    @GetUser() user: User,
  ): Promise<Partial<SubmittedBids[]> | []> {
    return await this.builderProjectService.builderSubmitted({
      user,
    });
  }
  @ApiOkResponse({
    description: 'get accepted tenders ',
    type: Promise<SubmittedBids[]>,
  })
  @ApiOperation({
    summary: 'Get accepted project bids ',
  })
  @Get('project/accepted-tenders')
  async builderAcceptedBid(
    @GetUser() user: User,
  ): Promise<Partial<SubmittedBids[]> | []> {
    return await this.builderProjectService.builderAcceptedBid({
      user,
    });
  }

  @ApiOkResponse({
    description: 'get accepted tenders ',
    type: Promise<SubmittedBids[]>,
  })
  @ApiOperation({
    summary: 'view bid details invitations-listings',
  })
  @Get('project/:bidId/tender-view')
  async tenderDetails(@GetUser() user: User, @Param('bidId') bidId: string) {
    return await this.builderProjectService.tenderDetails({
      user,
      bidId,
    });
  }

  @ApiOperation({
    summary: 'Remove Project Invitations',
  })
  @Delete('project-invitation/:tenderId/remove')
  async deleteProjectInvitation(
    @GetUser() user: User,
    @Param('tenderId') tenderId: string,
  ) {
    return await this.builderProjectService.removeProjectInvite({
      user,
      tenderId,
    });
  }

  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search query for rfq. Searches in fields:  title ',
  })
  @ApiOperation({
    summary: 'Retrieve RFQs for project',
  })
  @Get('project/:projectId/rfq')
  async getRequestsForProject(
    @Param('projectId') ProjectId: string,
    @GetUser() user: User,
    @Query('search') search: string,
  ) {
    return await this.rfqService.getProjectRfq({
      ProjectId,
      user,
      search,
    });
  }

  @ApiOperation({
    summary: 'Get builder invited projects',
  })
  @Get('projects/invitation')
  async getBuilderInvitedProjects(@GetUser() user: User) {
    return await this.builderProjectService.getBuilderInvitedProjects(user);
  }
}
