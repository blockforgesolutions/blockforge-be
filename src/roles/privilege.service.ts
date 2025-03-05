import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Privilege } from './privilege.schema';

@Injectable()
export class PrivilegeService {
  constructor(
    @InjectModel(Privilege.name) private privilegeModel: Model<Privilege>,
  ) {}

  async create(createPrivilegeDto: {
    name: string;
    description: string;
    resource: string;
    action: string;
  }): Promise<Privilege> {
    const createdPrivilege = new this.privilegeModel(createPrivilegeDto);
    return createdPrivilege.save();
  }

  async findByName(name: string): Promise<Privilege> {
    return this.privilegeModel.findOne({ name }).exec();
  }

  async findAll(): Promise<Privilege[]> {
    return this.privilegeModel.find().exec();
  }

  async update(id: string, updatePrivilegeDto: Partial<Privilege>): Promise<Privilege> {
    return this.privilegeModel
      .findByIdAndUpdate(id, updatePrivilegeDto, { new: true })
      .exec();
  }

  async delete(id: string): Promise<Privilege> {
    return this.privilegeModel.findByIdAndDelete(id).exec();
  }
} 