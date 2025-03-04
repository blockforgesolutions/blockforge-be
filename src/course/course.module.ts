import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CourseModel, CourseSchema } from './model/course.model';

@Module({
  imports:[
    MongooseModule.forFeature([{name: CourseModel.name, schema: CourseSchema}])
  ],
  providers: [CourseService],
  controllers: [CourseController]
})
export class CourseModule {}
