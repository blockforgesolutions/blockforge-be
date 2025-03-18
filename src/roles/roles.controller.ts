import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiSecurity } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleMessages } from '../common/enums/messages.enum';
import { RoleResponse, CreateRoleResponse, UpdateRoleResponse, DeleteRoleResponse } from './models/role.response';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RoleGuard } from 'src/common/guards/role.guard';

@ApiTags('Roles')
@ApiBearerAuth()
@ApiSecurity('JWT-auth')
@Controller('roles')
@UseGuards(JwtAuthGuard, RoleGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  // Role endpoints
  @Post()
  @Roles('ADMIN')
  @ApiOperation({ 
    summary: 'Create new role',
    description: 'Creates a new role with the specified name, description, and privileges'
  })
  @ApiResponse({ 
    status: 201, 
    description: RoleMessages.ROLE_CREATED_SUCCESS,
    type: CreateRoleResponse
  })
  @ApiResponse({ status: 400, description: RoleMessages.INVALID_ROLE_DATA })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 409, description: RoleMessages.ROLE_ALREADY_EXISTS })
  createRole(@Request() req, @Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.createRole(createRoleDto, req.user.id);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get all roles',
    description: 'Returns a list of all roles with their privileges'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'List of all roles',
    type: [RoleResponse]
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAllRoles(@Request() req) {
    return this.rolesService.findAllRoles(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get role by id',
    description: 'Returns a single role with its privileges'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Role details',
    type: RoleResponse
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: RoleMessages.ROLE_NOT_FOUND })
  findRoleById(@Request() req, @Param('id') id: string) {
    return this.rolesService.findRoleById(id, req.user.id);
  }

  @Put(':id')
  @ApiOperation({ 
    summary: 'Update role',
    description: 'Updates an existing role with new name, description, or privileges'
  })
  @ApiResponse({ 
    status: 200, 
    description: RoleMessages.ROLE_UPDATED_SUCCESS,
    type: UpdateRoleResponse
  })
  @ApiResponse({ status: 400, description: RoleMessages.INVALID_ROLE_DATA })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: RoleMessages.ROLE_NOT_FOUND })
  updateRole(@Request() req, @Param('id') id: string, @Body() updateRoleDto: CreateRoleDto) {
    return this.rolesService.updateRole(id, updateRoleDto, req.user.id);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ 
    summary: 'Delete role',
    description: 'Deletes an existing role if it is not in use'
  })
  @ApiResponse({ 
    status: 200, 
    description: RoleMessages.ROLE_DELETED_SUCCESS,
    type: DeleteRoleResponse
  })
  @ApiResponse({ status: 400, description: RoleMessages.CANNOT_DELETE_DEFAULT_ROLE })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: RoleMessages.ROLE_NOT_FOUND })
  @ApiResponse({ status: 409, description: RoleMessages.ROLE_IN_USE })
  deleteRole(@Param('id') id: string) {
    return this.rolesService.deleteRole(id);
  }
} 