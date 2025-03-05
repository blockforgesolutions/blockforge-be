import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PrivilegeGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPrivileges = this.reflector.get<string[]>('privileges', context.getHandler());
    if (!requiredPrivileges) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user || !user.privileges) {
      return false;
    }

    return requiredPrivileges.every(privilege => 
      user.privileges.includes(privilege)
    );
  }
} 