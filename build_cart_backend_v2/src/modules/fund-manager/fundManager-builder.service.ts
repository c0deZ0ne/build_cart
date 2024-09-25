import { InjectModel } from '@nestjs/sequelize/dist/common/sequelize.decorators';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Op, WhereOptions } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { EmailService } from '../email/email.service';
import { BuilderInvitation } from '../invitation/dto/platformInvitation.dto';
import { User } from '../user/models/user.model';
import { FundManager } from '../fund-manager/models/fundManager.model';
import { Project, ProjectStatus } from '../project/models/project.model';
import { BuilderFundManager } from '../project/models/builder-fundManager-project.model';
import { ProjectFundManager } from '../project-fundManager/model/projectFundManager.model';
import { ProjectTender } from '../fund-manager/models/project-tender.model';
import { BuilderProject } from '../builder-project/model/builderProject.model';
import { Builder, BuilderTier } from '../builder/models/builder.model';
import { RateReview } from '../rate-review/model/rateReview.model';
import { BusinessSize } from '../vendor/models/vendor.model';
import { ProjectMedia } from '../project-media/models/project-media.model';
import { InvitationService } from '../invitation/invitation.service';

export class BuildersResponseData {
  BuilderId: string;
  name: string;
  businessSize: BusinessSize;
  builderCategory: BuilderTier;
  location: string;
  ratings: number;
  companyProjectsCount?: number;
  completedProjectsCount?: number;
  totalBuilders?: number;
}

export class AllBuildersResponseData {
  builders: BuildersResponseData[];
  totalBuilders?: number;
}

@Injectable()
export class FundManagerBuilderService {
  constructor(
    @InjectModel(FundManager)
    private readonly fundManagerModel: typeof FundManager,
    @InjectModel(BuilderFundManager)
    private readonly builderFundManagerModel: typeof BuilderFundManager,
    @InjectModel(BuilderProject)
    private readonly projectBuilderModel: typeof BuilderProject,
    @InjectModel(Project)
    private readonly projectModel: typeof Project,
    @InjectModel(User)
    private readonly userModel: typeof User,
    @InjectModel(Builder)
    private readonly builderModel: typeof Builder,
    @InjectModel(RateReview)
    private readonly rateReviewModel: typeof RateReview,
    private emailService: EmailService,
    private sequelize: Sequelize,
    private inviteService: InvitationService,
  ) {}

  async getAllBuilders(query?: string): Promise<AllBuildersResponseData> {
    try {
      const whereOptions: WhereOptions<Builder> = {};
      if (query) {
        whereOptions[Op.or] = [
          this.sequelize.literal(
            `"Builder"."businessName"::text ILIKE '%${query}%'`,
          ),
          this.sequelize.literal(
            `"Builder"."businessAddress"::text ILIKE '%${query}%'`,
          ),
          this.sequelize.literal(
            `"Builder"."businessSize"::text ILIKE '%${query}%'`,
          ),
          this.sequelize.literal(`"Builder"."tier"::text ILIKE '%${query}%'`),
        ];
      }
      const allbuilders = await this.builderModel.findAll({
        where: whereOptions,
        attributes: [
          'id',
          'email',
          'businessName',
          'businessAddress',
          'businessSize',
          'tier',
          'about',
          'logo',
        ],
        include: [
          {
            model: Project,
            as: 'CompanyProjects',
            attributes: ['id', 'ProjectType', 'location', 'title', 'status'],
          },
          {
            model: User,
            as: 'owner',
          },
        ],
      });

      const builderIds = allbuilders.map((builder) => builder.id);
      const rateBuilders = await this.rateReviewModel.findAll({
        where: { BuilderId: { [Op.in]: builderIds } },
      });

      const result = await Promise.all(
        allbuilders.map(async (builderData) => {
          const rateBuilderData = rateBuilders.filter(
            (rateBuilder) => rateBuilder.BuilderId === builderData.id,
          );

          const rateBuilderScore = rateBuilderData.map(
            (rateBuilder) => rateBuilder.builderRateScore,
          );
          const averageBuilderRateScore =
            rateBuilderScore.reduce((acc, score) => acc + score, 0) /
            rateBuilderScore.length;

          const completedProjects = builderData.CompanyProjects?.filter(
            (project) => project.status === ProjectStatus.COMPLETED,
          );
          return {
            BuilderId: builderData.id,
            name: builderData.businessName,
            businessSize: builderData.businessSize,
            builderCategory: builderData.tier,
            location: builderData.businessAddress,
            ratings: isNaN(averageBuilderRateScore)
              ? 0
              : averageBuilderRateScore,
            completedProjectCount: completedProjects.length,
          };
        }),
      );
      return { builders: result, totalBuilders: allbuilders.length };
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async getMyBuilders(
    fundmanagerId: string,
    query?: string,
  ): Promise<AllBuildersResponseData> {
    try {
      const whereOptions: WhereOptions<Builder> = {};
      if (query) {
        whereOptions[Op.or] = [
          this.sequelize.literal(
            `"Builder"."businessName"::text ILIKE '%${query}%'`,
          ),
          this.sequelize.literal(
            `"Builder"."businessAddress"::text ILIKE '%${query}%'`,
          ),
          this.sequelize.literal(
            `"Builder"."businessSize"::text ILIKE '%${query}%'`,
          ),
          this.sequelize.literal(`"Builder"."tier"::text ILIKE '%${query}%'`),
        ];
      }

      const myBuilders = await this.builderFundManagerModel.findAll({
        where: { FundManagerId: fundmanagerId },
        attributes: ['id', 'FundManagerId', 'BuilderId'],
        include: [
          {
            model: Builder,
            attributes: [
              'id',
              'email',
              'businessName',
              'businessAddress',
              'businessSize',
              'tier',
              'about',
              'logo',
            ],
            where: whereOptions,
            include: [
              {
                model: Project,
                as: 'CompanyProjects',
              },
              {
                model: User,
                as: 'owner',
              },
            ],
          },
        ],
      });

      const builderIds = myBuilders.map((builder) => builder.id);
      const rateBuilders = await this.rateReviewModel.findAll({
        where: { BuilderId: { [Op.in]: builderIds } },
      });

      const result = await Promise.all(
        myBuilders.map(async (builder) => {
          const rateBuilderScore = rateBuilders.map(
            (rateBuilder) => rateBuilder.builderRateScore,
          );
          const averageBuilderRateScore =
            rateBuilderScore.reduce((acc, score) => acc + score, 0) /
            rateBuilderScore.length;

          const completedProjects =
            builder.Builder.CompanyProjects?.filter(
              (project) => project?.status === ProjectStatus.COMPLETED,
            ) || [];
          return {
            BuilderId: builder.Builder.id,
            name: builder.Builder.businessName,
            businessSize: builder.Builder.businessSize,
            builderCategory: builder.Builder.tier,
            location: builder.Builder.businessAddress,
            ratings: isNaN(averageBuilderRateScore)
              ? 0
              : averageBuilderRateScore,
            completedProjectsCount: completedProjects.length,
          };
        }),
      );
      return { builders: result, totalBuilders: myBuilders.length };
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async addToMyBuilders(
    fundmanagerId: string,
    buildersId: string[],
  ): Promise<BuilderFundManager[]> {
    const dbTransaction = await this.sequelize.transaction();
    try {
      const fundmanager = await this.fundManagerModel.findOne({
        where: { id: fundmanagerId },
        include: [Builder],
      });
      if (!fundmanager) throw new BadRequestException('fundmanager not found');

      const builders = await this.builderModel.findAll({
        where: { id: { [Op.in]: buildersId } },
      });
      const validBuildersIds = builders.map((fm) => fm.id);

      const existingAssociations = await this.builderFundManagerModel.findAll({
        where: {
          BuilderId: { [Op.in]: validBuildersIds },
          FundManagerId: fundmanagerId,
        },
      });

      const existingBuilderIds = existingAssociations.map(
        (association) => association.BuilderId,
      );

      const newBuildersIds = validBuildersIds.filter(
        (builderId) => !existingBuilderIds.includes(builderId),
      );

      const bulkCreateData = newBuildersIds.map((builderId) => {
        return {
          BuilderId: builderId,
          createdAt: new Date(),
          FundManagerId: fundmanagerId,
          CreatedById: fundmanager.ownerId,
        };
      });

      await this.builderFundManagerModel.bulkCreate(bulkCreateData, {
        transaction: dbTransaction,
      });

      await dbTransaction.commit();

      return await this.builderFundManagerModel.findAll({
        where: { BuilderId: { [Op.in]: validBuildersIds } },
      });
    } catch (err) {
      await dbTransaction.rollback();
      throw new InternalServerErrorException(err.message);
    }
  }

  async sendInviteToBuilder(data: BuilderInvitation, user: User) {
    try {
      return await this.inviteService.createInvitationForBuilder(data, user);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getProjectsForBuilder(builderId: string, query?: string) {
    const whereOptions: WhereOptions<Project> = {};
    if (query) {
      whereOptions[Op.or] = [
        this.sequelize.literal(`"project"."title"::text ILIKE '%${query}%'`),
        this.sequelize.literal(`"location"::text ILIKE '%${query}%'`),
      ];
    }
    try {
      const projects = await this.projectBuilderModel.findAll({
        where: { BuilderId: builderId },
        include: [
          {
            model: Project,
            where: whereOptions,
            include: [
              {
                model: ProjectTender,
                attributes: ['status', 'budget'],
              },
              {
                model: ProjectMedia,
              },
            ],
          },
        ],
      });

      if (!projects)
        return {
          message: `No project found for Builder with id  ${builderId}`,
        };

      const result = Promise.all(
        projects.map(async (builder) => {
          const projectData = builder.toJSON();
          const tenderbids =
            projectData.Project && projectData.Project.Tenders
              ? projectData.Project?.Tenders?.map((tender) => {
                  const bidcount = tender.TenderBids
                    ? tender.TenderBids.length
                    : 0;
                  return {
                    bidCount: bidcount,
                  };
                })
              : null;

          const duration = await this.calculateDuration(
            projectData.Project.startDate,
            projectData.Project.endDate,
          );

          return {
            ...projectData,
            tenderbids,
            duration,
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

  async getBuilderDetails(builderId: string) {
    try {
      const builderData = await this.builderModel.findOne({
        where: { id: builderId },
        include: [
          {
            model: Project,
            as: 'CompanyProjects',
            attributes: ['id', 'ProjectType', 'location', 'title', 'status'],
            through: { attributes: [] },
          },
          {
            model: User,
            as: 'owner',
            attributes: [
              'id',
              'email',
              'location',
              'name',
              'phoneNumber',
              'businessName',
            ],
          },
        ],
      });
      const builderRateData = await this.rateReviewModel.findAll({
        where: { BuilderId: builderId },
      });

      if (!builderData) return { message: 'builder not found' };

      const completedProjectCount =
        builderData && builderData.CompanyProjects
          ? builderData.CompanyProjects.filter(
              (project) => project.status === ProjectStatus.COMPLETED,
            ).length
          : 0;

      const rateBuilderScore = builderRateData.map(
        (rateBuilder) => rateBuilder.builderRateScore,
      );
      const averageBuilderRateScore =
        rateBuilderScore.reduce((acc, score) => acc + score, 0) /
        rateBuilderScore.length;

      const result = {
        builder: builderData,

        builderRateData: isNaN(averageBuilderRateScore)
          ? 0
          : Math.round(averageBuilderRateScore),
        completedProjectsCount: completedProjectCount,
      };

      return result;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
