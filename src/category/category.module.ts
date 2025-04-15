import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { UserModule } from 'src/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryModel, CategorySchema } from './model/category.model';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([{ name: CategoryModel.name, schema: CategorySchema }])
  ],
  providers: [CategoryService],
  controllers: [CategoryController]
})
export class CategoryModule { }
