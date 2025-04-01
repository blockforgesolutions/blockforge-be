import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { CourseResponse } from './model/course.response';
import { CourseMessages } from 'src/common/enums/course-message.enum';
import { UserService } from 'src/user/user.service';

@ApiTags('Course')
@Controller('course')
export class CourseController {
    constructor(
        private readonly courseService: CourseService,
        private readonly userService: UserService
    ) { }

    @Post()
    @ApiSecurity('bearer')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles('INSTRUCTOR', "ADMIN")
    @ApiOperation({ summary: "Create course", description: "Returns the created course" })
    @ApiResponse({
        status: 201,
        description: CourseMessages.CREATED,
        type: CourseResponse
    })
    @ApiResponse({ status: 400, description: CourseMessages.INVALID_CREDENTIALS })
    @ApiResponse({ status: 401, description: CourseMessages.UNAUTHORIZED_ACCESS })
    @ApiResponse({ status: 403, description: CourseMessages.UNAUTHORIZED_ACCESS })
    async createCourse(@Body() course: CreateCourseDto) {
        return await this.courseService.createCourse(course);
    }

    @Get()
    @ApiOperation({ summary: "Get all courses", description: "Returns all courses" })
    @ApiResponse({
        status: 200,
        description: 'The courses have been successfully fetched.',
        type: [CourseResponse]
    })
    async getCourses() {
        return await this.courseService.getCourses();
    }

    @Get(':courseId')
    @ApiOperation({ summary: "Get course by id", description: "Returns course by id" })
    @ApiResponse({
        status: 200,
        description: 'The course has been successfully fetched.',
        type: CourseResponse
    })
    @ApiParam({
        name: 'courseId',
        description: 'The course id',
    })
    @ApiResponse({ status: 404, description: CourseMessages.NOT_FOUND })
    async getCourseById(@Param('courseId') courseId: string) {
        return await this.courseService.getCourseById(courseId);
    }

    @Get('slug/:slug')
    @ApiOperation({ summary: "Get course by slug", description: "Returns course by slug" })
    @ApiResponse({
        status: 200,
        description: 'The course has been successfully fetched.',
        type: CourseResponse
    })
    @ApiParam({
        name: 'slug',
        description: 'The course slug',
    })
    @ApiResponse({ status: 404, description: CourseMessages.NOT_FOUND })
    async getCourseBySlug(@Param('slug') slug: string) {
        return await this.courseService.getCourseBySlug(slug);
    }

    @Get('category/:categoryId')
    @ApiOperation({ summary: "Get courses by category id", description: "Returns courses by category id" })
    @ApiResponse({
        status: 200,
        description: 'The courses have been successfully fetched.',
        type: [CourseResponse]
    })
    async getCoursesByCategoryId(
        @Param('categoryId') categoryId: string,
        @Query('page') page = 1,
        @Query('limit') limit = 10,
    ) {
        return this.courseService.getCoursesByCategoryId(categoryId, Number(page), Number(limit));
    }

    @Put(':courseId')
    @ApiSecurity('bearer')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles('INSTRUCTOR', "ADMIN")
    @ApiOperation({ summary: "Update course", description: "Returns the updated course" })
    @ApiParam({
        name: 'courseId',
        description: 'The course id',
    })
    @ApiBody({
        type: UpdateCourseDto,
        description: 'The data required to update a course.'
    })
    @ApiResponse({
        status: 200,
        description: CourseMessages.UPDATED,
        type: CourseResponse
    })
    @ApiResponse({ status: 400, description: CourseMessages.INVALID_CREDENTIALS })
    @ApiResponse({ status: 401, description: CourseMessages.UNAUTHORIZED_ACCESS })
    @ApiResponse({ status: 403, description: CourseMessages.UNAUTHORIZED_ACCESS })
    @ApiResponse({ status: 404, description: CourseMessages.NOT_FOUND })
    async updateCourse(@Param('courseId') courseId: string, @Body() course: UpdateCourseDto) {
        return await this.courseService.updateCourse(courseId, course);
    }

    @Delete(':courseId')
    @ApiSecurity('bearer')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles("ADMIN")
    @ApiOperation({ summary: "Delete course", description: "Returns the deleted message" })
    @ApiParam({
        name: 'courseId',
        description: 'The course id',
    })
    @ApiResponse({
        status: 204,
        description: CourseMessages.DELETED
    })
    @ApiResponse({ status: 401, description: CourseMessages.UNAUTHORIZED_ACCESS })
    @ApiResponse({ status: 403, description: CourseMessages.UNAUTHORIZED_ACCESS })
    @ApiResponse({ status: 404, description: CourseMessages.NOT_FOUND })
    async deleteCourse(@Param('courseId') courseId: string) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return await this.courseService.deleteCourse(courseId);
    }
}
