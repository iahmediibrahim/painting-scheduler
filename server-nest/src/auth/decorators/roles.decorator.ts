import { SetMetadata } from '@nestjs/common';

export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  PAINTER = 'PAINTER',
}

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);