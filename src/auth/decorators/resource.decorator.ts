import { SetMetadata } from '@nestjs/common';

export const RequireResource = (resource: string) => SetMetadata('resource', resource); 