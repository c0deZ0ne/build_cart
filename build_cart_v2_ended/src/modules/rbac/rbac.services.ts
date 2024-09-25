import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Permission } from './models/permission';
import { Role } from './models/role.model';
import { CreatePermissionDto } from './dtos/permission';
import { CreateRoleDto } from './dtos/create-role.dto';
import { Team } from './models/team.model';
import { User } from '../user/models/user.model';
import { TeamMember } from './models/user-teammembers.model';
import { CreateTeamMemberDto } from './dtos/create-teamMember.dto';
import { Sequelize } from 'sequelize-typescript';
import Transaction from 'sequelize/types/transaction';

@Injectable()
export class RbacServices {
  constructor(
    @InjectModel(Role)
    private roleModel: typeof Role,
    @InjectModel(Permission)
    private permissionModel: typeof Permission,
    @InjectModel(Team)
    private teamModel: typeof Team,
    @InjectModel(TeamMember)
    private readonly teamMemberModel: typeof TeamMember,
    private readonly sequelize: Sequelize,
  ) {}

  async createRole(createRoleDto: CreateRoleDto): Promise<Role> {
    return this.roleModel.create(createRoleDto);
  }

  async createPermission(
    createPermissionDto: CreatePermissionDto,
  ): Promise<Permission> {
    return this.permissionModel.create(createPermissionDto);
  }

  async createTeam({
    name,
    createdById,
    dbTransaction,
  }: {
    name: string;
    createdById?: string;
    owner?: User;
    dbTransaction: Transaction;
  }) {
    try {
      if (!dbTransaction) {
        dbTransaction = await this.sequelize.transaction();
      }
      const teamUniqName = await this.teamModel.findOne({
        where: { name: name },
      });
      if (teamUniqName)
        throw new BadRequestException('teams name already exist');

      const teamData = await this.teamModel.create(
        {
          name,
          createdById: createdById,
          ownerId: createdById,
          createdAt: new Date(),
        },
        {
          transaction: dbTransaction,
        },
      );
      return teamData;
    } catch (error) {
      throw new BadRequestException('error crating the teams');
    }
  }
  async getAllUserTeams(user: User) {
    return await this.teamModel.findAll({
      where: {
        createdById: user.id,
      },
    });
  }

  async createTeamMember({
    body,
    createdById,
    dbTransaction,
  }: {
    body: CreateTeamMemberDto;
    createdById?: string;
    dbTransaction?: Transaction;
  }) {
    try {
      if (!dbTransaction) {
        dbTransaction = await this.sequelize.transaction();
      }
      return await this.teamMemberModel.create(
        {
          ...body,
          createdById,
          createdAt: new Date(),
        },
        { transaction: dbTransaction },
      );
    } catch (error) {
      throw new BadRequestException('could not create a team member');
    }
  }
}
