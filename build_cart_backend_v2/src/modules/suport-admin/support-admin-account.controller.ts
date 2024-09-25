import { Body, Controller, Get, Patch, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { User } from '../user/models/user.model';
import { GetUser } from '../auth/user.decorator';
import { SupportAdminService } from './support-admin-account.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserService } from '../user/user.service';
import { SupportAdminProfileUpdateDTO, SupportAdminSecurityUpdateDTO } from './dto/security-update.dto';

@Controller('support-admin')
@ApiTags('support-admin-statistic')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class SupportAdminController {
  constructor(
    private readonly supportAdminService: SupportAdminService,
    private readonly userService: UserService
    ) {}
  @Get('statistics')
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date for date range filtering' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date for date range filtering' })
  async supportAdminStatistics(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @GetUser() user: User, 
  ) {
    try {
      const statistics = await this.supportAdminService.supportAdminStatistics({
        user,
        startDate,
        endDate,
      });

      return statistics;
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({
    summary: 'update your security details',
  })
  @Patch('security-update')
  async securityUpdate(
    @GetUser() user: User,
    @Body(ValidationPipe) securityUpdateDto: SupportAdminSecurityUpdateDTO,
  ) {
    return this.userService.securityUpdate({ user, securityUpdateDto });
  }
  @ApiOperation({
    summary: 'update your profile ',
  })
  @Patch('account-update')
  async AccountDetails(
    @GetUser() user: User,
    @Body(ValidationPipe) body: SupportAdminProfileUpdateDTO,
  ) {
    return this.userService.updateUser({ user, body:{...body,id:user.id} });
  }
  @ApiOperation({
    summary: 'Get Account details',
  })
  @Get('account-update')
  async accountDetails(
    @GetUser() {id}: User,
  ) {
    return this.userService.getUserById(id );
  }
}
