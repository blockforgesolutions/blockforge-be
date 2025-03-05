import { Module } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { LessonController } from './lesson.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { LessonModel, LessonSchema } from './model/lesson.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: LessonModel.name, schema: LessonSchema }])
  ],
  providers: [LessonService],
  controllers: [LessonController],
  exports:[LessonService]
})
export class LessonModule { }
