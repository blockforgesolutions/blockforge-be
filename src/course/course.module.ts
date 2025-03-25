import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CourseModel, CourseSchema } from './model/course.model';
import { UserModule } from 'src/user/user.module';
import { RoleGuard } from 'src/common/guards/role.guard';

@Module({
  imports:[
    UserModule,
    MongooseModule.forFeature([{name: CourseModel.name, schema: CourseSchema}])
  ],
  providers: [CourseService, RoleGuard],
  controllers: [CourseController]
})
export class CourseModule {}
