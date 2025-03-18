import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../user/user.schema';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass()
  ]);

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();    
    const user = request.user;
    
    
    
    if (!user) {
      return false;
    }

    if (!user?.role) {
      return false;
    }
    return requiredRoles.includes(user.role);
  }
} 