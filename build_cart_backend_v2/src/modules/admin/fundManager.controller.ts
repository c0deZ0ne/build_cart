import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from 'src/modules/auth/guards/admin.guard';
import { Invitation } from '../invitation/models/invitation.model';
import { GetUser } from '../auth/user.decorator';
import { CreateInvitationDto } from '../invitation/dto/create-invitation.dto';
import { User } from '../user/models/user.model';
import { InvitationService } from '../invitation/invitation.service';
// import { SharedProjectService } from '../shared-project/service';
import { ProjectService } from '../project/project.service';
import { AdminCreateProject } from './dto/adminCreateProject';
import { adminShareProjectDto } from './dto/adminShareProjectDto';
import { UserService } from '../user/user.service';
import { AdminProjectService } from './admin.project.service';
import { CreateProjectDto } from '../builder/dto';
import { FundManagerService } from '../fund-manager/fundManager.service';
import { RegisterFundManagerDto } from '../fund-manager/dto/register-fundManager.dto';

@Controller('admin')
@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(AdminGuard)
export class SponsorController {
  constructor(
    private readonly invitationService: InvitationService,
    private readonly fundManagerService: FundManagerService,
    // private readonly sharedProjectService: SharedProjectService,
    private readonly projectService: ProjectService,
    private adminProjectService: AdminProjectService,
    private readonly userService: UserService,
  ) {}

  @ApiOperation({
    summary: 'Return all fundManagers',
  })
  @Get('/fundManager')
  async getAllUsers() {
    return await this.fundManagerService.getAllSponsors();
  }

  @ApiOperation({
    summary: 'Register a fundManager',
  })
  @Post('/fundManager')
  async registerSponsor(
    @Body(ValidationPipe) body: RegisterFundManagerDto,
    @GetUser() user: User,
  ) {
    return await this.fundManagerService.AdminRegisterSponsor({
      body,
      creator: user,
    });
  }

  @ApiOperation({
    summary: 'Invite a Builder to the platform',
  })
  @Post('/fundManager/invite/builder')
  async createInvite(
    @Body(ValidationPipe) body: CreateInvitationDto,
    @GetUser() user: User,
  ) {
    return await this.invitationService.createInvitation(body, user);
  }

  @ApiOperation({
    summary: 'Get all fundManager invitations',
  })
  @UsePipes(ValidationPipe)
  @Get('fundManager/invites/:FundManagerId')
  async getAllInvitationsByFundManagerId(
    @Param('FundManagerId') FundManagerId: string,
  ): Promise<Invitation[]> {
    return await this.invitationService.getInvitationByFundManagerId(
      FundManagerId,
    );
  }

  @ApiOperation({
    summary: 'get project details from admin panel',
  })
  @UsePipes(ValidationPipe)
  @Get('projects/:projectId')
  async getProjectById(
    @GetUser() user: User,
    @Param('projectId') projectId: string,
  ) {
    return await this.projectService.getProjectOrThrow(projectId);
  }

  @ApiOperation({
    summary: 'admin get fundManager customers',
  })
  @Get('fundManager/:email/customers')
  async getSponsorCustomers(@Param('email') email: string) {
    return await this.adminProjectService.adminSponsorCustomerList(email);
  }

  @ApiOperation({
    summary: 'share a project with anyone from admin panel',
  })
  @UsePipes(ValidationPipe)
  @Post('projects/share')
  async shareProjectForUser(@Body() body: adminShareProjectDto) {
    const data = await this.adminProjectService.adminShareProject(body);
    return data;
  }

  @ApiOperation({
    summary: 'create a project for fundManager or a builder admin panel',
  })
  @UsePipes(ValidationPipe)
  @Post('projects/create')
  async createSponsorProject(@Body() body: AdminCreateProject) {
    return await this.adminProjectService.AdminCreateProjectForSponsor(body);
  }

  @ApiOperation({
    summary: 'update project from admin panel',
  })
  @UsePipes(ValidationPipe)
  @Patch('projects/:projectId')
  async updateProject(
    @Body() body: CreateProjectDto,
    @GetUser() user: User,
    @Param('projectId') projectId: string,
  ) {
    await this.projectService.updateProjectTitle(projectId, body.title, user);
  }

  @ApiOperation({
    summary: 'admin fundManager-builder project list',
  })
  @UsePipes(ValidationPipe)
  @Get('projects/:fundManagerId/:builderId')
  async projectsDetails(
    @Param('fundManagerId') fundManagerId: string,
    @Param('builderId') builderId: string,
  ) {
    return await this.adminProjectService.adminBuilderFundManagerProjectDetails(
      {
        BuilderId: builderId,
        FundManagerId: fundManagerId,
      },
    );
  }
}
