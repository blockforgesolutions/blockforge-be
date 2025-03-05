import { ApiProperty } from '@nestjs/swagger';

export class PrivilegeResponse {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  id: string;

  @ApiProperty({ example: 'READ_USERS' })
  name: string;

  @ApiProperty({ example: 'Can view user list' })
  description: string;

  @ApiProperty({ example: 'user' })
  resource: string;

  @ApiProperty({ example: 'read' })
  action: string;
}

export class RoleResponse {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  id: string;

  @ApiProperty({ example: 'MANAGER' })
  name: string;

  @ApiProperty({ example: 'Firma Yöneticisi' })
  description: string;

  @ApiProperty({ type: [PrivilegeResponse] })
  privileges: PrivilegeResponse[];
}

export class CreateRoleResponse {
  @ApiProperty({ type: RoleResponse })
  role: RoleResponse;

  @ApiProperty({ example: 'Role created successfully' })
  message: string;
}

export class UpdateRoleResponse {
  @ApiProperty({ type: RoleResponse })
  role: RoleResponse;

  @ApiProperty({ example: 'Role updated successfully' })
  message: string;
}

export class DeleteRoleResponse {
  @ApiProperty({ example: 'Role deleted successfully' })
  message: string;
} 