import { InjectModel } from '@nestjs/sequelize/dist/common/sequelize.decorators';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Op, WhereOptions } from 'sequelize';
import { CreatedAt, Sequelize } from 'sequelize-typescript';
import { EmailService } from '../email/email.service';
import { FundmanagerPlatformInvitation } from '../invitation/dto/platformInvitation.dto';
import { User, UserType } from '../user/models/user.model';
import { FundManager } from '../fund-manager/models/fundManager.model';
import { Builder } from './models/builder.model';
import { Project, ProjectStatus } from '../project/models/project.model';
import { BuilderFundManager } from '../project/models/builder-fundManager-project.model';
import { MyFundManagersResponseData } from './types';
import { ProjectFundManager } from '../project-fundManager/model/projectFundManager.model';
import { ProjectTender } from '../fund-manager/models/project-tender.model';
import { UserWallet } from '../user-wallet/models/user-wallet.model';
import { TenderBid } from '../project/models/project-tender-bids.model';
import { ProjectWallet } from '../project-wallet/models/project-wallet.model';
import { ProjectShares, Status } from '../project/models/project-shared.model';
import { SharedProjectStatus } from '../shared-project/models/shared-project.model';
import { Invitation } from '../invitation/models/invitation.model';

@Injectable()
export class BuilderFundManagerService {
  constructor(
    @InjectModel(FundManager)
    private readonly fundManagerModel: typeof FundManager,
    @InjectModel(BuilderFundManager)
    private readonly builderFundManagerModel: typeof BuilderFundManager,
    @InjectModel(ProjectFundManager)
    private readonly projectfundManagerModel: typeof ProjectFundManager,
    @InjectModel(Project)
    private readonly projectModel: typeof Project,
    @InjectModel(User)
    private readonly userModel: typeof User,
    @InjectModel(ProjectShares)
    private readonly projectSharesModel: typeof ProjectShares,
    @InjectModel(Invitation)
    private readonly invitationModel: typeof Invitation,
    @InjectModel(Builder)
    private readonly builderModel: typeof Builder,
    private emailService: EmailService,
    private sequelize: Sequelize,
  ) {}

  async getMyFundManagers(
    builderId: string,
    query?: string,
  ): Promise<MyFundManagersResponseData> {
    try {
      const whereOptions: WhereOptions<FundManager> = {};
      if (query) {
        whereOptions[Op.or] = [
          { businessName: { [Op.iLike]: `%${query}%` } },
          { businessAddress: { [Op.iLike]: `%${query}%` } },
        ];
      }

      const fundmanagers = await this.builderFundManagerModel.findAll({
        where: { BuilderId: builderId },
        include: [
          {
            model: FundManager,
            where: whereOptions,
          },
          {
            model: Project,
          },
        ],
      });

      const result = await Promise.all(
        fundmanagers.map(async (fm) => {
          const completedProjects =
            fm.FundManager.CompanyProjects?.filter(
              (project) => project?.status === ProjectStatus.COMPLETED,
            ) || [];
          return {
            completedProjectsCount: completedProjects.length,
            ...fm.toJSON(),
          };
        }),
      );

      const totalFundManagersLength = fundmanagers.length;
      return {
        FundManagers: result,
        totalFundManagersLength: totalFundManagersLength,
      };
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async addToMyFundManagers(
    builderId: string,
    fundmanagersId: string[],
  ): Promise<BuilderFundManager[]> {
    const dbTransaction = await this.sequelize.transaction();
    try {
      const builder = await this.builderModel.findOne({
        where: { id: builderId },
        include: [FundManager],
      });
      if (!builder) throw new BadRequestException('Builder not found');

      const fundmanagers = await this.fundManagerModel.findAll({
        where: { id: { [Op.in]: fundmanagersId } },
      });
      const validFundManagersIds = fundmanagers.map((fm) => fm.id);

      const bulkCreateData = validFundManagersIds.map((fundmanagerId) => {
        return {
          BuilderId: builderId,
          createdAt: new Date(),
          FundManagerId: fundmanagerId,
          CreatedById: builder.ownerId,
        };
      });

      await this.builderFundManagerModel.bulkCreate(bulkCreateData, {
        transaction: dbTransaction,
        ignoreDuplicates: true,
      });

      await dbTransaction.commit();

      return await this.builderFundManagerModel.findAll({
        where: { FundManagerId: { [Op.in]: validFundManagersIds } },
      });
    } catch (err) {
      await dbTransaction.rollback();
      throw new InternalServerErrorException(err.message);
    }
  }

  async sendInviteToFundManager(
    data: FundmanagerPlatformInvitation,
    user?: User,
  ) {
    const whereOptions: WhereOptions<ProjectShares> = {};

    try {
      const userToInvite = await this.userModel.findOne({
        where: { email: data.toEmail },
        include: [{ model: Builder }, { model: FundManager }],
      });

      if (userToInvite) {
        const projectDetails = await this.projectModel.findByPkOrThrow(
          data.projectId,
          {
            include: [{ model: User, as: 'Owner' }],
          },
        );

        if (!projectDetails) return new NotFoundException('Project not found');

        if (projectDetails.ownerId !== user.id)
          return new UnauthorizedException(
            'You are not the owner of the project',
          );

        if (user.userType === UserType.BUILDER && userToInvite) {
          if (!userToInvite?.FundManagerId) {
            throw new BadRequestException(
              'Builders can only share projects with Fund Managers.',
            );
          }
        }

        whereOptions.FundManagerId = userToInvite.FundManagerId;
        whereOptions.BuilderId = user.BuilderId;
        whereOptions.ProjectId = data.projectId;

        const alreadyShared = await this.projectSharesModel.findOne({
          where: whereOptions,
        });

        if (alreadyShared)
          throw new Error('Project already shared with this user');

        await this.projectSharesModel.create({
          ProjectId: data.projectId,
          FundManagerId: userToInvite?.FundManagerId,
          BuilderId: user?.BuilderId,
          status: Status.PENDING,
          CreatedById: user.id,
        });

        //send email
        await this.emailService.projectInviteExistUser({
          toEmail: data.toEmail,
          inviteeName: user.businessName,
          toName: data.toName,
          projectId: data.projectId,
          message: `You have a project invitation from ${user.businessName}`,
        });
        return 'invitation sent';
      } else {
        const [newInvite] = await this.invitationModel.findOrCreate({
          defaults: {
            projectId: data.projectId,
            buyerPhone: data?.phoneNumber || '',
            buyerName: data?.toName || '',
          },
          where: {
            CreatedById: user.id,
            buyerEmail: data?.toEmail,
          },
        });
        await this.emailService.fundManagerPlatformInvitationsEmail({
          ...data,
          invitationId: newInvite.id,
        });
        return 'Invitation sent, user need to register';
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getProjectsCreatedByFundManager(fundmanagerId: string, query?: string) {
    const whereOptions: WhereOptions<Project> = {};
    if (query) {
      whereOptions[Op.or] = [
        this.sequelize.literal(`"project"."title"::text ILIKE '%${query}%'`),
        this.sequelize.literal(`"location"::text ILIKE '%${query}%'`),
      ];
    }
    try {
      const projects = await this.projectfundManagerModel.findAll({
        where: { FundManagerId: fundmanagerId },
        order: [['createdAt', 'DESC']],
        include: [
          {
            model: Project,
            where: whereOptions,
            attributes: [
              'ProjectType',
              'location',
              'title',
              'status',
              'location',
              'createdAt',
              'budgetAmount',
              'startDate',
              'endDate',
            ],
            include: [
              {
                model: ProjectTender,
                attributes: ['status', 'budget'],
              },
            ],
          },
        ],
      });


      if (!projects)
        return {
          message: `No project found for fundmanager with id  ${fundmanagerId}`,
        };

      const result = Promise.all(
        projects.map(async (fundmanager) => {
          const projectData = fundmanager.toJSON();
          const tenderbids =
            projectData.project && projectData.project.Tenders
              ? projectData.project?.Tenders?.map((tender) => {
                  const bidcount = tender.TenderBids
                    ? tender.TenderBids.length
                    : 0;
                  return {
                    bidCount: bidcount,
                  };
                })
              : null;

          const duration = await this.calculateDuration(
            projectData.project.startDate,
            projectData.project.endDate,
          );

          return {
            ...projectData,
            project: {
              ...projectData.project,
              tenderbids,
              duration,
            },
          };
        }),
      );
      return result;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async calculateDuration(startDate: Date, endDate: Date): Promise<number> {
    if (startDate && endDate) {
      const millisecsPerDay = 24 * 60 * 60 * 1000;
      const millisecondDuration = endDate.getTime() - startDate.getTime();
      const durationWeeks = millisecondDuration / millisecsPerDay;

      return Math.round(durationWeeks / 7);
    }
  }

  async fundManagerDetails(fundmanagerId: string) {
    try {
      const fundManager = await this.fundManagerModel.findOne({
        where: { id: fundmanagerId },
        include: [
          {
            model: Project,
            as: 'CompanyProjects',
            attributes: ['ProjectType', 'title', 'status'],
            through: { attributes: [] },
          },
        ],
      });

      if (!fundManager) return { message: 'fundManager not found' };

      const completedProjectCount =
        fundManager && fundManager.CompanyProjects
          ? fundManager.CompanyProjects.filter(
              (project) => project.status === ProjectStatus.COMPLETED,
            ).length
          : 0;

      const projectsCount = completedProjectCount;
      return {
        fundManager: fundManager,
        completedProjectsCount: projectsCount,
      };
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async getProjectDetails(projectId: string): Promise<Project> {
    try {
      const project = await this.projectModel.findOne({
        where: {
          id: projectId,
        },
        include: [
          {
            model: ProjectWallet,
          },
        ],
      });
      if (!project) return null;
      return project;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
