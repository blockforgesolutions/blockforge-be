import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CourseModule } from './course/course.module';
import { LessonModule } from './lesson/lesson.module';
import { ProgressModule } from './progress/progress.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { RolesModule } from './roles/roles.module';
import { MailModule } from './mail/mail.module';
import { CertificateModule } from './certificate/certificate.module';
import { ModuleModule } from './module/module.module';
import { EnrollmentModule } from './enrollment/enrollment.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env`,
      isGlobal: true
    }),
    MongooseModule.forRoot(process.env.MONGO_URL!, {
      dbName: 'dashboard'
    }),
    AuthModule,
    UserModule,
    RolesModule,
    MailModule,
    CourseModule,
    LessonModule,
    ProgressModule,
    CertificateModule,
    ModuleModule,
    EnrollmentModule,
    PaymentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
