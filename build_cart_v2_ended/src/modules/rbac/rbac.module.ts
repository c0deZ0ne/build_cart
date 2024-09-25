import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Vendor } from '../vendor/models/vendor.model';
import { Team } from './models/team.model';
import { RbacServices } from './rbac.services';
import { Permission } from './models/permission';
import { TeamMember } from './models/user-teammembers.model';
import { Role } from './models/role.model';

@Module({
  imports: [SequelizeModule.forFeature([Role, Team, Permission, TeamMember])],
  controllers: [],
  providers: [RbacServices],
  exports: [RbacServices],
})
export class RbacModule {}
