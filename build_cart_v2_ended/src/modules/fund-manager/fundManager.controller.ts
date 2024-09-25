import {
  Body,
  Controller,
  Get,
  Param,
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
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { SponsorGuard } from 'src/modules/auth/guards/fundManager.guard';
import { GetUser } from 'src/modules/auth/user.decorator';
import { User } from 'src/modules/user/models/user.model';

import { FundManagerService } from './fundManager.service';
import { ChangePasswordDto } from './dto/ChangePasswordDto.dto';
import { randomUUID } from 'crypto';
import { NewFundManager } from './dto/reg-fund-manager.dto';
import { GetOverviewDto } from '../builder/dto/get-overview.dto';

@Controller('fundManager')
@ApiTags('fundManager')
export class SponsorController {
  constructor(private readonly fundManagerService: FundManagerService) {}

  @ApiOperation({
    summary: 'register fundManager',
  })
  @Post('/register')
  async registerFundManager(
    @Body(ValidationPipe) body: NewFundManager,
    @Query('invitationId') invitationId: string,
  ) {
    return await this.fundManagerService.registerFundManager({
      body,
      invitationId: invitationId,
    });
  }

  @ApiBearerAuth()
  @UseGuards(SponsorGuard)
  @ApiOperation({
    summary: 'get fundManager overview',
  })
  @Get('/overview')
  async fundManagerDashboard(@GetUser() user: User) {
    return await this.fundManagerService.getOverview(user);
  }

  @ApiBearerAuth()
  @UseGuards(SponsorGuard)
  @Get('/overview/project/cost')
  @ApiOperation({
    summary: 'Get fundManager project cost',
  })
  async projectCostOverview(
    @GetUser() user: User,
    @Query() dateFilter: GetOverviewDto,
  ) {
    return this.fundManagerService.getProjectCostOverview(user, dateFilter);
  }

  @ApiBearerAuth()
  @UseGuards(SponsorGuard)
  @ApiOperation({
    summary: `get order details for a project `,
    description: 'this Api get project order details',
  })
  @ApiParam({
    name: 'projectId',
    description: 'ID of the project',
    example: randomUUID(),
  })
  @ApiOkResponse({
    description: 'Get project orders details',
  })
  @Get('project/:projectId/order-details')
  async getSponsorProjectDetails(
    @Param('projectId') projectId: string,
  ): Promise<unknown> {
    return this.fundManagerService.getSponsorProjectDetails({ projectId });
  }
  // @ApiBearerAuth()
  // @UseGuards(SponsorGuard)
  // @ApiOperation({
  //   summary: 'get fundManager account',
  // })
  // @Get('/profile')
  // async fundManagerProfile(@GetUser() user: User) {
  //   return await this.fundManagerService.getProfile(user);
  // }
  @ApiBearerAuth()
  @UseGuards(SponsorGuard)
  @ApiOperation({
    summary: 'change password from dashboard',
  })
  @Patch('/change-password')
  async changePassword(
    @Body(ValidationPipe) body: ChangePasswordDto,
    @GetUser() user: User,
  ) {
    return await this.fundManagerService.changePassword(body, user);
  }

  // @ApiBearerAuth()
  // @UseGuards(SponsorGuard)
  // @ApiOperation({
  //   summary: 'update account details ',
  // })
  // @Patch('/update-profile')
  // async updateAccount(
  //   @Body(ValidationPipe) body: UpdateRegisterFundManagerDto,
  //   @GetUser() user: User,
  // ) {
  //   return await this.fundManagerService.updateAccount(body, user);
  // }
}
