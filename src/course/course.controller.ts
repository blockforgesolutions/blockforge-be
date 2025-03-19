import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { ApiResponseDto } from 'src/common/dto/response.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { CourseResponse } from './model/course.response';
import { CourseMessages } from 'src/common/enums/course-message.enum';

@ApiTags('Course')
@Controller('course')
export class CourseController {
    constructor(
        private readonly courseService: CourseService
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
        const newCourse = await this.courseService.createCourse(course);
        return new ApiResponseDto(true, newCourse);
    }

    @Get()
    @ApiOperation({ summary: "Get all courses", description: "Returns all courses" })
    @ApiResponse({
        status: 200,
        description: 'The courses have been successfully fetched.',
        type: [CourseResponse]
    })
    async getCourses() {
        const courses = await this.courseService.getCourses();
        return new ApiResponseDto(true, courses);
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
        const course = await this.courseService.getCourseById(courseId);
        return new ApiResponseDto(true, course);
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
    async updateCourse(@Param('courseId') courseId: string, @Body() course: UpdateCourseDto) {
        const updatedCourse = await this.courseService.updateCourse(courseId, course);
        return new ApiResponseDto(true, updatedCourse);
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
        const deletedCourse = await this.courseService.deleteCourse(courseId);
        return new ApiResponseDto(true, deletedCourse);
    }
}
