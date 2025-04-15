import { Module } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { LessonController } from './lesson.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { LessonModel, LessonSchema } from './model/lesson.model';
import { UserModule } from 'src/user/user.module';
import { RoleGuard } from 'src/common/guards/role.guard';
import { ModuleModule } from 'src/module/module.module';
import { CourseModule } from 'src/course/course.module';

@Module({
  imports: [
    UserModule,
    ModuleModule,
    CourseModule,
    MongooseModule.forFeature([{ name: LessonModel.name, schema: LessonSchema }])
  ],
  providers: [LessonService, RoleGuard],
  controllers: [LessonController],
  exports:[LessonService]
})
export class LessonModule { }
