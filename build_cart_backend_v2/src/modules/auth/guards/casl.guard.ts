import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { User, UserType } from 'src/modules/user/models/user.model';
import { Reflector } from '@nestjs/core';
import { UserService } from 'src/modules/user/user.service';
import { Request } from 'express';
import {
  CaslPermissionResources,
  SystemPermissions,
  SystemRolls,
} from '../types';
import { Role } from 'src/modules/rbac/models/role.model';

@Injectable()
export class CaslGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const refId = request.params.projectId;
    const user: User = request.user as User;
    const userData = await this.userService.getUserByEmail(user.email);

    const caslPermission = this.reflector.get<CaslPermissionResources>(
      'caslPermission',
      context.getHandler(),
    );

    if (
      !caslPermission ||
      !caslPermission.resources ||
      !caslPermission.action
    ) {
      return false;
    }

    const { action } = caslPermission;

    const userPermission = this.checkUserPermissions({
      userData,
      action,
      caslPermission,
    });
    return userPermission;
  }

  private checkUserPermissions({
    userData,
    action,
  }: {
    userData: User;
    action: any;
    caslPermission: CaslPermissionResources;
  }): boolean {
    let userPermission = false;
    if (userData.roles.length == 0) {
      userPermission = true;
    } else {
      const roleNames = userData.roles.map((role: Role) =>
        role.name.toLocaleLowerCase(),
      );
      const set1 = new Set(roleNames.map((item) => item.toLowerCase()));
      const set2 = new Set(action.map((item) => item.toLowerCase()));
      for (const item of set1) {
        if (set2.has(item)) {
          userPermission = true;
        }
      }
    }

    return userPermission;
  }
}
