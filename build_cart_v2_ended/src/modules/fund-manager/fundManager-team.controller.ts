import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiParam,
  ApiOperation,
  ApiOkResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { SponsorTeamService } from './fundManager-team.service';
import { Team } from '../rbac/models/team.model';
import { SponsorGuard } from '../auth/guards/fundManager.guard';
import { GetUser } from '../auth/user.decorator';
import { User } from '../user/models/user.model';
import { CreateNewTeamMember } from './dto/team-member.dto';
import { CaslPermissions } from '../auth/casl-prmission.decorator';
import { CaslGuard } from '../auth/guards/casl.guard';
import { Resources, SystemRolls } from '../auth/types';
import { SponsorTeamMemberService } from './fundManager-team-member.service';
import { Role } from '../rbac/models/role.model';

@Controller('/fundManager')
@ApiTags('fundManager')
@ApiBearerAuth()
@UseGuards(SponsorGuard)
export class SponsorTeamController {
  constructor(private readonly fundManagerTeamService: SponsorTeamService) {}

  @Post('/team/:id')
  @ApiOperation({ summary: 'Register user/add member into this team' })
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ type: CreateNewTeamMember })
  @CaslPermissions(Resources.TeamMember, [
    SystemRolls.OWNER,
    SystemRolls.SUPER_ADMIN,
    SystemRolls.MANAGER,
    SystemRolls.ADMIN,
  ])
  @UseGuards(CaslGuard)
  registerNewTeamMember(
    @GetUser() user: User,
    @Body(ValidationPipe) body: CreateNewTeamMember,
  ): Promise<User> {
    return this.fundManagerTeamService.createNewTeamMember({ user, body });
  }

  @Get('/teams')
  @ApiOperation({ summary: 'Get all FundManager Teams' })
  @ApiOkResponse({ type: Team, isArray: true })
  findAll(@GetUser() user: User): Promise<Team[]> {
    return this.fundManagerTeamService.findAll({ user });
  }

  @Get('/team/:teamId/memebers')
  @ApiOperation({
    summary: 'get all team members ',
  })
  @ApiParam({ name: 'teamId', type: String })
  @ApiOkResponse({ type: [CreateNewTeamMember] })
  @CaslPermissions(Resources.TeamMember, [
    SystemRolls.OWNER,
    SystemRolls.SUPER_ADMIN,
    SystemRolls.MANAGER,
    SystemRolls.ADMIN,
  ])
  @UseGuards(CaslGuard)
  getAllTeamMember(
    @GetUser() user: User,
    @Param('teamId') teamId: string,
  ): Promise<Team> {
    return this.fundManagerTeamService.getAllTeamMembers({ user, teamId });
  }

  @Get('/roles')
  @ApiOperation({
    summary: 'get all roles ',
  })
  @ApiOkResponse({ type: [Role] })
  @CaslPermissions(Resources.TeamMember, [
    SystemRolls.OWNER,
    SystemRolls.SUPER_ADMIN,
    SystemRolls.MANAGER,
    SystemRolls.ADMIN,
  ])
  @UseGuards(CaslGuard)
  getAllroles(@GetUser() user: User): Promise<Role[]> {
    return this.fundManagerTeamService.getAllRoles({ user });
  }
}
