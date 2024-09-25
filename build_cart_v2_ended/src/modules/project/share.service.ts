import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { ProjectShares, Status } from './models/project-shared.model';
import { CreateProjectSharesDto } from './dto/share-project.dto';
import { WhereOptions } from 'sequelize/types/model';
import { User, UserType } from '../user/models/user.model';
import { Project } from './models/project.model';
import { Builder } from '../builder/models/builder.model';
import { FundManager } from '../fund-manager/models/fundManager.model';
import { projectInvite } from './types';
import { getDuration } from 'src/util/util';

@Injectable()
export class ProjectSharesService {
  constructor(
    @InjectModel(ProjectShares)
    private readonly projectSharesModel: typeof ProjectShares,
    @InjectModel(Project)
    private readonly projectModel: typeof Project,
  ) {}

  async create({
    body,
    user,
  }: {
    body: CreateProjectSharesDto;
    user: User;
  }): Promise<ProjectShares> {
    try {
      const query: WhereOptions<ProjectShares> = {};
      if (user.userType == UserType.FUND_MANAGER) {
        query.BuilderId = body.BuilderId;
      } else if (user.userType == UserType.BUILDER) {
        query.FundManagerId = body.FundManagerId;
      }
      const project = await this.projectModel.findByPkOrThrow(body.ProjectId, {
        include: [{ model: User, as: 'Owner' }],
      });
      if (project.ownerId !== user.id)
        throw new BadRequestException('You are not the project owner');
      if (project.ownerId !== user.id)
        throw new BadRequestException('you cannot share project with yourself');
      query.ProjectId = body.ProjectId;
      const existShareWthUser = await this.projectSharesModel.findOne({
        where: query,
      });
      if (existShareWthUser)
        throw new BadRequestException(
          'already shared this project with this user',
        );
      const result = await this.projectSharesModel.create({
        ...body,
        status: Status.PENDING,
        CreatedById: user.id,
        createdAt: new Date(),
      });
      return result;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(id: string): Promise<ProjectShares> {
    return this.projectSharesModel.findByPkOrThrow(id);
  }

  async remove({
    sharedId,
    user,
  }: {
    sharedId: string;
    user: User;
  }): Promise<unknown> {
    try {
      const invite = await this.projectSharesModel.findByPkOrThrow(sharedId, {
        where: { id: sharedId },
        include: [
          { model: Project, include: [{ model: User, as: 'Owner' }] },
          { model: Builder },
          { model: FundManager },
        ],
      });
      if (!invite) return new BadRequestException('invite not');
      if (invite.status != Status.PENDING) {
        throw new BadRequestException(`Project Status is ${invite.status}`);
      }
      if (
        user.userType == UserType.BUILDER &&
        invite.BuilderId !== user.BuilderId
      ) {
        throw 'You are not invited to this project or contact the owner of the project';
      } else if (
        user.userType == UserType.FUND_MANAGER &&
        invite.FundManagerId !== user.FundManagerId
      ) {
        throw new BadRequestException(
          'You are not invited to this project or contact the owner of the project',
        );
      }
      await invite.destroy({ force: true });
      return { message: 'Successfully declined invitation' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getAllSharedProjectsForUser({
    user,
  }: {
    user: User;
  }): Promise<unknown> {
    const whereQuery: WhereOptions<ProjectShares> = {};
    if (user.BuilderId) whereQuery.BuilderId = user.BuilderId;
    if (user.FundManagerId) whereQuery.FundManagerId = user.FundManagerId;

    return await this.projectSharesModel.findAll({
      where: whereQuery,
      include: [{ model: Project }, { model: Builder }, { model: FundManager }],
    });
  }
  async getInvitesPending({ user }: { user: User }): Promise<projectInvite[]> {
    const whereQuery: WhereOptions<ProjectShares> = {};
    if (user.BuilderId) whereQuery.BuilderId = user.BuilderId;
    if (user.FundManagerId) whereQuery.FundManagerId = user.FundManagerId;
    whereQuery.status = Status.PENDING;

    const sharedData = await this.projectSharesModel.findAll({
      where: whereQuery,
      include: [
        { model: Project, include: [{ model: User, as: 'Owner' }] },
        { model: Builder },
        { model: FundManager },
      ],
    });

    const out: projectInvite[] = [];

    for (const acc of sharedData) {
      const invite: projectInvite = {
        dateCreated: acc.createdAt,
        location: acc.Project.location,
        title: acc.Project.title,
        sharedId: acc.id,
        owner: {
          name: acc.Project.Owner.businessName || acc.Project.Owner.name,
          phone: acc.Project.Owner.phoneNumber,
          email: acc.Project.Owner.email,
        },
        projectId: acc.Project.id,
        duration:
          (await getDuration(acc?.Project?.startDate, acc?.Project?.endDate)) ||
          '',
      };

      out.push(invite);
    }

    return out;
  }

  async acceptProjectInvite({
    user,
    sharedId,
  }: {
    user: User;
    sharedId: string;
  }): Promise<unknown> {
    try {
      const invite = await this.projectSharesModel.findByPkOrThrow(sharedId, {
        include: [
          { model: Project, include: [{ model: User, as: 'Owner' }] },
          { model: Builder },
          { model: FundManager },
        ],
      });
      if (invite.status != Status.PENDING) {
        throw new BadRequestException(`Project Status is ${invite.status}`);
      }
      if (
        user.userType === UserType.BUILDER &&
        invite.BuilderId !== user.BuilderId
      ) {
        throw new BadRequestException(
          'You are not invited to this project or contact the owner of the project',
        );
      } else if (
        user.userType == UserType.FUND_MANAGER &&
        invite.FundManagerId !== user.FundManagerId
      ) {
        throw 'You are not invited to this project or contact the owner of the project';
      }
      invite.status = Status.ACCEPTED;
      await invite.save();
      return { message: 'Successfully accepted invitation' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
