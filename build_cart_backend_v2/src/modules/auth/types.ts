import { UserStatus, UserType } from 'src/modules/user/models/user.model';
import { Subscription } from '../platfrom-subscription/model/subscription.model';
export interface UserPayLoad {
  sub: string;
  id: string;
  status: UserStatus;
  email: string;
  userType: UserType;
  market_vendor?: boolean;
  logo: string;
  userName: string;
  subscription: Partial<Subscription>;
}

export enum SystemPermissions {
  create = 'create',
  read = 'read',
  update = 'update',
  delete = 'delete',
  All = 'All',
}

export enum SystemRolls {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  SUPER_ADMIN = 'SUPER_ADMIN',
  MEMBER = 'MEMBER',
  OWNER = 'OWNER',
  CONTRACTOR = 'CONTRACTOR',
}
export enum Resources {
  Users = 'Users',
  Projects = 'Projects',
  ProjectMedias = 'ProjectMedias',
  Payments = 'Payments',
  RfqReuest = 'RfqRequests',
  Contracts = 'Contracts',
  TeamMember = 'TeamMember',
  SharedProjects = 'SharedProjects',
}

export type CaslPermissionResources = {
  action: SystemPermissions;
  resources: Resources;
};
