import { Module } from '@nestjs/common';
import { ModuleService } from './module.service';
import { ModuleController } from './module.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ModuleModel, ModuleSchema } from './model/module.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ModuleModel.name, schema: ModuleSchema }])
  ],
  providers: [ModuleService],
  controllers: [ModuleController]
})
export class ModuleModule { }
