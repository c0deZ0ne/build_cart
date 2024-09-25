import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../user/models/user.model';
import { UserProject } from './models/shared-project.model';
import { CreateUserProjectDto } from './dto/user-project.dto';
import { Project, ProjectStatus } from '../project/models/project.model';
import { Transaction } from 'sequelize';
import { TeamMember } from '../rbac/models/user-teammembers.model';
import { Team } from '../rbac/models/team.model';
@Injectable()
export class UserProjectService {
  constructor(
    @InjectModel(UserProject)
    private readonly userProjectModel: typeof UserProject,
    @InjectModel(TeamMember)
    private readonly teamMemberModel: typeof TeamMember,
    @InjectModel(Project)
    private readonly projectModel: typeof Project,
  ) {}

  /**
   * Creates a new user project with the provided data.
   * @param {Object} options - Options for creating a new user project.
   * @param {Partial<CreateUserProjectDto>} options.data - The data for creating the user project.
   * @param {Transaction} [options.dbTransaction] - Optional Sequelize transaction.
   * @returns {Promise<Partial<UserProject>>} The created user project.
   */
  async create({
    data,
    dbTransaction,
  }: {
    data: Partial<CreateUserProjectDto>;
    dbTransaction?: Transaction;
  }): Promise<Partial<UserProject>> {
    return await this.userProjectModel.create(
      {
        ...data,
        createdAt: new Date(),
      },
      dbTransaction ? { transaction: dbTransaction } : null,
    );
  }

  /**
   * Retrieves all projects associated with the given user.
   * @param {User} user - The user for whom to fetch projects.
   * @returns {Promise<unknown[]>} An array of projects.
   */
  async getAllProject(user: User): Promise<unknown[]> {
    const isTeamMember = await this.teamMemberModel.findOne({
      where: {
        UserId: user.id,
      },
      include: [{ model: Team, include: [{ model: User, as: 'owner' }] }],
    });

    if (user.id === isTeamMember.team.owner.id) {
      return await this.projectModel.findAll({
        where: {
          CreatedById: user.id,
        },
        include: [
          {
            model: User,
            as: 'contractors',
            attributes: ['name', 'location', 'id'],
          },
        ],
        attributes: [
          'id',
          'title',
          'createdAt',
          'startDate',
          'endDate',
          'location',
        ],
      });
    } else {
      return await this.userProjectModel.findAll({
        where: { UserId: user.id },

        include: [
          {
            model: Project,
            attributes: [
              'id',
              'title',
              'createdAt',
              'startDate',
              'endDate',
              'location',
            ],
          },
          {
            model: User,
            attributes: ['name', 'id', 'email', 'phoneNumber', 'location'],
          },
        ],
      });
    }
  }

  /**
   * Retrieves all completed projects associated with the given user.
   * @param {User} user - The user for whom to fetch completed projects.
   * @returns {Promise<unknown[]>} An array of completed projects.
   */
  async getAllCompleted(user: User): Promise<unknown[]> {
    const isTeamMember = await this.teamMemberModel.findOne({
      where: {
        UserId: user.id,
      },
      include: [{ model: Team, include: [{ model: User, as: 'owner' }] }],
    });

    if (user.id === isTeamMember.team.owner.id) {
      return await this.projectModel.findAll({
        where: {
          CreatedById: user.id,
          status: ProjectStatus.ARCHIVE,
        },
        include: [
          {
            model: User,
            as: 'contractors',
            attributes: ['name', 'location', 'id'],
          },
        ],
        attributes: [
          'id',
          'title',
          'createdAt',
          'startDate',
          'endDate',
          'location',
        ],
      });
    } else {
      const allProj = await this.userProjectModel.findAll({
        where: { UserId: user.id },

        include: [
          {
            model: Project,
            attributes: [
              'id',
              'title',
              'createdAt',
              'startDate',
              'endDate',
              'location',
              'status',
            ],
          },
          {
            model: User,
            attributes: ['name', 'id', 'email', 'phoneNumber', 'location'],
          },
        ],
      });
      return allProj.filter((projectData: UserProject) => {
        return projectData?.project?.status == ProjectStatus.ARCHIVE;
      });
    }
  }
}
