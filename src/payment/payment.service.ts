import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EnrollmentStatus } from 'src/enrollment/interface/enrollment.interface';
import { EnrollmentModel } from 'src/enrollment/model/enrollment.model';

@Injectable()
export class PaymentService {
    constructor(
        @InjectModel(EnrollmentModel.name) private enrollmentModel: Model<EnrollmentModel>,
    ) {}

    // eslint-disable-next-line @typescript-eslint/require-await
    async createPaymentSession(enrollmentId: string): Promise<string> {
        // const enrollment = await this.enrollmentModel.findById(enrollmentId).lean();
        // console.log(enrollment);
        
        // if (!enrollment) {
        //     throw new BadRequestException('Kayıt bulunamadı');
        // }

        // payment service configurations

        // notification to user

        return `mock_session_${Math.random().toString(36).substring(7)}`;
    }

    async handleWebhook(enrollmentId: string): Promise<void> {
        const mockTransactionId = 'mock_transaction_id';
        await this.enrollmentModel.findByIdAndUpdate(
            enrollmentId,
            {
                paymentStatus: EnrollmentStatus.APPROVED,
                transaction: mockTransactionId,
            },
            { new: true },
        );
    }
}
