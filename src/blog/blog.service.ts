import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BlogModel } from './model/blog.model';
import { Model } from 'mongoose';
import { CreateBlogDto } from './dto/create-blog.dto';
import { BlogResponse } from './model/blog.response';
import { transformMongoData } from 'src/common/utils/transform.utils';
import { transformMongoArray, transformMongoDocument } from 'src/common/utils/mongo.utils';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Injectable()
export class BlogService {
    constructor(
        @InjectModel(BlogModel.name) private blogModel: Model<BlogModel>,
    ) { }

    async createBlog(blog: CreateBlogDto): Promise<BlogResponse> {
        const newBlog = new this.blogModel(blog);

        await newBlog.save();

        const populatedBlog = await newBlog.populate([
            { path: 'author', select: 'id name surname picture' },
            { path: 'categories', select: 'id name type' }
        ]);

        const transformedBlog = transformMongoDocument<BlogModel, BlogResponse>(populatedBlog.toObject());

        if (!transformedBlog) {
            throw new Error("Blog transformation failed.");
        }
    
        return transformedBlog;
    }

    async getBlogs(): Promise<BlogResponse[]> {
        const blogs = await this.blogModel.find().populate([
            { path: 'author', select: 'id name surname picture' },
            { path: 'categories', select: 'id name type' }
        ]).lean();

        return transformMongoArray<BlogModel, BlogResponse>(blogs);
    }

    async getBlogById(blogId: string): Promise<BlogResponse> {
        const blog = await this.blogModel.findById(blogId).populate([
            { path: 'author', select: 'id name surname picture' },
            { path: 'categories', select: 'id name type' }
        ]).lean();

        if (!blog) {
            throw new HttpException(new ErrorResponseDto('Blog not found'), HttpStatus.NOT_FOUND);
        }

        return transformMongoData(blog, BlogResponse);
    }

    async getBlogBySlug(slug: string): Promise<BlogResponse> {
        const blog = await this.blogModel.findOne({ slug }).populate([
            { path: 'author', select: 'id name surname picture' },
            { path: 'categories', select: 'id name type' }
        ]).lean();

        if (!blog) {
            throw new HttpException(new ErrorResponseDto('Blog not found'), HttpStatus.NOT_FOUND);
        }

        return transformMongoData(blog, BlogResponse);
    }

    async getBlogByCategory(category: string): Promise<BlogResponse[]> {
        const blogs = await this.blogModel.find({ categories: { $in: [category] } }).populate([
            { path: 'author', select: 'id name surname picture' },
            { path: 'categories', select: 'id name type' }
        ]).lean();

        return transformMongoArray<BlogModel, BlogResponse>(blogs)
    }

    async updateBlog(blogId: string, blog: UpdateBlogDto): Promise<BlogResponse> {
        const updatedBlog = await this.blogModel.findByIdAndUpdate(blogId, blog, { new: true })
        .populate([
            { path: 'author', select: 'id name surname picture' },
            { path: 'categories', select: 'id name type' }
        ])
        .lean();

        if (!updatedBlog) {
            throw new HttpException(new ErrorResponseDto('Blog not found'), HttpStatus.NOT_FOUND);
        }

        return transformMongoData(updatedBlog, BlogResponse);
    }

    async deleteBlog(blogId: string): Promise<any> {
        const deletedBlog = await this.blogModel.findByIdAndDelete(blogId).exec();

        if (!deletedBlog) {
            throw new HttpException(new ErrorResponseDto('Blog not found'), HttpStatus.NOT_FOUND);
        }

        return { message: "Blog successfully deleted!" };
    }
}
