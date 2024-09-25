import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ProjectService } from '../project/project.service';
import { MediaType, ProjectMedia } from './models/project-media.model';
import { User } from '../user/models/user.model';
import { Op, Transaction } from 'sequelize';
import { Project, ProjectStatus } from '../project/models/project.model';
import { AddProjectMediaDTO } from '../builder/dto/create-project-media.dto';
import { GetProjectMediaDto } from '../builder/dto/get-project-media.dto';
import { Documents } from '../documents/models/documents.model';

@Injectable()
export class ProjectMediaService {
  constructor(
    @InjectModel(ProjectMedia)
    private readonly projectMediaModel: typeof ProjectMedia,
    @InjectModel(Documents)
    private readonly documentsModel: typeof Documents,
    @Inject(forwardRef(() => ProjectService))
    private projectService: ProjectService,
  ) {}

  async uploadMedia({ body, user }: { body: AddProjectMediaDTO; user: User }) {
    const project = await this.projectService.getProjectOrThrow(body.ProjectId);
    project.status = ProjectStatus.ACTIVE;
    project.save();
    await this.projectMediaModel.create({
      ...body,
      createdAt: new Date(),
      CreatedById: user.id,
    });

    if (body.mediaType === MediaType.FILE) {
      await this.documentsModel.create({
        projectId: body.ProjectId,
        others: {
          description: body.description,
          url: body.url,
          med: body.mediaType,
          title: body.title,
        },
        createdAt: new Date(),
      });
    }
  }
  async bulkUploadProjectMedia({
    body,
    user,
    dbTransaction,
  }: {
    body: AddProjectMediaDTO[];
    user: User;
    dbTransaction: Transaction;
  }) {
    try {
      const bulkData = body.map((data) => {
        return {
          ProjectId: data.ProjectId,
          description: data.description || 'media description',
          url: data.url,
          title: data.title || '',
          mediaType: data.mediaType,
          createdAt: new Date(),
          CreatedById: user.id,
        };
      });
      await this.projectMediaModel.bulkCreate(bulkData, {
        transaction: dbTransaction,
      });
    } catch (error) {
      console.error('Error occured during bulk media creation:', error.message);
    }
  }

  async getMediaUploadByMediaType(data: GetProjectMediaDto) {
    const res = await this.projectMediaModel.findAndCountAll({
      where: {
        [Op.or]: [
          data.FILE ? { mediaType: data.FILE } : null,
          data.VIDEO ? { mediaType: data.VIDEO } : null,
          data.IMAGE ? { mediaType: data.IMAGE } : null,
        ],
        ProjectId: data.projectId,
      },
      include: [{ model: Project }],
    });
    return res.rows;
  }

  async deleteMedia(projectMediaId: string) {
    await this.projectMediaModel.destroy({ where: { id: projectMediaId } });
  }

  async getProjectMediaOrthrow(projectMedia: string) {
    return await this.projectMediaModel.findByPkOrThrow(projectMedia);
  }
}
