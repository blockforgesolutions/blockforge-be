import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CategoryModel } from './model/category.model';
import { Model } from 'mongoose';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryResponse } from './model/category.response';
import { transformMongoData } from 'src/common/utils/transform.utils';
import { transformMongoArray } from 'src/common/utils/mongo.utils';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
    constructor(
        @InjectModel(CategoryModel.name) private categoryModel: Model<CategoryModel>,
    ) { }

    async createCategory(category: CreateCategoryDto): Promise<CategoryResponse> {
        const newCategory = await this.categoryModel.create(category);

        const transformedCategory = transformMongoData(newCategory.toObject(), CategoryResponse);

        return transformedCategory;
    }

    async getAllCategories(): Promise<CategoryResponse[]> {
        const categories = await this.categoryModel.find().lean();

        const transformedCategories = transformMongoArray(categories);

        return transformedCategories;
    }

    async getCategoryById(categoryId: string): Promise<CategoryResponse> {
        const category = await this.categoryModel.findById(categoryId).lean();

        if (!category) {
            throw new HttpException(new ErrorResponseDto('Category not found'), HttpStatus.NOT_FOUND);
        }

        const transformedCategory = transformMongoData(category, CategoryResponse);

        return transformedCategory;
    }

    async getCategoryByName(name: string): Promise<CategoryResponse> {
        const category = await this.categoryModel.findOne({ name }).lean();

        if (!category) {
            throw new HttpException(new ErrorResponseDto('Category not found'), HttpStatus.NOT_FOUND);
        }

        const transformedCategory = transformMongoData(category, CategoryResponse);

        return transformedCategory;
    }

    async getCategoriesByType(type: string): Promise<CategoryResponse[]> {
        const categories = await this.categoryModel.find({ type }).lean();

        const transformedCategories = transformMongoArray(categories);

        return transformedCategories;
    }

    async updateCategory(categoryId: string, category: UpdateCategoryDto): Promise<CategoryResponse> {
        const updatedCategory = await this.categoryModel.findByIdAndUpdate(categoryId, category, { new: true }).lean();

        if (!updatedCategory) {
            throw new HttpException(new ErrorResponseDto('Category not found'), HttpStatus.NOT_FOUND);
        }

        const transformedCategory = transformMongoData(updatedCategory, CategoryResponse);

        return transformedCategory;
    }

    async deleteCategory(categoryId: string): Promise<any> {
        const deletedCategory = await this.categoryModel.findByIdAndDelete(categoryId).exec();

        if (!deletedCategory) {
            throw new HttpException(new ErrorResponseDto('Category not found'), HttpStatus.NOT_FOUND);
        }

        return { message: "Category successfully deleted!" };
    }
}
