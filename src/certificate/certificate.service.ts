import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CertificateModel } from './model/certificate.model';
import { Model } from 'mongoose';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { CertificateResponse } from './model/certificate.response';
import { transformMongoData } from 'src/common/utils/transform.utils';
import { transformMongoArray } from 'src/common/utils/mongo.utils';
import { UpdateCertificateDto } from './dto/update-certificate.dto';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';

@Injectable()
export class CertificateService {
    constructor(
        @InjectModel(CertificateModel.name) private certificateModel: Model<CertificateModel>,
    ) { }

    async createCertificate(createCertificateDto: CreateCertificateDto): Promise<CertificateResponse> {
        const certificate = await this.certificateModel.findOne({ userId: createCertificateDto.userId, courseId: createCertificateDto.courseId });

        if (certificate) {
            throw new HttpException(new ErrorResponseDto('Certificate already exists for this user'), HttpStatus.CONFLICT);
        }

        const newCertificate = await this.certificateModel.create(createCertificateDto);

        const transformedCertificate = transformMongoData(newCertificate.toObject(), CertificateResponse);

        return transformedCertificate;
    }

    async getUserCertificates(userId: string): Promise<CertificateResponse[]> {
        const certificates = await this.certificateModel.find({ userId });

        const transformedCertificates = transformMongoArray(certificates);

        return transformedCertificates;
    }

    async getCertificateById(certificateId: string): Promise<CertificateResponse> {
        const certificate = await this.certificateModel.findById(certificateId);

        if (!certificate) {
            throw new HttpException(new ErrorResponseDto('Certificate not found'), HttpStatus.NOT_FOUND);
        }

        const transformedCertificate = transformMongoData(certificate, CertificateResponse);

        return transformedCertificate;
    }

    async updateCertificate(certificateId: string, updateCertificateDto: UpdateCertificateDto): Promise<CertificateResponse> {
        const updatedCertificate = await this.certificateModel.findByIdAndUpdate(certificateId, updateCertificateDto, { new: true }).lean();

        if (!updatedCertificate) {
            throw new HttpException(new ErrorResponseDto('Certificate not found'), HttpStatus.NOT_FOUND);
        }

        const transformedCertificate = transformMongoData(updatedCertificate, CertificateResponse);

        return transformedCertificate;
    }

    async deleteCertificate(certificateId: string): Promise<any> {
        const deletedCertificate = await this.certificateModel.findByIdAndDelete(certificateId).exec();

        if (!deletedCertificate) {
            throw new HttpException(new ErrorResponseDto('Certificate not found'), HttpStatus.NOT_FOUND);
        }

        return { message: "Certificate successfully deleted!" };
    }
}
