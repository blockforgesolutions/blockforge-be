import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CourseDocument, CourseModel } from './model/course.model';
import { Model } from 'mongoose';
import { CreateCourseDto } from './dto/create-course.dto';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { transformMongoArray, transformMongoDocument } from 'src/common/utils/mongo.utils';
import { CourseResponse } from './model/course.response';
import { transformMongoData } from 'src/common/utils/transform.utils';

@Injectable()
export class CourseService {
    constructor(
        @InjectModel(CourseModel.name) private courseModel: Model<CourseModel>
    ) { }

    async createCourse(course: CreateCourseDto): Promise<CourseResponse> {
        const newCourse = new this.courseModel(course);

        await newCourse.save();

        const populatedCourse = await newCourse.populate([
            { path: 'instructor', select: 'id name surname picture' },
            { path: 'categories', select: 'id name type' }
        ]);

        if (!populatedCourse) {
            throw new Error('Course creation failed');
        }

        const transformedCourse = transformMongoDocument<CourseDocument, CourseResponse>(populatedCourse.toObject());


        if (!transformedCourse) {
            throw new Error('Course creation failed');
        }

        return transformedCourse;
    }

    async getCourses(): Promise<CourseResponse[]> {
        const courses = await this.courseModel.find().populate('instructor', 'id name surname picture')
            .populate('categories', 'id name type slug')
            .lean();

        return transformMongoArray<CourseDocument, CourseResponse>(courses);
    }

    async getCourseById(courseId: string): Promise<CourseResponse> {
        const course = await this.courseModel.findById(courseId).populate('instructor', 'id name surname picture')
            .populate('categories', 'id name type slug')
            .lean();

        if (!course) {
            throw new HttpException(new ErrorResponseDto('Course not found'), HttpStatus.NOT_FOUND);
        }

        const transformedCourse = transformMongoData(course, CourseResponse);

        return transformedCourse;
    }

    async getCourseBySlug(slug: string): Promise<CourseResponse> {

        const course = await this.courseModel.findOne({ slug }).populate('instructor', 'id name surname picture')
            .populate('categories', 'id name type slug')
            .lean();

        if (!course) {
            throw new HttpException(new ErrorResponseDto('Course not found'), HttpStatus.NOT_FOUND);
        }

        const transformedCourse = transformMongoData(course, CourseResponse);

        return transformedCourse;
    }

    async getCoursesByCategoryId(categoryId: string, page: number, limit: number): Promise<CourseResponse[]> {

        const courses = await this.courseModel
            .find({ categories: { $in: [categoryId] } })
            .skip((page - 1) * limit)
            .limit(limit)
            .populate('instructor', 'id name surname picture')
            .populate('categories', 'id name type slug')
            .lean();

        return transformMongoArray<CourseDocument, CourseResponse>(courses);
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
