import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { ApiOperation, ApiResponse, ApiSecurity } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryMessages } from 'src/common/enums/category-message.enum';
import { CategoryResponse } from './model/category.response';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('category')
export class CategoryController {
    constructor(
        private readonly categoryService: CategoryService
    ) { }

    @Post()
    @ApiSecurity('bearer')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles("ADMIN")
    @ApiOperation({ summary: 'Create category', description: 'Returns created category' })
    @ApiResponse({
        status: 201,
        description: CategoryMessages.CREATED,
        type: CategoryResponse
    })
    @ApiResponse({ status: 400, description: CategoryMessages.INVALID_CREDENTIALS })
    @ApiResponse({ status: 401, description: CategoryMessages.UNAUTHORIZED_ACCESS })
    @ApiResponse({ status: 403, description: CategoryMessages.UNAUTHORIZED_ACCESS })
    async createCategory(@Body() category: CreateCategoryDto) {
        return await this.categoryService.createCategory(category);
    }

    @Get()
    @ApiOperation({ summary: 'Get all categories', description: 'Returns all categories' })
    @ApiResponse({
        status: 200,
        description: 'All categories returned',
        type: [CategoryResponse],
    })
    async getAllCategories() {
        return await this.categoryService.getAllCategories();
    }

    @Get(':categoryId')
    @ApiOperation({ summary: 'Get category by id', description: 'Returns category by id' })
    @ApiResponse({
        status: 200,
        description: 'Category returned',
        type: CategoryResponse
    })
    @ApiResponse({ status: 404, description: CategoryMessages.NOT_FOUND })
    async getCategoryById(@Param('categoryId') categoryId: string) {
        return await this.categoryService.getCategoryById(categoryId);
    }

    @Get('name/:name')
    @ApiOperation({ summary: 'Get category by name', description: 'Returns category by name' })
    @ApiResponse({
        status: 200,
        description: 'Category returned',
        type: CategoryResponse
    })
    @ApiResponse({ status: 404, description: CategoryMessages.NOT_FOUND })
    async getCategoryByName(@Param('name') name: string) {
        return await this.categoryService.getCategoryByName(name);
    }

    @Get('type/:type')
    @ApiOperation({ summary: 'Get categories by type', description: 'Returns categories by type' })
    @ApiResponse({
        status: 200,
        description: 'Categories returned',
        type: [CategoryResponse],
        isArray: true
    })
    async getCategoriesByType(@Param('type') type: string) {
        return await this.categoryService.getCategoriesByType(type);
    }

    @Put(':categoryId')
    @ApiSecurity('bearer')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles("ADMIN")
    @ApiOperation({ summary: 'Create category', description: 'Returns created category' })
    @ApiResponse({
        status: 201,
        description: CategoryMessages.CREATED,
        type: CategoryResponse
    })
    @ApiResponse({ status: 400, description: CategoryMessages.INVALID_CREDENTIALS })
    @ApiResponse({ status: 401, description: CategoryMessages.UNAUTHORIZED_ACCESS })
    @ApiResponse({ status: 403, description: CategoryMessages.UNAUTHORIZED_ACCESS })
    @ApiResponse({ status: 404, description: CategoryMessages.NOT_FOUND })
    async updateCategory(@Param('categoryId') categoryId: string, @Body() category: UpdateCategoryDto) {
        return await this.categoryService.updateCategory(categoryId, category);
    }

    @Delete(':categoryId')
    @ApiSecurity('bearer')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles("ADMIN")
    @ApiOperation({ summary: 'Delete category', description: 'Returns deleted category' })
    @ApiResponse({
        status: 200,
        description: CategoryMessages.DELETED,
        type: CategoryResponse
    })
    @ApiResponse({ status: 400, description: CategoryMessages.INVALID_CREDENTIALS })
    @ApiResponse({ status: 401, description: CategoryMessages.UNAUTHORIZED_ACCESS })
    @ApiResponse({ status: 403, description: CategoryMessages.UNAUTHORIZED_ACCESS })
    @ApiResponse({ status: 404, description: CategoryMessages.NOT_FOUND })
    async deleteCategory(@Param('categoryId') categoryId: string) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return await this.categoryService.deleteCategory(categoryId);
    }

}
