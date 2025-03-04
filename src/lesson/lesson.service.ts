import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { LessonModel } from './model/lesson.model';
import { Model } from 'mongoose';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

@Injectable()
export class LessonService {
    constructor(
        @InjectModel(LessonModel.name) private lessonModel: Model<LessonModel>
    ) { }

    async createLesson(lesson: CreateLessonDto): Promise<LessonModel> {
        const newLesson = new this.lessonModel(lesson).save();

        return newLesson
    }

    async getLessons(): Promise<LessonModel[]> {
        return this.lessonModel.find().exec();
    }

    async getLessonById(lessonId: string): Promise<LessonModel> {
        const lesson = await this.lessonModel.findById(lessonId).exec();

        if (!lesson) {
            throw new HttpException(new ErrorResponseDto('Lesson not found'), HttpStatus.NOT_FOUND);
        }
        return lesson;
    }

    async getLessonsByCourseId(courseId: string): Promise<LessonModel[]> {
        const lessons = await this.lessonModel.find({ course: courseId }).exec();

        return lessons;
    }

    async updateLesson(lessonId: string, lesson: UpdateLessonDto): Promise<LessonModel> {
        const updatedLesson = await this.lessonModel.findByIdAndUpdate(lessonId, lesson, { new: true }).exec();

        if (!updatedLesson) {
            throw new HttpException(new ErrorResponseDto('Lesson not found'), HttpStatus.NOT_FOUND);
        }
        return updatedLesson;
    }

    async deleteLesson(lessonId: string) {
        const deletedLesson = await this.lessonModel.findByIdAndDelete(lessonId).exec();

        if (!deletedLesson) {
            throw new HttpException(new ErrorResponseDto('Lesson not found'), HttpStatus.NOT_FOUND);
        }

        return { message: "Lesson successfully deleted!" };
    }
}
