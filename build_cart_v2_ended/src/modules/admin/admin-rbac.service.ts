import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreatePermissionDto } from '../rbac/dtos/permission';
import { CreateRoleDto } from '../rbac/dtos/create-role.dto';
import { Permission } from '../rbac/models/permission';
import { Role } from '../rbac/models/role.model';
import { User } from '../user/models/user.model';
import {
  createRolePermissionDto,
  DeleteRolePermissionDto,
} from '../rbac/dtos/create-rolesPermision.dto';
import { RolePermission } from '../rbac/models/role-permision.model';
import { UserRole } from '../rbac/models/user-role.model';
import {
  DesignUserRoleDto,
  createUserRoleDto,
} from '../rbac/dtos/create-UserRole.dto';
import { Resource } from '../rbac/models/resource.model';
import PermissionResource from '../rbac/models/permission-resources.model';
import { CreateResourcesAccessDto } from '../rbac/dtos/create-resources.dto';
import { createPermissionResourcesAccess as createPermissionResourcesAccess } from '../rbac/dtos/permissionResourcesAccess';

@Injectable()
export class AdminRolesService {
  constructor(
    @InjectModel(Role)
    private roleModel: typeof Role,
    @InjectModel(Permission)
    private permissionModel: typeof Permission,
    @InjectModel(RolePermission)
    private rolePermissionModel: typeof RolePermission,
    @InjectModel(UserRole)
    private userRoleModel: typeof UserRole,
    @InjectModel(Resource)
    private userResourceModel: typeof Resource,
    @InjectModel(PermissionResource)
    private userPermissionResource: typeof PermissionResource,
  ) {}

  async createRole({
    body,
    user,
  }: {
    body: CreateRoleDto;
    user: User;
  }): Promise<Role> {
    try {
      const currentRoles = await this.roleModel.findOne({
        where: { name: body.name, createdById: user.id },
      });
      if (currentRoles)
        throw new BadRequestException('This role already exist');
      return this.roleModel.create({
        ...body,
        createdAt: new Date(),
        createdById: user.id,
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async createPermission({
    user,
    body,
  }: {
    body: CreatePermissionDto;
    user: User;
  }): Promise<Permission> {
    try {
      const currentRoles = await this.permissionModel.findOne({
        where: { name: body.name, createdById: user.id },
      });
      if (currentRoles)
        throw new BadRequestException('This permission already exist');
      return this.permissionModel.create({
        ...body,
        createdAt: new Date(),
        createdById: user.id,
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async rolePermission({
    user,
    body,
  }: {
    body: createRolePermissionDto;
    user: User;
  }): Promise<RolePermission> {
    return await this.rolePermissionModel.create({
      ...body,
      createdAt: new Date(),
      createdById: user.id,
    });
  }
  async removeRolePermission({
    user,
    body,
  }: {
    body: DeleteRolePermissionDto;
    user: User;
  }): Promise<unknown> {
    return await this.rolePermissionModel.destroy({
      where: {
        id: body.rolePermissionId,
        createdById: user.id,
      },
    });
  }
  async createUserRole({
    user,
    body,
  }: {
    body: createUserRoleDto;
    user: User;
  }): Promise<UserRole> {
    const ExistingUserRoles = await this.userRoleModel.findOne({
      where: {
        createdById: user.id,
        RoleId: body.RoleId,
        UserId: body.UserId,
      },
    });
    if (ExistingUserRoles)
      throw new BadRequestException(
        'This role is already assigned to this user',
      );
    return await this.userRoleModel.create({
      ...body,
      createdAt: new Date(),
      createdById: user.id,
    });
  }
  async removeUserRole({
    user,
    body,
  }: {
    body: DesignUserRoleDto;
    user: User;
  }): Promise<unknown> {
    const ExistingUserRoles = await this.userRoleModel.findOne({
      where: {
        id: body.userRoleId,
        createdById: user.id,
      },
    });
    if (!ExistingUserRoles)
      throw new BadRequestException(
        'This role does not exits or assigned to this user',
      );
    return await this.userRoleModel.destroy({
      where: {
        id: body.userRoleId,
        createdById: user.id,
      },
    });
  }

  async getAllRolesPermisionss({
    user,
  }: {
    user: User;
  }): Promise<RolePermission[]> {
    return await this.rolePermissionModel.findAll({
      where: { createdById: user.id },
      include: [{ model: Role }, { model: Permission }],
    });
  }
  async getAllRoles({ user }: { user: User }): Promise<Role[]> {
    return await this.roleModel.findAll({});
  }
  async getAllPermisions({ user }: { user: User }): Promise<Permission[]> {
    return await this.permissionModel.findAll({
      where: { createdById: user.id },
      include: [
        { model: Role, attributes: ['name'] },
        { model: Resource, attributes: ['name'] },
      ],
    });
  }
  async createResourcesAccess({
    body,
    user,
  }: {
    body: CreateResourcesAccessDto;
    user: User;
  }): Promise<Resource> {
    const checkIfResourNameAlreadyExist = await this.userResourceModel.findOne({
      where: {
        name: body.name,
      },
    });

    if (checkIfResourNameAlreadyExist)
      throw new BadRequestException(
        'This resouce userType is already created and reference already exist share with users',
      );
    return await this.userResourceModel.create({
      ...body,
      createdAt: new Date(),
    });
  }

  async createPermisionAccessResourceAccess({
    body,
    user,
  }: {
    body: createPermissionResourcesAccess;
    user: User;
  }): Promise<PermissionResource> {
    return await this.userPermissionResource.create({
      ...body,
      createdById: user.id,
      createdAt: new Date(),
    });
  }
}
