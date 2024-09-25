import { InjectModel } from '@nestjs/sequelize';

import { User } from 'src/modules/user/models/user.model';

import { GroupName } from './models/group-name.model';
import {
  CreateGroupNameDto,
  EditProjectGroupDto,
} from './dto/creeate-group.dto';
import { Injectable } from '@nestjs/common';
import { ProjectGroup } from './models/project-group';
import { CreateProjectGroupDto } from './dto/add-project-toGroup.dto';
import { Transaction as SequelizeTransaction } from 'sequelize';
import { Project } from './models/project.model';
@Injectable()
export class ProjectGroupService {
  constructor(
    @InjectModel(ProjectGroup)
    private readonly projectGroupModel: typeof ProjectGroup,
    @InjectModel(GroupName)
    private readonly groupNameModel: typeof GroupName,
  ) {}

  async createGroup({
    body,
    user,
    dbTransaction,
  }: {
    body: CreateGroupNameDto;
    user: User;
    dbTransaction?: SequelizeTransaction;
  }) {
    return await this.groupNameModel.create(
      {
        ...body,
        createdAt: new Date(),
        ownerId: user.id,
      },
      { transaction: dbTransaction },
    );
  }
  async addProjectToGroup({
    body,
    user,
    dbTransaction,
  }: {
    body: CreateProjectGroupDto;
    user: User;
    dbTransaction?: SequelizeTransaction;
  }) {
    try {
      return await this.projectGroupModel.create(
        {
          ...body,
          createdAt: new Date(),
        },
        { transaction: dbTransaction },
      );
    } catch (error) {}
  }

  async getGroups(user: User) {
    return await this.groupNameModel.findAll({
      where: {
        ownerId: user.id,
      },
    });
  }

  async editGroup({
    body,
    dbTransaction,
  }: {
    body: EditProjectGroupDto;
    dbTransaction?: SequelizeTransaction;
  }): Promise<GroupName> {
    const { groupId, projectIds, ...rest } = body;
    const group = await this.groupNameModel.findByPkOrThrow(groupId);
    await group.update(
      {
        ...rest,
        updatedAt: new Date(),
      },
      { transaction: dbTransaction },
    );

    if (projectIds.length > 0) {
      const bulkData = projectIds.map((projectId) => {
        return {
          ProjectId: projectId,
          GroupNameId: group.id,
        };
      });

      await this.projectGroupModel.bulkCreate(bulkData, {
        transaction: dbTransaction,
      });
    }

    return group;
  }

  async getGroupById(groupId: string) {
    return await this.groupNameModel.findByPkOrThrow(groupId, {
      include: [Project],
    });
  }
}
