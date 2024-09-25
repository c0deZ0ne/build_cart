import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiConsumes,
  ApiBody,
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { UploadFileDto } from '../material-schedule-upload/dto/upload-file.dto';
import { MaterialService } from '../material-schedule-upload/material.service';
import { RfqUploadTypeBody } from '../material-schedule-upload/type/rfq-upload-material';
import { BuilderGuard } from '../auth/guards/builder.guard';
import { GetUser } from '../auth/user.decorator';
import { User } from '../user/models/user.model';
import { UseSubscription } from '../platfrom-subscription/platform-subscription.decorator';

@Controller('builder')
@ApiTags('builder')
@ApiBearerAuth()
  @UseGuards(BuilderGuard)
    @UseSubscription()

export class BuilderMaterialController {
  constructor(private readonly materialService: MaterialService) {}
  @Post('material-schedule-upload')
  @UseInterceptors(FileInterceptor('materialSchedule'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description:
      'CSV or Excel file to upload from downloaded material schedule template',
    type: UploadFileDto,
  })
  async uploadFile(@UploadedFile() file: any, @Body() body: RfqUploadTypeBody) {
    return await this.materialService.uploadFile(file, body);
  }

  @ApiQuery({
    name: 'search',
    required: false,
    description:
      'Search query for Project. Searches in fields: Project title, location, ',
  })
  @ApiOperation({
    summary: 'projects material schedule',
  })
  @Get('/material-schedule/:projectId')
  async getProjectMaterialSchedule(
    @GetUser() user: User,
    @Param('projectId') projectId: string,
    @Query('search') search: string,
  ) {
    return await this.materialService.getProjectMaterialSchedule({
      user,
      projectId,
      search,
    });
  }
}
