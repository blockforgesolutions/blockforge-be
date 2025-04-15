import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { EnrollmentModel, EnrollmentSchema } from 'src/enrollment/model/enrollment.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: EnrollmentModel.name, schema: EnrollmentSchema }]),
  ],
  providers: [PaymentService],
  controllers: [PaymentController],
  exports: [PaymentService],
})
export class PaymentModule {}
