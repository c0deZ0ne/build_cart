import { SetMetadata } from '@nestjs/common';
import { SystemPermissions, Resources, SystemRolls } from './types';

export const CaslPermissions = (
  resources: Resources,
  action: SystemPermissions[] | SystemRolls[],
) => SetMetadata('caslPermission', { resources, action });
