import {
  Body,
  Controller,
  Delete,
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
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { SponsorGuard } from 'src/modules/auth/guards/fundManager.guard';
import { GetUser } from 'src/modules/auth/user.decorator';
import { User } from 'src/modules/user/models/user.model';
import {
  SponsorCreateProjectDto,
  fundManagerCreateProjectDto,
} from './dto/create-project.dto';
import { CaslPermissions } from '../auth/casl-prmission.decorator';
import { CaslGuard } from '../auth/guards/casl.guard';
import { Resources, SystemRolls } from '../auth/types';
import { CreateNewTeamMember } from './dto/team-member.dto';
import { FundManagerProjectService } from './fundManager-project.services';
import { UserProjectService } from './fundManager-userproject.service';
import { CreateUserProjectDto } from './dto/user-project.dto';
import { DeleteProjectDocumentDto } from '../project/dto/create-project.dto';
import { ProjectService } from '../project/project.service';
import { InviteBuilderDto } from './dto/invite-builder.dto';
import { randomUUID } from 'crypto';
import { UseSubscription } from '../platfrom-subscription/platform-subscription.decorator';

@Controller('fundManager')
@ApiTags('fundManager')
@ApiBearerAuth()
  @UseGuards(SponsorGuard)
  @UseSubscription()
export class ProjectController {
  constructor(
    private readonly fundManagerProjectService: FundManagerProjectService,
    private readonly userProjectService: UserProjectService,
    private readonly projectService: ProjectService,
  ) {}

  @ApiOperation({
    summary: 'Create a project',
  })
  @Post('project/')
  @ApiOkResponse({ type: fundManagerCreateProjectDto })
  async createProject(
    @GetUser() user: User,
    @Body(ValidationPipe) body: fundManagerCreateProjectDto,
  ) {
    return await this.fundManagerProjectService.createProject({
      body,
      user,
    });
  }

  @ApiOperation({
    summary: 'Edit a project',
  })
  @Patch('project/:projectId/edit')
  @ApiOkResponse({ type: fundManagerCreateProjectDto })
  async UpdateProject(
    @GetUser() user: User,
    @Param('projectId') projectId: string,
    @Body(ValidationPipe) body: fundManagerCreateProjectDto,
  ) {
    return await this.fundManagerProjectService.editProject({
      projectId,
      body,
      user,
    });
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
    summary: 'get user projects',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description:
      'Search query for project. Searches in fields: Project Title, status, location, ',
  })
  @Get('all-projects')
  async myProject(@GetUser() user: User, @Query('search') search: string) {
    return await this.fundManagerProjectService.getAllFundManagerProjects(
      user,
      search,
    );
  }

  @ApiOperation({
    summary: 'Get fund manager projects statistics',
  })
  @Get('projects/statistics')
  async getCompanyProjectStatistics(@GetUser() user: User) {
    return await this.fundManagerProjectService.getProjectsStatistics(user);
  }

  @CaslPermissions(Resources.SharedProjects, [
    SystemRolls.OWNER,
    SystemRolls.SUPER_ADMIN,
    SystemRolls.MANAGER,
    SystemRolls.ADMIN,
  ])
  @UseGuards(CaslGuard)
  @ApiOperation({
    summary: 'add a contractor to a project',
  })
  @Post('project/contractor')
  async addContractor(
    @GetUser() user: User,
    @Body(ValidationPipe) body: CreateUserProjectDto,
  ) {
    return await this.userProjectService.create({ data: body });
  }

  @CaslPermissions(Resources.TeamMember, [
    SystemRolls.OWNER,
    SystemRolls.SUPER_ADMIN,
    SystemRolls.MANAGER,
    SystemRolls.ADMIN,
  ])
  @CaslPermissions(Resources.TeamMember, [
    SystemRolls.OWNER,
    SystemRolls.SUPER_ADMIN,
    SystemRolls.MANAGER,
    SystemRolls.ADMIN,
  ])
  @UseGuards(CaslGuard)
  @ApiOperation({
    summary: 'move project to  completed',
  })
  @Get('project/:projectId/complete')
  async completeAProject(
    @Param('projectId') projectId: string,
    @GetUser() user: User,
  ) {
    return await this.fundManagerProjectService.completeAProject({
      projectId,
      user,
    });
  }

  @ApiOperation({
    summary: 'get all project completed',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description:
      'Search query for project. Searches in fields: Project Title, status, location, ',
  })
  @Get('project/completed')
  async allCompletedProjects(
    @GetUser() user: User,
    @Query('search') search: string,
  ) {
    return await this.fundManagerProjectService.completedProjects(user, search);
  }

  @ApiOperation({
    summary: 'get all active projects',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description:
      'Search query for project. Searches in fields: Project Title, status, location, ',
  })
  @Get('project/active')
  async allActiveProjects(
    @GetUser() user: User,
    @Query('search') search: string,
  ) {
    return await this.fundManagerProjectService.activeProjects(user, search);
  }

  @ApiOperation({
    summary: 'invite a builder',
  })
  @Post('project/:projectId/invite')
  async inviteABuilder(
    @Param('projectId') projectId: string,
    @GetUser() user: User,
    @Body(ValidationPipe) body: InviteBuilderDto,
  ) {
    const { buyerEmail, buyerName, buyerPhone } = body;
    return await this.fundManagerProjectService.inviteBuilder(
      projectId,
      user.FundManagerId,
      user.FundManager.businessName,
      buyerEmail,
      buyerName,
      buyerPhone,
    );
  }

  @ApiOperation({
    summary: 'get all fund manager project invitations',
  })
  @Get('projects/invite')
  async getAllFundManagerProjectsInvitations(@GetUser() user: User) {
    return await this.fundManagerProjectService.getInvitations(
      user.FundManagerId,
    );
  }

  @ApiOperation({
    summary: 'get a fund manager project invitation',
  })
  @Get('projects/invite/:invitationId')
  async getFundManagerProjectInvitationById(
    @GetUser() user: User,
    @Param('invitationId') invitationId: string,
  ) {
    return await this.fundManagerProjectService.getInvitationById(
      user.FundManagerId,
      invitationId,
    );
  }

  @ApiBearerAuth()
  @UseGuards(SponsorGuard)
  @ApiOperation({
    summary: `get project details for a project `,
    description: 'this Api get project order details',
  })
  @ApiParam({
    name: 'projectId',
    description: 'ID of the project',
    example: randomUUID(),
  })
  @ApiOkResponse({
    description: 'Get project  details',
  })
  @Get('project/:projectId/details')
  async getSponsorProjectDetails(
    @Param('projectId') projectId: string,
  ): Promise<unknown> {
    return await this.fundManagerProjectService.getProjectDetails(projectId);
  }

  @ApiOperation({
    summary: 'get a fund manager project statistics',
  })
  @Get('project/dashboard')
  async getProjectDashboardStats(@GetUser() user: User) {
    return await this.fundManagerProjectService.getProjectDashboardSummary(
      user,
    );
  }

  @ApiOperation({
    summary: 'get all tenders for a project by ProjectId',
  })
  @Get('project/:projectId/tenders')
  async getProjectBuildersTender(@Param('projectId') projectId: string) {
    return await this.fundManagerProjectService.getProjectTenders(projectId);
  }

  @ApiOperation({
    summary: 'get a Tender details by id',
  })
  @Get('project/tender/:projectTenderId')
  async getProjectTenderDetails(
    @Param('projectTenderId') projectTenderId: string,
  ) {
    return await this.fundManagerProjectService.getProjectTenderDetails(
      projectTenderId,
    );
  }

  @ApiOperation({
    summary: 'get a TenderBid details  by id',
  })
  @Get('project/tender/:tenderBidId/details')
  async getTenderBidDetails(@Param('tenderBidId') tenderBidId: string) {
    return await this.fundManagerProjectService.getTenderBidDetails(
      tenderBidId,
    );
  }

  @ApiOperation({
    summary: 'get Bids for project',
  })
  @Get('project/:projectId/bids')
  async getBuilderBidsForProject(@Param('projectId') projectId: string) {
    return await this.fundManagerProjectService.getAllProjectTenderBids(
      projectId,
    );
  }

  @ApiOperation({
    summary: 'get project groups',
  })
  @Get('project/:projectId/groups')
  async getProjectGroups(@Param('projectId') projectId: string) {
    return await this.fundManagerProjectService.getProjectGroups(projectId);
  }

  @ApiOperation({
    summary: 'Accept a tender bid for project and close others',
  })
  @Patch('project/bids/:BidId/accept')
  async acceptTenderBidForProject(
    @Param('BidId') BidId: string,
    @GetUser() user: User,
  ) {
    return await this.fundManagerProjectService.acceptTenderBid(BidId, user);
  }

  @ApiOperation({
    summary: 'Retrieve bids for request',
  })
  @Get('rfq/:rfqRequestId/bids')
  async getBidsForRequest(@Param('rfqRequestId') rfqRequestId: string) {
    return await this.fundManagerProjectService.getBidsForRFQ(rfqRequestId);
  }

  @ApiOperation({
    summary: 'Approve a project',
  })
  @Patch('project/:projectId/approve')
  async ApproveProject(
    @Param('projectId') projectId: string,
    @GetUser() user: User,
  ) {
    return await this.fundManagerProjectService.approveProject(projectId, user);
  }

  @ApiOperation({
    summary: 'get disputes/Transactions resolutions',
  })
  @Get('projects/transactions/resolutions')
  async getDisputeResolutions(@GetUser() user: User) {
    return await this.fundManagerProjectService.getTransactionsResolutions(
      user,
    );
  }
}
