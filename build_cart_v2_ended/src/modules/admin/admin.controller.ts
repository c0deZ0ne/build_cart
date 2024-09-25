import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from '../auth/guards/admin.guard';
import { User } from '../user/models/user.model';
import { GetUser } from '../auth/user.decorator';

@Controller('admin')
@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(AdminGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @ApiOperation({
    summary: 'Get all Admin Dashboard Statistics',
  })
  @Get('')
  async getAdminStatistics(@GetUser() user: User) {
    return await this.adminService.adminStatistics(user);
  }
}
