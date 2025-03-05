import { SetMetadata } from '@nestjs/common';

export const RequirePrivileges = (...privileges: string[]) => SetMetadata('privileges', privileges); 