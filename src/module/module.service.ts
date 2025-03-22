import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ModuleModel } from './model/module.model';
import { Model } from 'mongoose';
import { CreateModuleDto } from './dto/create-module.dto';
import { ModuleResponse } from './model/module.response';
import { transformMongoData } from 'src/common/utils/transform.utils';
import { transformMongoArray } from 'src/common/utils/mongo.utils';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
import { UpdateModuleDto } from './dto/update-module.dto';

@Injectable()
export class ModuleService {
    constructor(
        @InjectModel(ModuleModel.name) private moduleModel: Model<ModuleModel>,
    ) { }

    async createModule(createModuleDto: CreateModuleDto): Promise<ModuleResponse> {
        const module = await this.moduleModel.create(createModuleDto);

        const transformedModule = transformMongoData(module, ModuleResponse);

        return transformedModule
    }

    async getCourseModules(courseId: string): Promise<ModuleResponse[]> {
        const modules = await this.moduleModel.find({ course: courseId }).lean();

        const transformedModules = transformMongoArray(modules);

        return transformedModules;
    }

    async getModuleById(moduleId: string): Promise<ModuleResponse> {
        const module = await this.moduleModel.findById(moduleId).lean();

        if (!module) {
            throw new HttpException(new ErrorResponseDto('Module not found'), HttpStatus.NOT_FOUND);
        }

        const transformedModule = transformMongoData(module, ModuleResponse);

        return transformedModule
    }

    async updateModule(moduleId:string, updateModuleDto: UpdateModuleDto): Promise<ModuleResponse> {
        const updatedModule = await this.moduleModel.findByIdAndUpdate(moduleId, updateModuleDto, { new: true }).lean();

        if (!updatedModule) {
            throw new HttpException(new ErrorResponseDto('Module not found'), HttpStatus.NOT_FOUND);
        }

        const transformedModule = transformMongoData(updatedModule, ModuleResponse);

        return transformedModule
    }

    async deleteModule(moduleId: string): Promise<any> {
        const deletedModule = await this.moduleModel.findByIdAndDelete(moduleId).exec();

        if (!deletedModule) {
            throw new HttpException(new ErrorResponseDto('Module not found'), HttpStatus.NOT_FOUND);
        }

        return { message: "Module successfully deleted!" };
    }
}
