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
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/modules/auth/user.decorator';
import { User, UserStatus, UserType } from 'src/modules/user/models/user.model';
import { Roles } from '../auth/decorators/roles.decorators';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRoles } from '../rbac/models/role.model';
import { AddTeamMemberDto } from './dto/add-team-member.dto';
import { TeamService } from './team.service';
import { UpdateTeamMemberDto } from './dto/update-memeber.dto';

@Controller('team')
@ApiTags('team')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @ApiOperation({
    summary: 'Add a team member',
  })
  @Post()
  @Roles(UserRoles.SUPER_ADMIN, UserRoles.ADMIN)
  async addTeamMember(
    @GetUser()
    { BuilderId, VendorId, userType, id, email, name, FundManagerId }: User,
    @Body(ValidationPipe) body: AddTeamMemberDto,
  ) {
    const { role, ...rest } = body;
    const userToCreate = rest as Partial<User>;
    userToCreate.BuilderId = BuilderId;
    userToCreate.VendorId = VendorId;
    userToCreate.FundManagerId = FundManagerId;
    userToCreate.userType =
      userType == UserType.FUND_MANAGER ? UserType.BUILDER : userType;
    await this.teamService.addTeamMember(
      userToCreate,
      {
        id,
        email,
        name,
      },
      role,
    );
  }

  @ApiOperation({
    summary: 'Retrieve team members',
  })
  @ApiQuery({
    name: 'search_param',
    type: String,
    required: false,
    example: 'johndoe@gmail.com',
  })
  @ApiQuery({
    name: 'page_size',
    type: String,
    required: false,
    example: '100',
  })
  @Get(':teamId')
  async getTeamMembers(
    @GetUser() user: User,
    @Param('teamId') teamId: string,
    @Query('search_param') search_param: string,
  ) {
    return await this.teamService.getTeamMembers({
      user,
      teamId,
      search_param,
    });
  }

  @ApiOperation({
    summary: `update a team member's details`,
  })
  @Patch(':teamMemberUserId/:teamId')
  @Roles(UserRoles.SUPER_ADMIN, UserRoles.ADMIN)
  async updateTeamMember(
    @GetUser() user: User,
    @Param('teamMemberUserId') teamMemberUserId: string,
    @Param('teamId') teamId: string,
    @Body(ValidationPipe) body: UpdateTeamMemberDto,
  ) {
    return await this.teamService.updateTeamMember({
      user,
      teamMemberUserId,
      teamId,
      data: body,
    });
  }

  @ApiOperation({
    summary: "Pause or unpause a team member's operation",
  })
  @ApiQuery({
    name: 'status',
    type: String,
    required: true,
    example: 'PAUSED',
    examples: {
      PAUSED: { summary: 'Paused status example', value: 'PAUSED' },
      ACTIVE: { summary: 'Active status example', value: 'ACTIVE' },
    },
  })
  @Patch('update-member-status/:teamId/:teamMemberUserId')
  @Roles(UserRoles.SUPER_ADMIN, UserRoles.ADMIN)
  async pauseOrUnpauseTeamMemberOperation(
    @GetUser() user: User,
    @Param('teamId') teamId: string,
    @Query('status') status: UserStatus,
    @Param('teamMemberUserId') teamMemberUserId: string,
  ) {
    return await this.teamService.changeTeamMemberStatus({
      user,
      teamMemberUserId,
      teamId,
      status,
    });
  }

  @ApiOperation({
    summary: 'Remove a Team member',
  })
  @Delete('delete-team-member/:teamMemberUserId/:teamId')
  @Roles(UserRoles.SUPER_ADMIN, UserRoles.ADMIN)
  async deleteTeamMember(
    @GetUser() user: User,
    @Param('teamMemberUserId') teamMemberUserId: string,
    @Param('teamId') teamId: string,
  ) {
    return await this.teamService.deleteTeamMember({
      user,
      teamMemberUserId,
      teamId,
    });
  }
}
