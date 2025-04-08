import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { BlogService } from './blog.service';
import { ApiOperation, ApiParam, ApiResponse, ApiSecurity } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { BlogMessages } from 'src/common/enums/blog-message.enum';
import { BlogResponse } from './model/blog.response';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Controller('blog')
export class BlogController {
    constructor(
        private readonly blogService: BlogService
    ) { }

    @Post()
    @ApiSecurity('bearer')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles("ADMIN")
    @ApiOperation({ summary: 'Create blog', description: 'Returns created blog' })
    @ApiResponse({
        status: 201,
        description: BlogMessages.CREATED,
        type: BlogResponse
    })
    @ApiResponse({ status: 400, description: BlogMessages.INVALID_CREDENTIALS })
    @ApiResponse({ status: 401, description: BlogMessages.UNAUTHORIZED_ACCESS })
    @ApiResponse({ status: 403, description: BlogMessages.UNAUTHORIZED_ACCESS })
    @ApiResponse({ status: 409, description: BlogMessages.ALREADY_EXISTS })
    async createBlog(@Body() blog: CreateBlogDto) {
        return await this.blogService.createBlog(blog);
    }

    @Get()
    @ApiOperation({ summary: 'Get all blogs', description: 'Returns all blogs' })
    @ApiResponse({
        status: 200,
        description: "Returns all blogs",
        type: [BlogResponse]
    })
    async getBlogs() {
        return await this.blogService.getBlogs();
    }

    @Get(':blogId')
    @ApiOperation({ summary: 'Get blog by id', description: 'Returns blog by id' })
    @ApiResponse({
        status: 200,
        description: "Returns blog by id",
        type: BlogResponse
    })
    @ApiParam({
        name: 'blogId',
        description: 'The blog id',
    })
    @ApiResponse({ status: 404, description: BlogMessages.NOT_FOUND })
    async getBlogById(@Param('blogId') blogId: string) {
        return await this.blogService.getBlogById(blogId);
    }

    @Get('slug/:slug')
    @ApiOperation({ summary: 'Get blog by slug', description: 'Returns blog by slug' })
    @ApiResponse({
        status: 200,
        description: "Returns blog by slug",
        type: BlogResponse
    })
    @ApiParam({
        name: 'slug',
        description: 'The blog slug',
    })
    @ApiResponse({ status: 404, description: BlogMessages.NOT_FOUND })
    async getBlogBySlug(@Param('slug') slug: string) {
        return await this.blogService.getBlogBySlug(slug);
    }

    @Get('category/:category')
    @ApiOperation({ summary: 'Get blog by category', description: 'Returns blog by category' })
    @ApiResponse({
        status: 200,
        description: "Returns blog by category",
        type: [BlogResponse]
    })
    @ApiParam({
        name: 'category',
        description: 'The blog category',
    })
    @ApiResponse({ status: 404, description: BlogMessages.NOT_FOUND })
    async getBlogByCategory(@Param('category') category: string) {
        return await this.blogService.getBlogByCategory(category);
    }

    @Put(':blogId')
    @ApiSecurity('bearer')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles("ADMIN")
    @ApiOperation({ summary: "Update blog", description: "Returns the updated blog" })
    @ApiParam({
        name: 'blogId',
        description: 'The blog id',
    })
    @ApiResponse({
        status: 200,
        description: BlogMessages.UPDATED,
        type: BlogResponse
    })
    @ApiResponse({ status: 400, description: BlogMessages.INVALID_CREDENTIALS })
    @ApiResponse({ status: 401, description: BlogMessages.UNAUTHORIZED_ACCESS })
    @ApiResponse({ status: 403, description: BlogMessages.UNAUTHORIZED_ACCESS })
    @ApiResponse({ status: 404, description: BlogMessages.NOT_FOUND })
    async updateCourse(@Param('blogId') blogId: string, @Body() blog: UpdateBlogDto) {
        return await this.blogService.updateBlog(blogId, blog)
    }

    @Delete(':blogId')
    @ApiSecurity('bearer')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles("ADMIN")
    @ApiOperation({ summary: "Delete blog", description: "Returns the deleted message" })
    @ApiParam({
        name: 'blogId',
        description: 'The blog id',
    })
    @ApiResponse({
        status: 204,
        description: BlogMessages.DELETED
    })
    @ApiResponse({ status: 401, description: BlogMessages.UNAUTHORIZED_ACCESS })
    @ApiResponse({ status: 403, description: BlogMessages.UNAUTHORIZED_ACCESS })
    @ApiResponse({ status: 404, description: BlogMessages.NOT_FOUND })
    async deleteBlog(@Param('blogId') blogId: string) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return await this.blogService.deleteBlog(blogId);
    }
}
