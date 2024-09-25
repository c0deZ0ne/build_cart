import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../user/models/user.model';
import { MyProject } from './models/myProjects.model';
import { CreateMyProjectDto } from './dto/my-project-create.dto';
import { ProjectService } from '../project/project.service';
import { Project } from '../project/models/project.model';
import { SharedProject } from '../shared-project/models/shared-project.model';

@Injectable()
export class MyProjectService {
  constructor(
    @InjectModel(MyProject)
    private readonly myProject: typeof MyProject,
    private readonly projectService: ProjectService,
  ) {}

  async create(data: CreateMyProjectDto): Promise<MyProject> {
    return this.myProject.create(data);
  }

  async getAllMyProjectsByUser(user: User): Promise<MyProject[]> {
    return this.myProject.findAll({
      where: {
        UserId: user.id,
      },
      include: [SharedProject],
    });
  }

  async getMyProjectById(id: string, user: User): Promise<MyProject> {
    const myProject = await this.myProject.findByPk(id);
    if (!myProject) {
      throw new NotFoundException('My project not found');
    }

    if (myProject.UserId !== user.id) {
      throw new UnauthorizedException(
        'You are not the owner of this my project',
      );
    }

    return myProject;
  }

  async getMyProjectBySharedProjectId(projectId: string) {
    return await this.myProject.findOne({
      where: {
        SharedProjectId: projectId,
      },
    });
  }

  async getMyProjectsWithUserReferences(user: User) {
    return await MyProject.findAll({
      where: {
        UserId: user.id,
      },
      include: [
        {
          model: SharedProject,
          include: [
            {
              model: Project,
            },
            {
              model: User,
              as: 'CreatedBy',
              attributes: { exclude: ['password'] },
            },
          ],
        },
      ],
    });
  }

  async createMyProjectFromSharedProject({
    SharedProjectId,
    UserId,
  }: CreateMyProjectDto) {
    const sharedProject = await this.projectService.getProjectOrThrow(
      SharedProjectId,
    );
    if (!sharedProject) {
      throw new NotFoundException('Shared project not found');
    }

    const newProject = await this.myProject.create({
      UserId,
      SharedProjectId,
    });

    return newProject;
  }
}
