import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User, UserStatus, UserType } from '../user/models/user.model';
import { CreationAttributes } from 'sequelize/types/model';
import { CreateTeamDto } from '../rbac/dtos/create-team.dto';
import { Team } from '../rbac/models/team.model';
import { Sequelize } from 'sequelize-typescript';
import Transaction from 'sequelize/types/transaction';
import { TeamMember } from '../rbac/models/user-teammembers.model';
import { Role } from '../rbac/models/role.model';
import { CreateNewTeamMember } from './dto/team-member.dto';
import { EmailService } from '../email/email.service';
import { randomUUID } from 'crypto';
import { UserRole } from '../rbac/models/user-role.model';
import { UpdateTeamDto } from './dto/createTeams.dto';

@Injectable()
export class SponsorTeamService {
  constructor(
    @InjectModel(Team)
    private readonly teamModel: typeof Team,
    @InjectModel(User)
    private readonly userModel: typeof User,
    @InjectModel(TeamMember)
    private readonly teamMembermodel: typeof TeamMember,
    private readonly emailService: EmailService,
    readonly sequelize: Sequelize,
  ) {}

  /**
   * Create a new FundManager Team.
   *
   * @param user - The user creating the team.
   * @param body - The data for creating the team.
   * @returns The newly created Team instance.
   */
  async create({
    user,
    body,
    dbTransaction,
  }: {
    user: CreationAttributes<User>;
    body: CreateTeamDto;
    dbTransaction?: Transaction;
  }): Promise<Team> {
    try {
      if (!dbTransaction) {
        dbTransaction = await this.sequelize.transaction();
      }
      return this.teamModel.create(
        {
          ...body,
          createdAt: new Date(),
          createdById: user.id,
        },
        { transaction: dbTransaction },
      );
    } catch (error) {
      dbTransaction.rollback();
    }
  }

  /**
   * Get all FundManager Teams.
   *
   * @param user - The user whose teams are to be retrieved.
   * @returns An array of Team instances.
   */
  async findAll({ user }: { user: User }): Promise<Team[]> {
    return await this.teamModel.findAll({
      where: { createdById: user.id },
      include: [
        {
          model: User,
          as: 'members',
          include: [{ model: Role }],
          attributes: ['name', 'email', 'phoneNumber'],
        },
      ],
    });
  }

  async createNewTeamMember({
    user,
    body,
  }: {
    user: User;
    body: CreateNewTeamMember;
  }) {
    const checkUserExist = await this.userModel.findOne({
      where: { email: body.email },
    });
    if (checkUserExist)
      throw new BadRequestException('user already exist with this email');
    const dbTransaction = await this.sequelize.transaction();
    const password = randomUUID().substring(6);
    try {
      const newUserData = await this.userModel.create(
        {
          ...body,
          password,
          CreatedById: user.id,
          FundManagerId: user.FundManagerId,
          location: body.location ?? user.location,
          createdAt: new Date(),
          userType: UserType.FUND_MANAGER,
          emailVerified: true,
          acceptTerms: true,
          status: UserStatus.ACTIVE,
        },
        { transaction: dbTransaction },
      );

      await this.teamMembermodel.create(
        {
          TeamId: body.teamId,
          UserId: newUserData.id,
          position: body.position,
          createdAt: new Date(),
          createdById: newUserData.id,
        },
        { transaction: dbTransaction },
      );
      if (body.RoleId) {
        await UserRole.create(
          {
            UserId: newUserData.id,
            RoleId: body.RoleId,
          },
          {
            transaction: dbTransaction,
          },
        );
      }
      await this.emailService.sendAccountCreated({
        email: body.email,
        password: password,
        userType: 'Team Member',
      });
      dbTransaction.commit();
      return newUserData;
    } catch (error) {
      dbTransaction.rollback;
      throw new BadRequestException(error.message);
    }
  }

  async getAllTeamMembers({
    teamId,
  }: {
    user: User;
    teamId: string;
  }): Promise<Team> {
    return await this.teamModel.findOne({
      where: {
        id: teamId,
      },
      include: [
        {
          model: User,
          as: 'members',
          include: [{ model: Role }],
          attributes: ['name', 'email', 'phoneNumber'],
        },
      ],
    });
  }

  async getAllRoles({ user }: { user: User }) {
    const allRoles = await Role.findAll({
      include: [
        {
          model: User,
          as: 'createdBy',
          include: [{ model: Role }],
          attributes: ['name', 'email', 'phoneNumber', 'id', 'userType'],
        },
      ],
    });
    const SystemDefinedWithUserRoles = allRoles.filter((rol: Role) => {
      if (
        rol?.createdBy?.userType == UserType.ADMIN ||
        rol.createdById == user.id
      ) {
        return rol;
      }
    });

    return SystemDefinedWithUserRoles;
  }

  /**
   * Find a FundManager Team by its ID.
   *
   * @param id - The ID of the team to find.
   * @returns The Team instance if found, otherwise null.
   */
  async findById(id: string): Promise<Team> {
    return this.teamModel.findByPk(id);
  }

  /**
   * Update a FundManager Team by its ID.
   *
   * @param id - The ID of the team to update.
   * @param updateTeamDto - The data for updating the team.
   * @returns The updated Team instance.
   */
  async update(id: string, updateTeamDto: UpdateTeamDto) {
    return this.teamModel.update(updateTeamDto, {
      where: { id },
      returning: true,
    });
  }

  /**
   * Remove a FundManager Team by its ID.
   *
   * @param id - The ID of the team to remove.
   */
  async remove(id: string): Promise<void> {
    const team = await this.findById(id);
    if (team) {
      await team.destroy();
    }
  }
}
