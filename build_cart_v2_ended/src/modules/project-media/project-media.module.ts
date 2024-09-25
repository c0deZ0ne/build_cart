import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProjectModule } from '../project/project.module';
import { ProjectMedia } from './models/project-media.model';
import { ProjectMediaService } from './project-media.service';
import { Documents } from '../documents/models/documents.model';

@Module({
  imports: [
    SequelizeModule.forFeature([ProjectMedia, Documents]),
    forwardRef(() => ProjectModule),
  ],
  controllers: [],
  providers: [ProjectMediaService],
  exports: [ProjectMediaService],
})
export class ProjectMediaModule {}
