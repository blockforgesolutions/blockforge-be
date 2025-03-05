import { Module } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { ProgressController } from './progress.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProgressModel, ProgressSchema } from './model/progress.model';
import { LessonModule } from 'src/lesson/lesson.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ProgressModel.name, schema: ProgressSchema }]),
    LessonModule
  ],
  providers: [ProgressService],
  controllers: [ProgressController]
})
export class ProgressModule { }
