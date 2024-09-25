import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { SuperAdminTransactionService } from './super-admin-transactions.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorators';
import { UserRoles } from '../rbac/models/role.model';

@Controller('superAdmin')
@ApiTags('superAdmin-transactions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class SuperAdminTransactionController {
  constructor(
    private readonly superAdminTransactionService: SuperAdminTransactionService,
  ) {}

  @ApiOperation({
    summary: 'Get all Transactions',
  })
  @Get('/transactions')
  @Roles(UserRoles.SUPER_ADMIN)
  async getFundManagers() {
    return await this.superAdminTransactionService.getTransactions();
  }

  @ApiOperation({
    summary: 'Get all Revenues',
  })
  @Get('/revenue')
  @Roles(UserRoles.SUPER_ADMIN)
  async getRevenues() {
    return await this.superAdminTransactionService.getRevenues();
  }

  @ApiOperation({
    summary: 'search for projects by date filter',
  })
  @Get('/projects')
  @Roles(UserRoles.SUPER_ADMIN)
  async getFundManagerProjectsSearch(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return await this.superAdminTransactionService.getProjectsByDateFilter(
      startDate,
      endDate,
    );
  }
}
