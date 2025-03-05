import { Injectable, CanActivate, ExecutionContext, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PRIVILEGES_KEY } from '../decorators/privileges.decorator';

@Injectable()
export class PrivilegesGuard implements CanActivate {
  private readonly logger = new Logger(PrivilegesGuard.name);
  
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPrivileges = this.reflector.getAllAndOverride<string[]>(PRIVILEGES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    this.logger.debug(`Required privileges: ${JSON.stringify(requiredPrivileges)}`);

    if (!requiredPrivileges) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    this.logger.debug(`User: ${JSON.stringify(user)}`);
    this.logger.debug(`User role: ${JSON.stringify(user?.role)}`);
    
    // Kullanıcının rolündeki tüm yetkileri al
    const userPrivileges = user?.role?.privileges?.map(p => p.name) || [];
    this.logger.debug(`User privileges: ${JSON.stringify(userPrivileges)}`);
    
    // Gerekli yetkilerden en az birine sahip mi kontrol et
    const hasPrivilege = requiredPrivileges.some(privilege => userPrivileges.includes(privilege));
    this.logger.debug(`Has required privilege: ${hasPrivilege}`);
    
    return hasPrivilege;
  }
} 