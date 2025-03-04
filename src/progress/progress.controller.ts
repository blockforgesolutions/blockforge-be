import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { CreateProgressDto } from './dto/create-progress.dto';
import { ApiResponseDto } from 'src/common/dto/response.dto';
import { UpdateProgressDto } from './dto/update-progress.dto';

@Controller('progress')
export class ProgressController {
    constructor(
       private readonly progressService: ProgressService 
    ) {}

    @Post()
    async createProgress(@Body() progress: CreateProgressDto) {
        const newProgress = await this.progressService.createProgress(progress);

        return new ApiResponseDto(true, newProgress);
    }

    @Get(':userId/:courseId')
    async getProgress(@Param('userId') userId: string, @Param('courseId') courseId: string) {
        const progress = await this.progressService.getProgress(userId, courseId);
        return new ApiResponseDto(true, progress);
    }

    @Put(':userId/:courseId')
    async updateProgress(@Param('userId') userId: string, @Param('courseId') courseId: string, @Body() progress: UpdateProgressDto) {
        const updatedProgress = await this.progressService.updateProgress(userId, courseId, progress);
        return new ApiResponseDto(true, updatedProgress);
    }

    @Post('addLesson/:userId/:courseId/:lessonId')
    async addLesson(@Param('userId') userId: string, @Param('courseId') courseId: string, @Param('lessonId') lessonId: string) {
        const progress = await this.progressService.addLesson(userId, courseId, lessonId);
        return new ApiResponseDto(true, progress);
    }

    @Patch('removeLesson/:userId/:courseId/:lessonId')
    async removeLesson(@Param('userId') userId: string, @Param('courseId') courseId: string, @Param('lessonId') lessonId: string) {
        const progress = await this.progressService.removeLesson(userId, courseId, lessonId);
        return new ApiResponseDto(true, progress);
    }

    @Delete(':userId/:courseId')
    async deleteProgress(@Param('userId') userId: string, @Param('courseId') courseId: string) {
        const progress = await this.progressService.deleteProgress(userId, courseId);
        return new ApiResponseDto(true, progress);
    }
}
