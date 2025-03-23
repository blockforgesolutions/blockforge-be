import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { ModuleService } from './module.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ModuleResponse } from './model/module.response';
import { ModuleMessages } from 'src/common/enums/module-message.enum';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';

@ApiTags('Module')
@Controller('module')

export class ModuleController {
    constructor(
        private readonly moduleService: ModuleService
    ) { }


    @Post()
    @ApiSecurity('bearer')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles("ADMIN", "INSTRUCTOR")
    @ApiOperation({ summary: 'Create Module', description: 'Returns the created module' })
    @ApiResponse({
        status: 201,
        description: ModuleMessages.CREATED,
        type: ModuleResponse
    })
    @ApiResponse({ status: 400, description: ModuleMessages.INVALID_CREDENTIALS })
    @ApiResponse({ status: 401, description: ModuleMessages.UNAUTHORIZED_ACCESS })
    @ApiResponse({ status: 403, description: ModuleMessages.UNAUTHORIZED_ACCESS })
    async createModule(@Body() createModuleDto: CreateModuleDto): Promise<ModuleResponse> {
        return await this.moduleService.createModule(createModuleDto);
    }

    @Get(':moduleId')
    @ApiOperation({ summary: 'Get Module', description: 'Returns the module' })
    @ApiParam({ name: 'moduleId', type: String })
    @ApiResponse({
        status: 200,
        description: "The Module has been found",
        type: ModuleResponse
    })
    @ApiResponse({ status: 404, description: ModuleMessages.NOT_FOUND })
    async getModuleById(@Param('moduleId') moduleId: string): Promise<ModuleResponse> {
        return await this.moduleService.getModuleById(moduleId);
    }

    @Get('course/:courseId')
    @ApiOperation({ summary: 'Get Module', description: 'Returns the module' })
    @ApiResponse({
        status: 200,
        description: "The Modules has been found",
        type: [ModuleResponse]
    })
    async getCourseModules(@Param('courseId') courseId: string): Promise<ModuleResponse[]> {
        return await this.moduleService.getCourseModules(courseId);
    }

    @Put(':moduleId')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles("ADMIN", "INSTRUCTOR")
    @ApiOperation({ summary: 'Update Module', description: 'Returns the updated module' })
    @ApiParam({ name: 'moduleId', type: String })
    @ApiResponse({
        status: 200,
        description: ModuleMessages.UPDATED,
        type: ModuleResponse
    })
    @ApiResponse({ status: 400, description: ModuleMessages.INVALID_CREDENTIALS })
    @ApiResponse({ status: 401, description: ModuleMessages.UNAUTHORIZED_ACCESS })
    @ApiResponse({ status: 403, description: ModuleMessages.UNAUTHORIZED_ACCESS })
    @ApiResponse({ status: 404, description: ModuleMessages.NOT_FOUND })
    async updateModule(@Param('moduleId') moduleId: string, @Body() updateModuleDto: UpdateModuleDto): Promise<ModuleResponse> {
        return await this.moduleService.updateModule(moduleId, updateModuleDto);
    }

    @Delete(':moduleId')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles("ADMIN", "INSTRUCTOR")
    @ApiOperation({ summary: 'Delete Module', description: 'Returns the deleted module' })
    @ApiParam({ name: 'moduleId', type: String })
    @ApiResponse({
        status: 200,
        description: ModuleMessages.DELETED,
        type: ModuleResponse
    })
    @ApiResponse({ status: 400, description: ModuleMessages.INVALID_CREDENTIALS })
    @ApiResponse({ status: 401, description: ModuleMessages.UNAUTHORIZED_ACCESS })
    @ApiResponse({ status: 403, description: ModuleMessages.UNAUTHORIZED_ACCESS })
    @ApiResponse({ status: 404, description: ModuleMessages.NOT_FOUND })
    async deleteModule(@Param('moduleId') moduleId: string): Promise<any> {
        return await this.moduleService.deleteModule(moduleId);
    }
}
