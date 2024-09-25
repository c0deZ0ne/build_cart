import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { BuilderGuard } from '../auth/guards/builder.guard';
import { ProjectTender } from '../fund-manager/models/project-tender.model';
import { BuilderProjectTenderService } from './builder-tender.service';
import { UseSubscription } from '../platfrom-subscription/platform-subscription.decorator';

@Controller('builder')
@ApiTags('builder')
@ApiBearerAuth()
  @UseGuards(BuilderGuard)
    @UseSubscription()

export class BuilderTenderController {
  constructor(
    private readonly builderProjectTenderService: BuilderProjectTenderService,
  ) {}
  @ApiOperation({
    summary: `get all ongoing tenders`,
    description: 'this Api get ongoing tenders',
  })
  @ApiOkResponse({
    description: 'Get tenders  by fund managers and status ongoing',
    type: Promise<ProjectTender[]>,
  })
  @Get('/tenders')
  async getTenders(): Promise<ProjectTender[]> {
    return this.builderProjectTenderService.getTender();
  }
}
