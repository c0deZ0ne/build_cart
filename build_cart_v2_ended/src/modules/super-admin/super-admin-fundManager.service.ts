import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User, UserStatus, UserType } from '../user/models/user.model';
import { InjectModel } from '@nestjs/sequelize';
import { FundManager } from '../fund-manager/models/fundManager.model';
import {
  Project,
  ProjectStatus,
  ProjectType,
} from '../project/models/project.model';
import {
  BidStatus,
  TenderBid,
} from '../project/models/project-tender-bids.model';
import { ProjectTender } from '../fund-manager/models/project-tender.model';
import { superAdminCreateFundManagerDto } from './dto/super-admin-create-fundManagerDto';
import { Sequelize } from 'sequelize-typescript';
import { EmailService } from '../email/email.service';
import { Team } from '../rbac/models/team.model';
import {
  MEMBER_POSITION,
  TeamMember,
} from '../rbac/models/user-teammembers.model';
import { UserRole } from '../rbac/models/user-role.model';
import { genAccountNumber, generatePassword } from 'src/util/util';
import { UserWalletService } from '../user-wallet/user-wallet.service';
import { Role } from '../rbac/models/role.model';
import { SystemRolls } from '../auth/types';
import { superAdminCreateFundManageProjectDto } from './dto/super-admin-create-fundManager-project';
import { Op, WhereOptions } from 'sequelize';
import { UpdateFundManagerDto } from './dto/super-admin-update-fund-manager-dto';
import {
  RfqCategory,
  RfqQuote,
  RfqRequest,
  RfqRequestMaterial,
} from '../rfq/models';
import { Builder } from '../builder/models/builder.model';
import * as moment from 'moment';
import { MaterialSchedule } from '../material-schedule-upload/models/material-schedule.model';
import { ProjectMedia } from '../project-media/models/project-media.model';
import { ProjectWallet } from '../project-wallet/models/project-wallet.model';
import { ProjectWalletService } from '../project-wallet/project-wallet.service';
import { UserLog } from '../user-log/models/user-log.model';
import { Documents } from '../documents/models/documents.model';
import { FundManagerProjectService } from '../fund-manager/fundManager-project.services';
import { ProjectTransaction } from '../project-wallet-transaction/models/project-transaction.model';
import { GroupName } from '../project/models/group-name.model';
import { UserUploadMaterial } from '../material-schedule-upload/models/material.model';
import { ProjectShares } from '../project/models/project-shared.model';

@Injectable()
export class SuperAdminFundManagerService {
  constructor(
    @InjectModel(FundManager)
    private readonly fundManagerModel: typeof FundManager,
    @InjectModel(User)
    private readonly userModel: typeof User,
    @InjectModel(UserLog)
    private readonly userLogModel: typeof UserLog,
    @InjectModel(TenderBid)
    private readonly tenderBidModel: typeof TenderBid,
    @InjectModel(Team)
    private readonly teamModel: typeof Team,
    @InjectModel(TeamMember)
    private readonly teamMembermodel: typeof TeamMember,
    @InjectModel(UserRole)
    private readonly userRoleModel: typeof UserRole,
    @InjectModel(Project)
    private readonly projectModel: typeof Project,
    @InjectModel(ProjectShares)
    private readonly projectSharesModel: typeof ProjectShares,

    private readonly emailServices: EmailService,
    private readonly sequelize: Sequelize,

    private readonly userWalletService: UserWalletService,
    private readonly projectWalletService: ProjectWalletService,
    private readonly fundManagerProjectService: FundManagerProjectService,
  ) {}

  async getFundManagers() {
    const fundmanagers = await this.fundManagerModel.findAll({
      include: [
        {
          model: User,
          as: 'procurementManager',
          attributes: ['id', 'name', 'businessName', 'email'],
        },
        {
          model: Project,
          as: 'CompanyProjects',
        },
        {
          model: User,
          as: 'owner',
          attributes: [
            'id',
            'name',
            'businessName',
            'email',
            'phoneNumber',
            'location',
          ],
        },
      ],
    });
    const allManagers = fundmanagers.map((manager) => {
      const { CompanyProjects } = manager;
      let count = 0;
      CompanyProjects.map((project) => {
        if (project.status === ProjectStatus.COMPLETED) {
          count++;
        }
      });
      const newD = {
        ...manager.dataValues,
        completedProjects: count,
      };
      return newD;
    });

    return allManagers as unknown as FundManager;
  }

  async getFundManager(fundmanagerId: string) {
    const fundManager = await this.fundManagerModel.findOne({
      where: { id: fundmanagerId },
      include: [
        {
          model: User,
          as: 'owner',
        },
      ],
    });

    if (!fundManager)
      throw new NotFoundException('fund manager does not exist');

    return fundManager;
  }

  async getFundManagerById(fundmanagerId: string) {
    const fundManager = await this.fundManagerModel.findOne({
      where: { id: fundmanagerId },
      include: [
        {
          model: Project,
          as: 'CompanyProjects',
        },
        {
          model: User,
          as: 'owner',
          attributes: [
            'id',
            'name',
            'businessName',
            'email',
            'phoneNumber',
            'location',
          ],
        },
      ],
    });

    if (!fundManager)
      throw new NotFoundException('fund manager does not exist');

    const teamMember = await this.teamModel.findAll({
      where: { createdById: fundManager.ownerId },
      include: [
        {
          model: User,
          as: 'members',
          include: [{ model: Role }],
          attributes: ['id'],
        },
      ],
    });

    const projects = await this.projectModel.findAll({
      where: {
        [Op.or]: [
          { ownerId: fundManager.ownerId },
          { CreatedById: fundManager.ownerId },
        ],
      },
    });

    const activeProjects = projects.filter(
      (project) => project.status === ProjectStatus.ACTIVE,
    );
    const completedProjects = projects.filter(
      (project) => project.status === ProjectStatus.COMPLETED,
    );
    const pendingProjects = projects.filter(
      (project) => project.status === ProjectStatus.PENDING,
    );
    const projectData = projects.reduce(
      function (acc, next) {
        if (next.ProjectWallet) {
          if (next.status === ProjectStatus.COMPLETED) {
            acc['lifetime'] += next.ProjectWallet.balance;
          }
          if (next.status !== ProjectStatus.COMPLETED) {
            acc['ongoing'] += Number(next.ProjectWallet.ActualSpend);
            acc['balance'] += Number(next.ProjectWallet.balance);
          }
        }
        return acc;
      },
      { ongoing: 0, lifetime: 0, balance: 0 },
    );

    return {
      fundManager,
      activeProjects,
      completedProjects,
      pendingProjects,
      teamMember,
      projectData,
    };
  }

  async getProjects() {
    return await this.projectModel.findAll({
      include: [
        { model: MaterialSchedule },
        { model: RfqRequest },
        { model: ProjectMedia },
        { model: Documents },
        { model: ProjectWallet },
        { model: ProjectTender },
      ],
      order: [['createdAt', 'DESC']],
    });
  }

  async getProjectsByFundManagerBusinessName(query?: string) {
    const whereOptions: WhereOptions<FundManager> = {};
    if (query) {
      whereOptions[Op.or] = [{ businessName: { [Op.iLike]: `%${query}%` } }];
    }
    const fundManager = await this.fundManagerModel.findAll({
      where: whereOptions,
      include: [
        {
          model: Project,
          as: 'CompanyProjects',
        },
      ],
    });

    return fundManager;
  }

  async getFundManagerProjectByProjectId(id: string) {
    return await this.projectModel.findOne({
      where: { id },
      include: [
        { model: Builder },
        { model: FundManager },
        { model: MaterialSchedule },
        {
          model: RfqRequest,
          include: [
            {
              model: RfqQuote,
              include: [
                {
                  model: RfqRequestMaterial,
                  include: [{ model: RfqCategory }],
                },
              ],
            },
          ],
        },
        { model: ProjectMedia },
        { model: Documents },
        { model: ProjectWallet },
        { model: ProjectTender },
        { model: TenderBid, as: 'awardedBid' },
      ],
    });
  }

  async getFundManagerProjectDetails(id: string) {
    const projects = await this.projectModel.findOne({
      where: {
        id,
      },
      include: [
        {
          model: Builder,
          as: 'developers',
          attributes: [
            'email',
            'businessName',
            'businessAddress',
            'tier',
            'id',
          ],
          include: [
            {
              model: User,
              as: 'owner',
              attributes: ['phoneNumber', 'name', 'location', 'id'],
            },
          ],
        },
        {
          model: RfqRequest,
          attributes: [
            'id',
            'title',
            'status',
            'totalBudget',
            'paymentTerm',
            'deliveryDate',
            'deliveryAddress',
            'deliveryInstructions',
            'createdAt',
            'ProjectId',
            'BuilderId',
            'FundManagerId',
          ],
          include: [
            {
              model: RfqRequestMaterial,

              include: [{ model: RfqCategory }],
            },
            {
              model: Builder,
              attributes: ['email', 'businessName', 'businessAddress', 'tier'],
              include: [
                {
                  model: User,
                  as: 'owner',
                  attributes: [
                    'email',
                    'id',
                    'name',
                    'location',
                    'businessName',
                    'phoneNumber',
                  ],
                },
              ],
            },
          ],
        },
        { model: FundManager },
        { model: ProjectWallet, include: [{ model: ProjectTransaction }] },
        { model: GroupName },
        { model: ProjectTender },
        { model: MaterialSchedule, include: [{ model: UserUploadMaterial }] },
        { model: ProjectMedia },
        { model: RfqRequest },
        { model: Documents },
      ],
      order: [['createdAt', 'DESC']],
    });
    const materialSchedules = projects.materialSchedules.map((material) => {
      return material.userUploadMaterial;
    });
    return { projects, materialSchedules: materialSchedules[0] };
  }

  async acceptProjectStatus(projectId: string, bidId: string) {
    await this.projectModel.findByPkOrThrow(projectId);
    await this.tenderBidModel.findByPk(bidId);

    const updatedData = await this.tenderBidModel.update(
      { status: BidStatus.ACCEPTED },
      { where: { id: bidId }, returning: true },
    );

    await this.projectModel.update(
      { awardedBidId: bidId },
      { where: { id: projectId }, returning: true },
    );
    const [affectedCount, affectedRows] = updatedData;

    await this.tenderBidModel.update(
      { status: BidStatus.REJECTED },
      {
        where: { ProjectId: projectId, id: { [Op.not]: bidId } },
        returning: true,
      },
    );

    return affectedRows;
  }

  async completeFundManagerProfile(data: UpdateFundManagerDto, id: string) {
    const fundManager = await this.fundManagerModel.findOne({
      where: { id },
    });

    if (!fundManager)
      throw new NotFoundException('fund manager does not exist');
    const updatedData = await this.fundManagerModel.update(
      { ...data },
      { where: { id }, returning: true },
    );
    const [affectedCount, affectedRows] = updatedData;
    return affectedRows;
  }

  async createFundManagerProject(
    data: superAdminCreateFundManageProjectDto,
    fundManagerId: string,
    superAdminId: string,
  ) {
    const dbTransaction = await this.sequelize.transaction();
    try {
      const {
        title,
        description,
        image,
        fileName,
        startDate,
        endDate,
        location,
        builderId,
        message,
        inviteeEmail,
      } = data;

      const fundManager = await this.fundManagerModel.findByPkOrThrow(
        fundManagerId,
        { include: [{ all: true }] },
      );
      if (!fundManager) throw new NotFoundException(`FundManager not found`);

      const builder = await this.userModel.findOne({
        where: { BuilderId: builderId },
      });

      const newProject = await this.projectModel.create(
        {
          title,
          description,
          fileName,
          image,
          location,
          startDate,
          endDate,
          CreatedById: superAdminId,
          ownerId: fundManager.ownerId,
          ProjectType: ProjectType.REQUEST,
          status: ProjectStatus.PENDING,
        },
        { transaction: dbTransaction },
      );
      if (!builder) {
        const data = {
          toName: inviteeEmail,
          toEmail: inviteeEmail,
          message,
          inviteeName: fundManager.owner.name,
          phoneNumber: fundManager.phone,
          projectId: newProject.id,
        };

        await this.emailServices.fundManagerPlatformInvitationsEmail(data);
      } else {
        await this.projectSharesModel.create(
          {
            ProjectId: newProject.id,
            FundManagerId: fundManager.id,
            BuilderId: builder.id,
            CreatedById: superAdminId,
          },
          { transaction: dbTransaction },
        );
      }

      const builderName = builder ? builder.name : inviteeEmail;

      const projectWallet = await this.projectWalletService.createWallet(
        {
          ProjectId: newProject.id,
        },
        dbTransaction,
      );

      newProject.walletId = projectWallet?.id;
      await newProject.save({ transaction: dbTransaction });

      await this.userLogModel.create({
        teamMemberId: superAdminId,
        activityTitle: 'New project created.',
        activityDescription: `${fundManager.businessName} project created. ${fundManager.businessName} added as the fund manager and ${builderName} added as builder.`,
      });

      await dbTransaction.commit();
      return newProject;
    } catch (error) {
      dbTransaction.rollback();
      throw error;
    }
  }

  async createFundManager(
    data: superAdminCreateFundManagerDto,
    superAdminId: string,
  ) {
    const dbTransaction = await this.sequelize.transaction();
    try {
      const { email, name, businessName, phone } = data;

      const password = generatePassword(12);
      const fundManager = await this.fundManagerModel.findOne({
        where: { email },
      });
      if (fundManager) {
        throw new ConflictException('email already exist');
      }
      const fundManagerData = await this.fundManagerModel.create(
        {
          email,
          businessName,
          phone,
          createdAt: new Date(),
          lastLogin: new Date(),
        },
        { transaction: dbTransaction },
      );

      const newUserData = await this.userModel.create(
        {
          name,
          CreatedById: superAdminId,
          FundManagerId: fundManagerData.id,
          createdAt: new Date(),
          userType: UserType.FUND_MANAGER,
          emailVerified: true,
          acceptTerms: true,
          password,
          email,
          status: UserStatus.ACTIVE,
        },
        { transaction: dbTransaction },
      );
      fundManagerData.ownerId = newUserData.id;
      await fundManagerData.save({ transaction: dbTransaction });

      const account_number = await genAccountNumber(newUserData.id);

      const userWallet = await this.userWalletService.createWallet(
        {
          UserId: newUserData?.id,
          CreatedById: newUserData?.id,
          account_number,
        },
        dbTransaction,
      );
      newUserData.walletId = userWallet?.id;
      await newUserData.save({ transaction: dbTransaction });

      const newTeam = await this.teamModel.create(
        {
          name:
            `Team_${fundManagerData.businessName}` ||
            `Team_${fundManagerData.businessName}`,
          ownerId: newUserData.id,
          createdAt: new Date(),
          createdById: newUserData.id,
        },
        { transaction: dbTransaction },
      );
      const ownerRole = await Role.findOrCreate({
        where: {
          name: SystemRolls.SUPER_ADMIN,
          description: SystemRolls.SUPER_ADMIN,
        },
        transaction: dbTransaction,
      });
      await this.userRoleModel.create(
        {
          UserId: newUserData.id,
          RoleId: ownerRole[0].id,
        },
        { transaction: dbTransaction },
      );
      await this.teamMembermodel.create(
        {
          TeamId: newTeam.id,
          UserId: newUserData.id,
          position: MEMBER_POSITION.OWNER,
          createdAt: new Date(),
          createdById: newUserData.id,
        },
        { transaction: dbTransaction },
      );

      dbTransaction.commit();
      await this.emailServices.sendAccountCreated({
        name,
        email,
        password,
        userType: UserType.FUND_MANAGER,
      });

      await this.userLogModel.create({
        teamMemberId: superAdminId,
        activityTitle: 'New fund manager created.',
        activityDescription: `Fund manager account created on behalf of ${data.businessName}.`,
      });
      const { password: userPassword, ...userData } = newUserData;
      return userData;
    } catch (error) {
      dbTransaction.rollback;
      throw error;
    }
  }

  async assignProcurementManagersToFundManagers(
    fundmanagerId: string,
    procurementManagerId: string,
  ) {
    const fundManager = await this.fundManagerModel.findOne({
      where: { id: fundmanagerId },
    });

    if (!fundManager)
      throw new NotFoundException('fund manager does not exist');

    const procurementManager = await this.userModel.findOne({
      where: { id: procurementManagerId },
    });

    if (!procurementManager)
      throw new NotFoundException('procurement manager does not exist');

    const updatedFundmanager = await this.fundManagerModel.update(
      { procurementManagerId },
      { where: { id: fundmanagerId }, returning: true },
    );

    const [affectedRows] = updatedFundmanager;
    return affectedRows[0];
  }

  async getBids(ProjectId: string) {
    const project = await this.projectModel.findOne({
      where: { id: ProjectId },
      include: [
        {
          model: TenderBid,
          as: 'bids',
          include: [
            {
              model: User,
              as: 'Owner',
              include: [
                {
                  model: Builder,
                  attributes: ['email', 'businessName', 'businessAddress'],
                  include: [
                    {
                      model: Project,
                      as: 'CompanyProjects',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
    const { bids } = project;

    const result = bids.map((request) => {
      const startDate = moment(project.startDate);
      const endDate = moment(project.endDate);
      const daysDuration = endDate.diff(startDate, 'days');
      const weeksDuration = endDate.diff(startDate, 'weeks');
      const monthsDuration = endDate.diff(startDate, 'months');

      const completedProjects = request.Owner.Builder.CompanyProjects?.filter(
        (project) => project.status === ProjectStatus.COMPLETED,
      ).length;

      return {
        bidId: request.id,
        builderId: request.Owner.Builder.id,
        builderName: request.Owner.Builder.businessName,
        location: request.Owner.Builder.businessAddress,
        completedProjects,
        quote: Number(project.budgetAmount),
        status: request.status,
        estimatedDelivery: {
          daysDuration: `${daysDuration} days`,
          weeksDuration: `${weeksDuration} weeks`,
          monthsDuration: `${monthsDuration} months`,
        },
        bid: request,
      };
    });

    return result;
  }

  async getBidById(ProjectId: string) {
    const bid = await this.tenderBidModel.findOne({
      where: { id: ProjectId },
      include: [
        {
          model: Project,
        },
        {
          model: User,
          as: 'Owner',
        },
      ],
    });

    const startDate = moment(bid.project.startDate);
    const endDate = moment(bid.project.endDate);
    const daysDuration = endDate.diff(startDate, 'days');
    const weeksDuration = endDate.diff(startDate, 'weeks');
    const monthsDuration = endDate.diff(startDate, 'months');

    const bidDetails = {
      bidId: bid.id,
      builderId: bid.Owner.Builder.id,
      builderName: bid.Owner.Builder.businessName,
      location: bid.Owner.Builder.businessAddress,
      quote: Number(bid.project.budgetAmount),
      status: bid.status,
      estimatedDelivery: {
        daysDuration: `${daysDuration} days`,
        weeksDuration: `${weeksDuration} weeks`,
        monthsDuration: `${monthsDuration} months`,
      },
    };

    return { bid, bidDetails };
  }

  async calculateDuration(startDate: Date, endDate: Date): Promise<number> {
    if (startDate && endDate) {
      const millisecsPerDay = 24 * 60 * 60 * 1000;
      const millisecondDuration = endDate.getTime() - startDate.getTime();
      const durationWeeks = millisecondDuration / millisecsPerDay;

      return Math.round(durationWeeks / 7);
    }
  }
}
