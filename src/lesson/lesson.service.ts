import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { LessonModel } from './model/lesson.model';
import { Model } from 'mongoose';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { LessonResponse } from './model/lesson.response';
import { transformMongoArray } from 'src/common/utils/mongo.utils';
import { transformMongoData } from 'src/common/utils/transform.utils';

@Injectable()
export class LessonService {
    constructor(
        @InjectModel(LessonModel.name) private lessonModel: Model<LessonModel>
    ) { }

    async createLesson(lesson: CreateLessonDto): Promise<LessonResponse> {
        const newLesson = await this.lessonModel.create(lesson);

        const transformedLesson = transformMongoData(newLesson.toObject(), LessonResponse);

        return transformedLesson
    }

    async getLessons(): Promise<LessonResponse[]> {
        const transformedLessons = transformMongoArray(await this.lessonModel.find().lean());
        if (!transformedLessons) {
            throw new HttpException(new ErrorResponseDto('Failed to transform course document'), HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return transformedLessons
    }

    async getLessonById(lessonId: string): Promise<LessonResponse> {
        const lesson = await this.lessonModel.findById(lessonId).lean();

        if (!lesson) {
            throw new HttpException(new ErrorResponseDto('Lesson not found'), HttpStatus.NOT_FOUND);
        }

        const transformedLesson = transformMongoData(lesson, LessonResponse);

        return transformedLesson
    }

    async getLessonsByCourseId(courseId: string): Promise<LessonResponse[]> {
        const lessons = await this.lessonModel.find({ course: courseId }).lean();

        const transformedLessons = transformMongoArray(lessons);
        if (!transformedLessons) {
            throw new HttpException(new ErrorResponseDto('Failed to transform course document'), HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return transformedLessons
    }

    async getLessonCountByCourseId(courseId: string): Promise<number> {
        const count = await this.lessonModel.countDocuments({ course: courseId }).exec();

        return count;
    }

    async updateLesson(lessonId: string, lesson: UpdateLessonDto): Promise<LessonResponse> {
        const updatedLesson = await this.lessonModel.findByIdAndUpdate(lessonId, lesson, { new: true }).exec();

        if (!updatedLesson) {
            throw new HttpException(new ErrorResponseDto('Lesson not found'), HttpStatus.NOT_FOUND);
        }

        const transformedLesson = transformMongoData(updatedLesson, LessonResponse);

        return transformedLesson
    }

    async deleteLesson(lessonId: string) {
        const deletedLesson = await this.lessonModel.findByIdAndDelete(lessonId).exec();

        if (!deletedLesson) {
            throw new HttpException(new ErrorResponseDto('Lesson not found'), HttpStatus.NOT_FOUND);
        }

        return { message: "Lesson successfully deleted!" };
    }
}
