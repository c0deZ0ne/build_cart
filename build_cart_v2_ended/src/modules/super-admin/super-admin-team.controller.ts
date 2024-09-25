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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorators';
import { UserRoles } from '../rbac/models/role.model';
import { GetUser } from '../auth/user.decorator';
import { User, UserStatus, UserType } from '../user/models/user.model';
import { TeamService } from '../team/team.service';
import { AddTeamMemberDto } from '../team/dto/add-team-member.dto';
import { UpdateTeamMemberDto } from '../team/dto/update-memeber.dto';

@Controller('superAdmin')
@ApiTags('superAdmin-team')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class superAdminTeamController {
  constructor(private readonly teamService: TeamService) {}

  @ApiOperation({
    summary: 'add member to team',
  })
  @Post('/teams')
  @Roles(UserRoles.SUPER_ADMIN)
  async addTeamMember(
    @GetUser()
    { userType, id, email, name }: User,

    @Body(ValidationPipe) body: AddTeamMemberDto,
  ) {
    const { role, ...rest } = body;
    const userToCreate = rest as Partial<User>;
    userToCreate.userType =
      userType == UserType.FUND_MANAGER ? UserType.BUILDER : userType;
    return await this.teamService.addTeamMember(
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
  @Get('/teams/:teamId')
  @Roles(UserRoles.SUPER_ADMIN)
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
  @Roles(UserRoles.SUPER_ADMIN)
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
  @Roles(UserRoles.SUPER_ADMIN)
  async updateProfile(
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
  @Roles(UserRoles.SUPER_ADMIN)
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
