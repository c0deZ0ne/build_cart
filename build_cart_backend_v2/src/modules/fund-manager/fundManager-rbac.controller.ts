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
import { SponsorGuard } from '../auth/guards/fundManager.guard';
import { SponsorRolesService } from './fundManager-rbac.services';
import { GetUser } from '../auth/user.decorator';
import { User } from '../user/models/user.model';
import {
  DesignUserRoleDto,
  createUserRoleDto,
} from '../rbac/dtos/create-UserRole.dto';
import { CreatePermissionDto } from '../rbac/dtos/permission';
import { CreateResourcesAccessDto } from '../rbac/dtos/create-resources.dto';
import { createPermissionResourcesAccess } from '../rbac/dtos/permissionResourcesAccess';
import {
  DeleteRolePermissionDto,
  createRolePermissionDto,
} from '../rbac/dtos/create-rolesPermision.dto';

@Controller('/fundManager')
@ApiTags('fundManager')
@ApiBearerAuth()
@UseGuards(SponsorGuard)
export class SponsorRolesController {
  constructor(private readonly rolesService: SponsorRolesService) {}

  @ApiOperation({
    summary: 'create a role to assign to your team or a user',
  })
  @Post('create-role')
  async createRole(
    @GetUser(ValidationPipe) user: User,
    @Body() body: CreateRoleDto,
  ) {
    return this.rolesService.createRole({ body, user });
  }

  @ApiOperation({
    summary: 'Assign a defined role to a user-team member',
  })
  @Post('assign-role')
  async asignRolesToUsers(
    @GetUser() user: User,
    @Body(ValidationPipe) body: createUserRoleDto,
  ) {
    return this.rolesService.createUserRole({ body, user });
  }

  @ApiOperation({
    summary: 'remove a defined role from a user-team member',
  })
  @Post('remove-role')
  async removeRolesToUsers(
    @GetUser() user: User,
    @Body(ValidationPipe) body: DesignUserRoleDto,
  ) {
    return this.rolesService.removeUserRole({ body, user });
  }

  @ApiOperation({
    summary: 'create dynamic permissions to give to roles',
  })
  @Post('create-permission')
  async createPermission(
    @GetUser() user: User,
    @Body(ValidationPipe) body: CreatePermissionDto,
  ) {
    return this.rolesService.createPermission({ body, user });
  }

  @ApiOperation({
    summary: 'give permissions existing roles',
  })
  @Post('roles-permission')
  async crateRolesPermission(
    @GetUser(ValidationPipe) user: User,
    @Body() body: createRolePermissionDto,
  ) {
    return this.rolesService.rolePermision({ body, user });
  }

  @ApiOperation({
    summary: 'remove permissions from existing role',
  })
  @Post('decline-permission')
  async removeRolesPermission(
    @GetUser() user: User,
    @Body(ValidationPipe) body: DeleteRolePermissionDto,
  ) {
    return this.rolesService.removeRolePermision({ body, user });
  }

  @ApiOperation({
    summary: 'view all existing roles with their given permissions',
  })
  @Get('roles-permission')
  async getAllRolesPermision(@GetUser() user: User) {
    return this.rolesService.getAllRolesPermisionss({ user });
  }

  @ApiOperation({
    summary: 'view all existing roles',
  })
  @Get('roles')
  async getAllRoles(@GetUser() user: User) {
    return this.rolesService.getAllRoles({ user });
  }

  @ApiOperation({
    summary: 'view all existing permissions with their given roles ',
  })
  @Get('permission')
  async getAllPermissions(@GetUser() user: User) {
    return this.rolesService.getAllPermisions({ user });
  }

  @ApiOperation({
    summary: 'create a resource access point to roles ',
  })
  @Post('create-resource-access')
  async shareAccessToResources(
    @Body(ValidationPipe) body: CreateResourcesAccessDto,
    @GetUser() user: User,
  ) {
    return this.rolesService.createResourcesAccess({ user, body });
  }

  @ApiOperation({
    summary: 'grant permission to a resource ',
  })
  @Post('grantPermisionToRecourse')
  async grantPermisionToResources(
    @Body(ValidationPipe) body: createPermissionResourcesAccess,
    @GetUser() user: User,
  ) {
    return this.rolesService.createPermisionAccessResourceAccess({
      user,
      body,
    });
  }
}
