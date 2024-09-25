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
import { GetUser } from 'src/modules/auth/user.decorator';
import { User } from 'src/modules/user/models/user.model';
import { ProjectMediaService } from '../project-media/project-media.service';
import { AddProjectMediaDTO } from '../builder/dto/create-project-media.dto';
import { GetProjectMediaDto } from '../builder/dto/get-project-media.dto';
import { SponsorGuard } from '../auth/guards/fundManager.guard';
import { randomUUID } from 'crypto';

@Controller('fundManager')
@ApiTags('fundManager')
@ApiBearerAuth()
@UseGuards(SponsorGuard)
export class SponsorProjectMediaController {
  constructor(private readonly projectMediaService: ProjectMediaService) {}

  @ApiOperation({
    summary: 'add media to project ',
  })
  @Post('project-media/')
  async createRfqRequest(
    @GetUser() user: User,
    @Body(ValidationPipe) body: AddProjectMediaDTO,
  ) {
    await this.projectMediaService.uploadMedia({ body, user });
  }

  @ApiOperation({
    summary: `Retrieve project media by userType (FILE,VIDEO, IMAGE) for project ${randomUUID()}`,
  })
  @Get('/get-project-media')
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
