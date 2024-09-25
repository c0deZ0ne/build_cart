import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreationAttributes, Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import {
  User,
  UserLevel,
  UserStatus,
} from 'src/modules/user/models/user.model';
import { UserService } from 'src/modules/user/user.service';
import { generatePassword } from 'src/util/util';
import { Role } from '../rbac/models/role.model';
import { Team } from '../rbac/models/team.model';
import {
  MEMBER_POSITION,
  TeamMember,
} from '../rbac/models/user-teammembers.model';
import { UpdateTeamMemberDto } from './dto/update-memeber.dto';

@Injectable()
export class TeamService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
    @InjectModel(Team)
    private readonly teamModel: typeof Team,
    @InjectModel(TeamMember)
    private readonly teamMemberModel: typeof TeamMember,
    private readonly userService: UserService,
    private readonly sequelize: Sequelize,
  ) {}

  async addTeamMember(
    userToCreate: CreationAttributes<User>,
    {
      id: creatorId,
      name: creatorName,
    }: { id: string; email: string; name: string },
    role: string,
  ) {
    const dbTransaction = await this.sequelize.transaction();

    try {
      const existingUser = await this.userService.findUser(userToCreate.email);

      let team = await this.teamModel.findOne({
        where: { ownerId: creatorId },
      });

      const adminTeam = await this.findTeamMemberTeam(creatorId);

      if (!team && !adminTeam) {
        team = await this.teamModel.create(
          {
            name: `${creatorName}'s Team`,
            ownerId: creatorId,
            createdById: creatorId,
            updatedById: creatorId,
          },
          { transaction: dbTransaction },
        );

        await this.teamMemberModel.create(
          {
            TeamId: team.id,
            UserId: creatorId,
            createdById: creatorId,
            updatedById: creatorId,
            position: MEMBER_POSITION.OWNER,
          },
          { transaction: dbTransaction },
        );
      }

      if (existingUser) {
        const check = await this.teamMemberModel.findOne({
          where: {
            TeamId: team.id,
            UserId: existingUser.id,
          },
        });
        if (check) {
          throw new BadRequestException('User already belongs to this team');
        }
        const addedTeamMember = await this.teamMemberModel.create(
          {
            TeamId: team.id,
            UserId: existingUser?.id,
            createdById: creatorId,
            updatedById: creatorId,
            position: MEMBER_POSITION.MEMBER,
          },
          { transaction: dbTransaction },
        );

        const userRole = await this.userService.getUserRoles(
          existingUser.email,
        );

        if (userRole.roles[0].name === 'SUPER ADMIN') {
          await this.userService.updateUserAndRole({
            data: {},
            role,
            userId: existingUser?.id,
            preexistingUser: true,
          });
        }

        await dbTransaction.commit();
        return addedTeamMember;
      } else {
        const generatedPassword = generatePassword(12);
        userToCreate.password = generatedPassword;
        userToCreate.CreatedById = creatorId;
        userToCreate.level = UserLevel.BETA;

        let createdMember;
        if (!existingUser) {
          createdMember = await this.userService.createUser({
            userData: userToCreate,
            createdByAdmin: true,
            generatedPassword,
            dbTransaction,
            role,
          });
        }

        const addedMember = await this.teamMemberModel.create(
          {
            TeamId: team?.id || adminTeam.TeamId,
            UserId: existingUser?.id || createdMember?.id,
            createdById: creatorId,
            updatedById: creatorId,
            position: MEMBER_POSITION.MEMBER,
          },
          { transaction: dbTransaction },
        );

        await dbTransaction.commit();
        return 'Successfully added team member';
      }
    } catch (error) {
      await dbTransaction.rollback();
      throw new BadRequestException(error.message);
    }
  }

  async findTeam(id: string) {
    return this.teamModel.findOne({
      where: { id },
      attributes: ['id', 'name', 'ownerId'],
      include: [
        {
          model: User,
          as: 'members',
          attributes: ['id', 'name'],
          through: { attributes: ['position', 'id'] },
          include: [
            {
              model: Role,
              as: 'roles',
              attributes: ['name', 'description'],
              through: { attributes: [] },
            },
          ],
        },
      ],
    });
  }

  async findTeamMemberTeam(id: string) {
    return this.teamMemberModel.findOne({
      where: { UserId: id },
      attributes: ['id', 'TeamId', 'UserId'],
      include: [
        {
          model: Team,
          as: 'team',
          attributes: ['id', 'name', 'ownerId'],
          include: [
            {
              model: User,
              as: 'members',
              attributes: ['id', 'name'],
              through: { attributes: ['position', 'id'] },
              include: [
                {
                  model: Role,
                  as: 'roles',
                  attributes: ['name', 'description'],
                  through: { attributes: [] },
                },
              ],
            },
          ],
        },
      ],
    });
  }

  async checkTeamMemberAccessAndReturnTeam(teamId: string, user: User) {
    const userTeam = await this.findTeam(teamId);

    if (!userTeam) {
      throw new BadRequestException('Invalid Team ID');
    }

    if (userTeam.members.every((member) => member.id !== user.id)) {
      throw new NotAcceptableException('You do not have access to this team');
    }

    return userTeam;
  }

  async getTeamMembers({
    user,
    teamId,
    search_param,
  }: {
    user: User;
    teamId: string;
    search_param: string;
  }) {
    const userTeam = await this.checkTeamMemberAccessAndReturnTeam(
      teamId,
      user,
    );

    const whereClause: any = {
      TeamId: userTeam.id,
    };

    if (search_param) {
      whereClause[Op.or] = [
        {
          '$user.name$': {
            [Op.iLike]: `%${search_param}%`,
          },
        },
        {
          '$user.email$': {
            [Op.iLike]: `%${search_param}%`,
          },
        },
      ];
    }

    const teamMembers = await this.teamMemberModel.findAndCountAll({
      where: whereClause,
      attributes: ['id', 'position'],
      include: [
        {
          model: User,
          attributes: [
            'id',
            'name',
            'email',
            'phoneNumber',
            'status',
            'lastLogin',
          ],
          as: 'user',
          include: [
            {
              model: Role,
              as: 'roles',
              attributes: ['name', 'description'],
              through: { attributes: [] },
            },
            {
              model: Team,
              attributes: ['id', 'name', 'ownerId'],
              through: { attributes: [] },
            },
          ],
        },
      ],
    });

    return {
      team: {
        id: userTeam.id,
        name: userTeam.name,
        teamMembers,
      },
    };
  }

  async changeTeamMemberStatus({
    user,
    teamMemberUserId,
    teamId,
    status,
  }: {
    user: User;
    teamMemberUserId: string;
    status: UserStatus;
    teamId: string;
  }) {
    if (!teamMemberUserId) {
      throw new BadRequestException('Include a team member user ID');
    }

    if (!teamId) {
      throw new BadRequestException('Include a team ID');
    }

    if (teamMemberUserId === user.id) {
      throw new BadRequestException(
        `You cannot perform this action for yourself`,
      );
    }

    await this.checkTeamMemberAccessAndReturnTeam(teamId, user);

    if (!status || !(status in UserStatus)) {
      throw new BadRequestException('Invalid user status');
    }
    return await this.userService.updateUserStatus(teamMemberUserId, status);
  }

  async updateTeamMember({
    user,
    teamMemberUserId,
    teamId,
    data,
  }: {
    user: User;
    teamMemberUserId: string;
    data: UpdateTeamMemberDto;
    teamId: string;
  }) {
    const findTeam = await this.findTeam(teamId);

    if (!findTeam) {
      throw new BadRequestException('Invalid Team ID');
    }

    const findTeamMemberTeam = await this.findTeamMemberTeam(teamMemberUserId);

    if (!findTeamMemberTeam) {
      throw new BadRequestException('Invalid Team Member User ID');
    }

    await this.checkTeamMemberAccessAndReturnTeam(teamId, user);

    const { role, ...rest } = data;

    const updateUser = await this.userService.updateUserAndRole({
      data: rest,
      role,
      userId: teamMemberUserId,
    });

    return updateUser;
  }

  async deleteTeamMember({
    user,
    teamMemberUserId,
    teamId,
  }: {
    user: User;
    teamMemberUserId: string;
    teamId: string;
  }) {
    const team = await this.teamModel.findOne({
      where: { ownerId: user.id },
    });

    if (user.id === teamMemberUserId) {
      throw new BadRequestException('You cannot remove yourself');
    }

    if (!team) {
      throw new UnauthorizedException(
        "You don't have authority to perform this action",
      );
    }

    const teamMember = await this.teamMemberModel.findOne({
      where: {
        TeamId: team.id,
        UserId: teamMemberUserId,
      },
    });

    if (!teamMember) {
      throw new BadRequestException('User not found');
    }

    await this.changeTeamMemberStatus({
      user,
      teamMemberUserId,
      teamId,
      status: UserStatus.PAUSED,
    });

    return await teamMember.destroy({ force: true });
  }
}
