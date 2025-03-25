import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ProgressModel } from './model/progress.model';
import { Model, Types } from 'mongoose';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { CreateProgressDto } from './dto/create-progress.dto';
import { LessonService } from 'src/lesson/lesson.service';
import { ProgressResponse } from './model/progress.response';
import { transformMongoData } from 'src/common/utils/transform.utils';

@Injectable()
export class ProgressService {
    constructor(
        @InjectModel(ProgressModel.name) private progressModel: Model<ProgressModel>,
        private readonly lessonService: LessonService
    ) { }

    async createProgress(progress: CreateProgressDto): Promise<ProgressResponse> {
        if (!progress.completedLessons) {
            progress.completedLessons = [];
        }

        const newProgress = (await this.progressModel.create(progress));

        const transformedProgress = transformMongoData(newProgress.toObject(), ProgressResponse);

        return transformedProgress;
    }

    async getProgress(userId: string, courseId: string): Promise<ProgressResponse> {
        const progress = await this.progressModel.findOne({ userId, courseId }).lean();

        if (!progress) {
            throw new HttpException(new ErrorResponseDto('Progress not found'), HttpStatus.NOT_FOUND);
        }

        const transformedProgress = transformMongoData(progress, ProgressResponse);

        return transformedProgress;
    }

    async updateProgress(userId: string, courseId: string, progress: UpdateProgressDto): Promise<ProgressResponse> {
        const updatedProgress = await this.progressModel.findOneAndUpdate({ userId, courseId }, progress, { new: true }).exec();

        if (!updatedProgress) {
            throw new HttpException(new ErrorResponseDto('Progress not found'), HttpStatus.NOT_FOUND);
        }

        const transformedProgress = transformMongoData(updatedProgress, ProgressResponse);

        return transformedProgress;
    }

    async addLesson(userId: string, courseId: string, lessonId: string):Promise<ProgressResponse> {
        const progress = await this.progressModel.findOne({ userId, courseId }).exec();

        if (!progress) {
            throw new HttpException(new ErrorResponseDto('Progress not found'), HttpStatus.NOT_FOUND);
        }

        if (progress.completedLessons.includes(new Types.ObjectId(lessonId))) {
            throw new HttpException(new ErrorResponseDto('Lesson already completed'), HttpStatus.BAD_REQUEST);
        }

        progress.completedLessons.push(new Types.ObjectId(lessonId));
        progress.progressPercentage = await this.calculatePercentage(progress.completedLessons.length, courseId);
        await progress.save();

        const transformedProgress = transformMongoData(progress.toObject(), ProgressResponse);

        return transformedProgress;
    }


    async removeLesson(userId: string, courseId: string, lessonId: string): Promise<ProgressResponse> {
        const progress = await this.progressModel.findOne({ userId, courseId }).exec();

        if (!progress) {
            throw new HttpException(new ErrorResponseDto('Progress not found'), HttpStatus.NOT_FOUND);
        }

        const lessonIndex = progress.completedLessons.indexOf(new Types.ObjectId(lessonId));
        if (lessonIndex === -1) {
            throw new HttpException(new ErrorResponseDto('Lesson not found in completed lessons'), HttpStatus.BAD_REQUEST);
        }

        progress.completedLessons.splice(lessonIndex, 1);
        progress.progressPercentage = await this.calculatePercentage(progress.completedLessons.length, courseId);
        await progress.save();

        const transformedProgress = transformMongoData(progress.toObject(), ProgressResponse);

        return transformedProgress;
    }

    async deleteProgress(userId: string, courseId: string) {
        const progress = await this.progressModel.findOneAndDelete({ userId, courseId }).exec();

        if (!progress) {
            throw new HttpException(new ErrorResponseDto('Progress not found'), HttpStatus.NOT_FOUND);
        }

        return { message: "Progress successfully deleted!" };
    }

    private async calculatePercentage(completedLessons: number, courseId: string) {

        const totalLessons = await this.lessonService.getLessonCountByCourseId(courseId);
        // console.log(totalLessons);

        if (totalLessons === 0) {
            return 0;
        }

        return (completedLessons / totalLessons) * 100;
    }

}
