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
import { BuilderService } from './builder.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { BuilderGuard } from 'src/modules/auth/guards/builder.guard';
import { User } from 'src/modules/user/models/user.model';
import { FundmanagerPlatformInvitation } from '../invitation/dto/platformInvitation.dto';
import { BuilderFundManagerService } from './builder-fundmanager-service';
import { AddFundManagersToBuilderDto } from './dto/update-builder-profile.dto';
import { GetUser } from '../auth/user.decorator';
import { UseSubscription } from '../platfrom-subscription/platform-subscription.decorator';

@Controller('builder')
@ApiTags('builder')
@ApiBearerAuth()
  @UseGuards(BuilderGuard)
    @UseSubscription()

export class BuilderFundManagerController {
  constructor(
    private readonly builderService: BuilderService,
    private readonly builderfundmanagerService: BuilderFundManagerService,
  ) {}

  @Get('/my/fundmanagers')
  @ApiOperation({
    summary: 'Retrieves all builder fundmanagers',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description:
      'Search query for fundmanagers. Searches in fields: businessName, location, ',
  })
  async fetchAllMyFundManagers(
    @GetUser() { BuilderId }: User,
    @Query('search') search: string,
  ) {
    return this.builderfundmanagerService.getMyFundManagers(BuilderId, search);
  }

  @Patch('/my/fundmanagers')
  @ApiOperation({
    summary: 'Add fundmanagers to builder profile',
  })
  async addToMyFundManagers(
    @GetUser() { BuilderId }: User,
    @Body(ValidationPipe) data: AddFundManagersToBuilderDto,
  ) {
    return this.builderfundmanagerService.addToMyFundManagers(
      BuilderId,
      data.fundmanagersId,
    );
  }

  @Post('/fundmanagers/send-invite')
  @ApiOperation({
    summary: 'Send invite to a fund manager to join you project as a builder',
  })
  async sendInviteToFundManager(
    @Body(ValidationPipe) data: FundmanagerPlatformInvitation,
    @GetUser() user: User,
  ) {
    return await this.builderfundmanagerService.sendInviteToFundManager(
      data,
      user,
    );
  }

  @Get('/fund-manager/projects')
  @ApiOperation({
    summary: 'Get all fund manager projects that a builder is part off',
  })
  @ApiQuery({
    name: 'fundmanagerId',
    required: true,
    description: 'Search query for fund managers projects ',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description:
      'Search query for fund managers. Searches in fields: project title, location, ',
  })
  async getProjectsCreatedByFundManager(
    @Query('fundmanagerId') fundmanagerId: string,
    @Query('search') search: string,
  ) {
    return await this.builderfundmanagerService.getProjectsCreatedByFundManager(
      fundmanagerId,
      search,
    );
  }

  @Get('/fundmanager-profile')
  @ApiOperation({
    summary: 'get fundmanager details',
  })
  @ApiQuery({
    name: 'fundmanagerId',
    required: true,
    description: 'Search query for fundmanagers projects ',
  })
  async getFundManagersDetails(@Query('fundmanagerId') fundmanagerId: string) {
    return await this.builderfundmanagerService.fundManagerDetails(
      fundmanagerId,
    );
  }

  @Get('/fundmanager/project')
  @ApiOperation({
    summary: 'gets fundmanager project details',
  })
  @ApiQuery({
    name: 'projectId',
    required: true,
    description: 'unique identifier for the project',
  })
  async getProjectDetails(@Query('projectId') projectId: string) {
    return await this.builderfundmanagerService.getProjectDetails(projectId);
  }
}
