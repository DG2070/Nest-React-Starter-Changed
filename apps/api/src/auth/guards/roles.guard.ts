import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { REQUEST_USER_KEY, ROLES_KEYS } from '../constants/auth-constants';
import { ActiveUserData } from '../interfaces/active-user-data.interfce';
import { Role } from 'src/role/entities/role.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const contextRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEYS, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!contextRoles) return true;
    const user: ActiveUserData = context.switchToHttp().getRequest()[
      REQUEST_USER_KEY
    ];
    // return contextRoles.some((role) => user.role === role); //for Roles Guard with enum of Roles
    return false; //need to change if you want to implement, as this always returns false
  }
}
