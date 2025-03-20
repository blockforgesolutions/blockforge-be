import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { CreateProgressDto } from './dto/create-progress.dto';
import { ApiResponseDto } from 'src/common/dto/response.dto';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ProgressMessages } from 'src/common/enums/progress-message.enum';
import { ProgressResponse } from './model/progress.response';

@ApiTags('Progress')
@Controller('progress')
@ApiSecurity('bearer')
@UseGuards(JwtAuthGuard)
export class ProgressController {
    constructor(
        private readonly progressService: ProgressService
    ) { }

    @Post()
    @ApiOperation({ summary: 'Create a new progress', description: 'Returns the created progress' })
    @ApiResponse({
        status: 201,
        description: ProgressMessages.CREATED,
        type: ProgressResponse
    })
    @ApiResponse({ status: 400, description: ProgressMessages.INVALID_CREDENTIALS })
    @ApiResponse({ status: 401, description: ProgressMessages.UNAUTHORIZED_ACCESS })
    @ApiResponse({ status: 403, description: ProgressMessages.UNAUTHORIZED_ACCESS })
    async createProgress(@Body() progress: CreateProgressDto) {
        const newProgress = await this.progressService.createProgress(progress);

        return new ApiResponseDto(true, newProgress);
    }

    @Get(':userId/:courseId')
    @ApiOperation({ summary: 'Get progress by user id and course id', description: 'Returns the course progress' })
    @ApiParam({ name: 'userId', description: 'User id' })
    @ApiParam({ name: 'courseId', description: 'Course id' })
    @ApiResponse({
        status: 200,
        description: "Returns the course progress",
        type: ProgressResponse
    })
    @ApiResponse({ status: 404, description: ProgressMessages.NOT_FOUND })

    async getProgress(@Param('userId') userId: string, @Param('courseId') courseId: string) {
        const progress = await this.progressService.getProgress(userId, courseId);
        return new ApiResponseDto(true, progress);
    }

    @Put(':userId/:courseId')
    @ApiOperation({ summary: 'Update progress by user id and course id', description: 'Returns the updated progress' })
    @ApiParam({ name: 'userId', description: 'User id' })
    @ApiParam({ name: 'courseId', description: 'Course id' })
    @ApiResponse({
        status: 200,
        description: ProgressMessages.UPDATED,
        type: ProgressResponse
    })
    @ApiResponse({ status: 400, description: ProgressMessages.INVALID_CREDENTIALS })
    @ApiResponse({ status: 401, description: ProgressMessages.UNAUTHORIZED_ACCESS })
    @ApiResponse({ status: 403, description: ProgressMessages.UNAUTHORIZED_ACCESS })
    @ApiResponse({ status: 404, description: ProgressMessages.NOT_FOUND })
    async updateProgress(@Param('userId') userId: string, @Param('courseId') courseId: string, @Body() progress: UpdateProgressDto) {
        const updatedProgress = await this.progressService.updateProgress(userId, courseId, progress);
        return new ApiResponseDto(true, updatedProgress);
    }

    @Post('addLesson/:userId/:courseId/:lessonId')
    @ApiOperation({ summary: 'Add lesson to progress', description: 'Returns the updated progress' })
    @ApiParam({ name: 'userId', description: 'User id' })
    @ApiParam({ name: 'courseId', description: 'Course id' })
    @ApiParam({ name: 'lessonId', description: 'Lesson id' })
    @ApiResponse({
        status: 200,
        description: ProgressMessages.UPDATED,
        type: ProgressResponse
    })
    @ApiResponse({ status: 400, description: ProgressMessages.INVALID_CREDENTIALS })
    @ApiResponse({ status: 401, description: ProgressMessages.UNAUTHORIZED_ACCESS })
    @ApiResponse({ status: 403, description: ProgressMessages.UNAUTHORIZED_ACCESS })
    @ApiResponse({ status: 404, description: ProgressMessages.NOT_FOUND })
    async addLesson(@Param('userId') userId: string, @Param('courseId') courseId: string, @Param('lessonId') lessonId: string) {
        const progress = await this.progressService.addLesson(userId, courseId, lessonId);
        return new ApiResponseDto(true, progress);
    }

    @Patch('removeLesson/:userId/:courseId/:lessonId')
    @ApiOperation({ summary: 'Remove lesson to progress', description: 'Returns the updated progress' })
    @ApiParam({ name: 'userId', description: 'User id' })
    @ApiParam({ name: 'courseId', description: 'Course id' })
    @ApiParam({ name: 'lessonId', description: 'Lesson id' })
    @ApiResponse({
        status: 200,
        description: ProgressMessages.UPDATED,
        type: ProgressResponse
    })
    @ApiResponse({ status: 400, description: ProgressMessages.INVALID_CREDENTIALS })
    @ApiResponse({ status: 401, description: ProgressMessages.UNAUTHORIZED_ACCESS })
    @ApiResponse({ status: 403, description: ProgressMessages.UNAUTHORIZED_ACCESS })
    @ApiResponse({ status: 404, description: ProgressMessages.NOT_FOUND })
    async removeLesson(@Param('userId') userId: string, @Param('courseId') courseId: string, @Param('lessonId') lessonId: string) {
        const progress = await this.progressService.removeLesson(userId, courseId, lessonId);
        return new ApiResponseDto(true, progress);
    }

    @Delete(':userId/:courseId')
    @ApiOperation({ summary: 'Delete progress by user id and course id', description: 'Returns the deleted message' })
    @ApiResponse({
        status: 204,
        description: ProgressMessages.DELETED
    })
    @ApiResponse({ status: 401, description: ProgressMessages.UNAUTHORIZED_ACCESS })
    @ApiResponse({ status: 403, description: ProgressMessages.UNAUTHORIZED_ACCESS })
    @ApiResponse({ status: 404, description: ProgressMessages.NOT_FOUND })
    async deleteProgress(@Param('userId') userId: string, @Param('courseId') courseId: string) {
        const progress = await this.progressService.deleteProgress(userId, courseId);
        return new ApiResponseDto(true, progress);
    }
}
