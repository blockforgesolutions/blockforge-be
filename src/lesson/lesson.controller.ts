import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { ApiResponseDto } from 'src/common/dto/response.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ApiOperation, ApiParam, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { LessonMessages } from 'src/common/enums/lesson-messages.enum';
import { LessonResponse } from './model/lesson.response';

@ApiTags('Lessons')
@Controller('lesson')
export class LessonController {
    constructor(
        private readonly lessonService: LessonService
    ) { }

    @Post()
    @UseGuards(JwtAuthGuard, RoleGuard)
    @ApiSecurity('bearer')
    @Roles('INSTRUCTOR', "ADMIN")
    @ApiOperation({ summary: 'Create a new lesson', description: 'Returns the created lesson' })
    @ApiResponse({
        status: 201,
        description: LessonMessages.CREATED,
        type: LessonResponse
    })
    @ApiResponse({
        status: 400,
        description: LessonMessages.INVALID_CREDENTIALS
    })
    @ApiResponse({
        status: 401,
        description: LessonMessages.UNAUTHORIZED_ACCESS
    })
    @ApiResponse({
        status: 403,
        description: LessonMessages.UNAUTHORIZED_ACCESS
    })
    async createLesson(@Body() lesson: CreateLessonDto) {
        const newLesson = await this.lessonService.createLesson(lesson);

        return new ApiResponseDto(true, newLesson);
    }

    @Get()
    @ApiOperation({ summary: 'Get all lessons', description: 'Returns all lessons' })
    @ApiResponse({
        status: 200,
        description: "All lessons",
        type: [LessonResponse]
    })
    async getLessons() {
        const lessons = await this.lessonService.getLessons();

        return new ApiResponseDto(true, lessons);
    }

    @Get(':lessonId')
    @ApiOperation({ summary: 'Get a lesson by id', description: 'Returns a lesson' })
    @ApiParam({ name: 'lessonId', type: String, description: 'The id of the lesson' })
    @ApiResponse({
        status: 200,
        description: "Lesson by id",
        type: LessonResponse
    })
    @ApiResponse({
        status: 404,
        description: LessonMessages.NOT_FOUND
    })
    async getLessonById(@Param('lessonId') lessonId: string) {
        const lesson = await this.lessonService.getLessonById(lessonId);
        return new ApiResponseDto(true, lesson);
    }

    @Get('getCourseLessons/:courseId')
    @ApiOperation({ summary: 'Get all lessons by course id', description: 'Returns all lessons by course id' })
    @ApiParam({ name: 'courseId', type: String, description: 'The id of the course' })
    @ApiResponse({
        status: 200,
        description: "All lessons by course id",
        type: [LessonResponse]
    })
    async getLessonsByCourseId(@Param('courseId') courseId: string) {
        const lessons = await this.lessonService.getLessonsByCourseId(courseId);
        return new ApiResponseDto(true, lessons);
    }

    @Put(':lessonId')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @ApiSecurity('bearer')
    @Roles('INSTRUCTOR', "ADMIN")
    @ApiOperation({ summary: 'Update a lesson', description: 'Returns the updated lesson' })
    @ApiParam({ name: 'lessonId', type: String, description: 'The id of the lesson' })
    @ApiResponse({
        status: 200,
        description: LessonMessages.UPDATED,
        type: LessonResponse
    })
    @ApiResponse({
        status: 400,
        description: LessonMessages.INVALID_CREDENTIALS
    })
    @ApiResponse({
        status: 401,
        description: LessonMessages.UNAUTHORIZED_ACCESS
    })
    @ApiResponse({
        status: 403,
        description: LessonMessages.UNAUTHORIZED_ACCESS
    })
    @ApiResponse({
        status: 404,
        description: LessonMessages.NOT_FOUND
    })
    async updateLesson(@Param('lessonId') lessonId: string, @Body() lesson: UpdateLessonDto) {
        const updatedLesson = await this.lessonService.updateLesson(lessonId, lesson);
        return new ApiResponseDto(true, updatedLesson);
    }

    @Delete(':lessonId')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @ApiSecurity('bearer')
    @Roles('INSTRUCTOR', "ADMIN")
    @ApiOperation({ summary: 'Delete a lesson', description: 'Returns the deleted message' })
    @ApiParam({ name: 'lessonId', type: String, description: 'The id of the lesson' })
    @ApiResponse({
        status: 204,
        description: LessonMessages.DELETED
    })
    @ApiResponse({
        status: 401,
        description: LessonMessages.UNAUTHORIZED_ACCESS
    })
    @ApiResponse({
        status: 403,
        description: LessonMessages.UNAUTHORIZED_ACCESS
    })
    @ApiResponse({
        status: 404,
        description: LessonMessages.NOT_FOUND
    })
    async deleteLesson(@Param('lessonId') lessonId: string) {
        const deletedLesson = await this.lessonService.deleteLesson(lessonId);
        return new ApiResponseDto(true, deletedLesson);
    }
}
