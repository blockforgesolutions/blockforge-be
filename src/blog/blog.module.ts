import { Module } from '@nestjs/common';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { UserModule } from 'src/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogModel, BlogSchema } from './model/blog.model';
import { CategoryModule } from 'src/category/category.module';

@Module({
  imports: [
    UserModule,
    CategoryModule,
    MongooseModule.forFeature([{ name: BlogModel.name, schema: BlogSchema }])
  ],
  controllers: [BlogController],
  providers: [BlogService]
})
export class BlogModule { }
