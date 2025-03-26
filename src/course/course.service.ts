import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CourseModel } from './model/course.model';
import { Model } from 'mongoose';
import { CreateCourseDto } from './dto/create-course.dto';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { transformMongoArray } from 'src/common/utils/mongo.utils';
import { CourseResponse } from './model/course.response';
import { transformMongoData } from 'src/common/utils/transform.utils';

@Injectable()
export class CourseService {
    constructor(
        @InjectModel(CourseModel.name) private courseModel: Model<CourseModel>
    ) { }

    async createCourse(course: CreateCourseDto): Promise<CourseResponse> {
        const newCourse = await this.courseModel.create(course);

        const transformedCourse = transformMongoData(newCourse.toObject(), CourseResponse);

        return transformedCourse;
    }

    async getCourses(): Promise<CourseResponse[]> {
        const courses = await this.courseModel.find().populate('instructor', '_id name surname picture').lean();
        const transformedCourses = transformMongoArray(courses);
        if (!transformedCourses) {
            throw new HttpException(new ErrorResponseDto('Failed to transform course document'), HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return transformedCourses;
    }

    async getCourseById(courseId: string): Promise<CourseResponse> {
        const course = await this.courseModel.findById(courseId).populate('instructor', 'id name surname').lean();

        if (!course) {
            throw new HttpException(new ErrorResponseDto('Course not found'), HttpStatus.NOT_FOUND);
        }

        const transformedCourse = transformMongoData(course, CourseResponse);

        return transformedCourse;
    }

    async getCourseBySlug(slug:string): Promise<CourseResponse> {
        
        const course = await this.courseModel.findOne({slug}).populate('instructor', 'id name surname').lean();

        if (!course) {
            throw new HttpException(new ErrorResponseDto('Course not found'), HttpStatus.NOT_FOUND);
        }

        const transformedCourse = transformMongoData(course, CourseResponse);

        return transformedCourse;
    }

    async updateCourse(courseId: string, course: UpdateCourseDto): Promise<CourseResponse> {
        const updatedCourse = await this.courseModel.findByIdAndUpdate(courseId, course, { new: true }).populate('instructor', 'id name surname').lean();

        if (!updatedCourse) {
            throw new HttpException(new ErrorResponseDto('Course not found'), HttpStatus.NOT_FOUND);
        }

        const transformedCourse = transformMongoData(updatedCourse, CourseResponse);
        return transformedCourse;
    }

    async deleteCourse(courseId: string): Promise<any> {
        const deletedCourse = await this.courseModel.findByIdAndDelete(courseId).exec();

        if (!deletedCourse) {
            throw new HttpException(new ErrorResponseDto('Course not found'), HttpStatus.NOT_FOUND);
        }

        return { message: "Course successfully deleted!" };
    }

}
