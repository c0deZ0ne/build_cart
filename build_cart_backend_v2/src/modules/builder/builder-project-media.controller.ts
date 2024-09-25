import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BuilderGuard } from 'src/modules/auth/guards/builder.guard';
import { GetUser } from 'src/modules/auth/user.decorator';
import { User } from 'src/modules/user/models/user.model';
import { AddProjectMediaDTO } from './dto/create-project-media.dto';
import { ProjectMediaService } from '../project-media/project-media.service';
import { GetProjectMediaDto } from './dto/get-project-media.dto';
import { randomUUID } from 'node:crypto';

@Controller('builder')
@ApiTags('builder')
@ApiBearerAuth()
@UseGuards(BuilderGuard)
export class ProjectMediaController {
  constructor(private readonly projectMediaService: ProjectMediaService) {}

  @ApiOperation({
    summary: 'add media to project ',
  })
  @Post('project/media')
  async createRfqRequest(
    @GetUser() user: User,
    @Body(ValidationPipe) body: AddProjectMediaDTO,
  ) {
    await this.projectMediaService.uploadMedia({ body, user });
  }

  @ApiOperation({
    summary: `Retrieve project media by userType (FILE,VIDEO, IMAGE) for project ${randomUUID()}`,
  })
  @Get('/project/media')
  async getProjectMediaType(
    @Query(ValidationPipe)
    { VIDEO, FILE, IMAGE, projectId }: GetProjectMediaDto,
  ) {
    return await this.projectMediaService.getMediaUploadByMediaType({
      VIDEO,
      FILE,
      IMAGE,
      projectId,
    });
  }
}
