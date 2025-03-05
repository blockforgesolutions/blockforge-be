import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { ApiResponseDto } from 'src/common/dto/response.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

@Controller('lesson')
export class LessonController {
    constructor(
        private readonly lessonService: LessonService
    ) {}

    @Post()
    async createLesson(@Body() lesson: CreateLessonDto) {
        const newLesson = await this.lessonService.createLesson(lesson);

        return new ApiResponseDto(true,newLesson);
    }

    @Get()
    async getLessons() {
        const lessons = await this.lessonService.getLessons();

        return new ApiResponseDto(true,lessons);
    }

    @Get(':lessonId')
    async getLessonById(@Param('lessonId') lessonId: string) {
        const lesson = await this.lessonService.getLessonById(lessonId);
        return new ApiResponseDto(true,lesson);
    }

    @Get('getCourseLessons/:courseId')
    async getLessonsByCourseId(@Param('courseId') courseId: string) {
        const lessons = await this.lessonService.getLessonsByCourseId(courseId);
        return new ApiResponseDto(true,lessons);
    }

    @Put(':lessonId')
    async updateLesson(@Param('lessonId') lessonId: string, @Body() lesson: UpdateLessonDto) {
        const updatedLesson = await this.lessonService.updateLesson(lessonId, lesson);
        return new ApiResponseDto(true,updatedLesson);
    }

    @Delete(':lessonId')
    async deleteLesson(@Param('lessonId') lessonId: string) {
        const deletedLesson = await this.lessonService.deleteLesson(lessonId);
        return new ApiResponseDto(true,deletedLesson);
    }
}
