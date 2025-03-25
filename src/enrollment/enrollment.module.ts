import { Module } from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import { EnrollmentController } from './enrollment.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { EnrollmentModel, EnrollmentSchema } from './model/enrollment.model';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([{ name: EnrollmentModel.name, schema: EnrollmentSchema }])
  ],
  providers: [EnrollmentService],
  controllers: [EnrollmentController]
})
export class EnrollmentModule { }
