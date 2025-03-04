import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CourseModel } from './model/course.model';
import { Model } from 'mongoose';
import { CreateCourseDto } from './dto/create-course.dto';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CourseService {
    constructor(
        @InjectModel(CourseModel.name) private courseModel: Model<CourseModel>
    ) { }

    async createCourse(course: CreateCourseDto): Promise<CourseModel> {
        const newCourse = new this.courseModel(course).save();
        return newCourse;
    }

    async getCourses(): Promise<CourseModel[]> {
        return this.courseModel.find().exec();
    }

    async getCourseById(courseId: string): Promise<CourseModel> {
        const course = await this.courseModel.findById(courseId).exec();

        if (!course) {
            throw new HttpException(new ErrorResponseDto('Course not found'), HttpStatus.NOT_FOUND);
        }
        return course;
    }

    async updateCourse(courseId: string, course: UpdateCourseDto): Promise<CourseModel> {
        const updatedCourse = await this.courseModel.findByIdAndUpdate(courseId, course, { new: true }).exec();

        if (!updatedCourse) {
            throw new HttpException(new ErrorResponseDto('Course not found'), HttpStatus.NOT_FOUND);
        }
        return updatedCourse;
    }

    async deleteCourse(courseId: string) {
        const deletedCourse = await this.courseModel.findByIdAndDelete(courseId).exec();

        if (!deletedCourse) {
            throw new HttpException(new ErrorResponseDto('Course not found'), HttpStatus.NOT_FOUND);
        }

        return { message: "Course successfully deleted!" };
    }
}
