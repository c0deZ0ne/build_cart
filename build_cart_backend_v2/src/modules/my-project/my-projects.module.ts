import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { MyProject } from './models/myProjects.model';
import { MyProjectService } from './my-project.service';
import { ProjectModule } from '../project/project.module';
import { Project } from '../project/models/project.model';

@Module({
  imports: [
    SequelizeModule.forFeature([MyProject, Project]),

    forwardRef(() => ProjectModule),
  ],
  controllers: [],
  providers: [MyProjectService],
  exports: [MyProjectService],
})
export class MyProjectModule {}
