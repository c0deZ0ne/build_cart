import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { SponsorGuard } from 'src/modules/auth/guards/fundManager.guard';
import { GetUser } from 'src/modules/auth/user.decorator';
import { User } from 'src/modules/user/models/user.model';
import { AddBuilderToFundManagersDto } from './dto/update-fundManager.dto';
import {
  BuilderInvitation,
  BuilderPlatformInvitation,
} from '../invitation/dto/platformInvitation.dto';
import { FundManagerBuilderService } from './fundManager-builder.service';
import { UseSubscription } from '../platfrom-subscription/platform-subscription.decorator';

@Controller('fundManager')
@ApiTags('fundManager')
@ApiBearerAuth()
@UseGuards(SponsorGuard)
@UseSubscription()
export class FundManagerBuilderController {
  constructor(
    private readonly fundManagerBuilderService: FundManagerBuilderService,
  ) {}

  @Get('/builders')
  @ApiOperation({
    summary: 'Retrieves all builders',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description:
      'Search query for builder. Searches in fields: businessName, location, ',
  })
  async fetchAllBuilders(@Query('search') search: string) {
    return this.fundManagerBuilderService.getAllBuilders(search);
  }

  @Get('/my/builders')
  @ApiOperation({
    summary: 'Retrieves all fundmanager builders',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description:
      'Search query for builder. Searches in fields: businessName, location, ',
  })
  async fetchAllMyBuilders(
    @GetUser() { FundManagerId }: User,
    @Query('search') search: string,
  ) {
    return this.fundManagerBuilderService.getMyBuilders(FundManagerId, search);
  }

  @Patch('/my/builders')
  @ApiOperation({
    summary: 'Add builders to fundmanager profile',
  })
  async addToMyBuilders(
    @GetUser() { FundManagerId }: User,
    @Body(ValidationPipe) data: AddBuilderToFundManagersDto,
  ) {
    return this.fundManagerBuilderService.addToMyBuilders(
      FundManagerId,
      data.buildersId,
    );
  }

  @Post('/my/builder/send-invite')
  @ApiOperation({
    summary: 'Send invite to a builder',
  })
  async sendPlatformInviite(
    @Body(ValidationPipe) data: BuilderPlatformInvitation,
    @GetUser() user: User,
  ) {
    return await this.fundManagerBuilderService.sendInviteToBuilder(
      data as BuilderInvitation,
      user,
    );
  }

  @Get('/builder-projects')
  @ApiOperation({
    summary: 'get all builder projects',
  })
  @ApiQuery({
    name: 'builderId',
    required: true,
    description: 'Search query for fundmanagers projects ',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description:
      'Search query for fundmanagers. Searches in fields: project title, location, ',
  })
  async getBuilderProjects(
    @Query('builderId') builderId: string,
    @Query('search') search: string,
  ) {
    return await this.fundManagerBuilderService.getProjectsForBuilder(
      builderId,
      search,
    );
  }

  @Get('/builder-details')
  @ApiOperation({
    summary: 'Get a builder details',
  })
  @ApiQuery({
    name: 'builderId',
    required: true,
    description: 'Search query for a builder details ',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description:
      'Search query for project. Searches in fields: project title, location, ',
  })
  async getBuilderDetails(@Query('builderId') builderId: string) {
    return this.fundManagerBuilderService.getBuilderDetails(builderId);
  }
}
