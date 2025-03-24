import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EnrollmentModel } from './model/enrollment.model';
import { Model } from 'mongoose';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { EnrollmentResponse } from './model/enrollment.response';
import { transformMongoData } from 'src/common/utils/transform.utils';
import { transformMongoArray } from 'src/common/utils/mongo.utils';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';

@Injectable()
export class EnrollmentService {
    constructor(
        @InjectModel(EnrollmentModel.name) private readonly enrollmentModel: Model<EnrollmentModel>,
    ) { }

    async createEnrollment(enrollment: CreateEnrollmentDto): Promise<EnrollmentResponse> {
        const newEnrollment = await this.enrollmentModel.create(enrollment);

        const translatedEnrollment = transformMongoData(newEnrollment.toObject(), EnrollmentResponse);

        return translatedEnrollment
    }

    async getEnrollments(): Promise<EnrollmentResponse[]> {
        const enrollments = await this.enrollmentModel.find().lean();

        const transformedEnrollments = transformMongoArray(enrollments);

        return transformedEnrollments
    }

    async getUserEnrollments(userId: string): Promise<EnrollmentResponse[]> {
        const enrollments = await this.enrollmentModel.find({ userId })
            .populate('courseId', 'title description image')
            .lean();

        const transformedEnrollments = transformMongoArray(enrollments);

        return transformedEnrollments
    }

    async getEnrollmentById(enrollmentId: string): Promise<EnrollmentResponse> {
        const enrollment = await this.enrollmentModel.findById(enrollmentId).lean();

        if (!enrollment) {
            throw new HttpException(new ErrorResponseDto('Enrollment not found'), HttpStatus.NOT_FOUND);
        }

        const transformedEnrollment = transformMongoData(enrollment, EnrollmentResponse);

        return transformedEnrollment
    }

    async updateEnrollment(enrollmentId: string, enrollment: UpdateEnrollmentDto): Promise<EnrollmentResponse> {
        const updatedEnrollment = await this.enrollmentModel.findByIdAndUpdate(enrollmentId, enrollment, { new: true }).lean();

        if (!updatedEnrollment) {
            throw new HttpException(new ErrorResponseDto('Enrollment not found'), HttpStatus.NOT_FOUND);
        }

        const transformedEnrollment = transformMongoData(updatedEnrollment, EnrollmentResponse);

        return transformedEnrollment
    }

    async deleteEnrollment(enrollmentId: string): Promise<any> {
        const deletedEnrollment = await this.enrollmentModel.findByIdAndDelete(enrollmentId).exec();

        if (!deletedEnrollment) {
            throw new HttpException(new ErrorResponseDto('Enrollment not found'), HttpStatus.NOT_FOUND);
        }

        return { message: "Enrollment successfully deleted!" };

    }
}
