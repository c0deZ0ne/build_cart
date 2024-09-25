import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { CreateRoleDto } from '../rbac/dtos/create-role.dto';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { GetUser } from '../auth/user.decorator';
import { User } from '../user/models/user.model';

import { AdminGuard } from '../auth/guards/admin.guard';
import { AdminRolesService } from './admin-rbac.service';

@Controller('admin')
@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(AdminGuard)
export class AdminRolesController {
  constructor(private readonly rolesService: AdminRolesService) {}

  @ApiOperation({
    summary: 'create a system role',
  })
  @Post('role')
  async createRole(
    @GetUser() user: User,
    @Body(ValidationPipe) body: CreateRoleDto,
  ) {
    return this.rolesService.createRole({ body, user });
  }

  @ApiOperation({
    summary: 'get all system roles',
  })
  @Get('roles')
  async getAllSystemRoles(@GetUser() user: User) {
    return this.rolesService.getAllRoles({ user });
  }
}
