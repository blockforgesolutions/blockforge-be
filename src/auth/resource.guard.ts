import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class ResourceGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const resource = this.reflector.get<string>('resource', context.getHandler());
    if (!resource) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const resourceId = request.params.id;

    // Örnek: Kullanıcı kendi profilini güncelleyebilir
    if (resource === 'profile' && user.id === resourceId) {
      return true;
    }

    // Örnek: Kullanıcı kendi şirketine ait dökümanları görebilir
    if (resource === 'document' && user.companyId === request.params.companyId) {
      return true;
    }

    return false;
  }
} 