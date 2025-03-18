import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserMessages } from '../common/enums/messages.enum';
import { transformMongoDocument } from '../common/utils/mongo.utils';
import { CurrentUserResponse } from './models/user.response';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async findById(id: string): Promise<CurrentUserResponse> {
    const user = await this.userModel
      .findById(id)
      .select('-password')
      .populate({
        path: 'role',
        select: '_id name description',
      })
      .lean();
      

    if (!user) {
      throw new NotFoundException(UserMessages.USER_NOT_FOUND);
    }
    const transformedUser = transformMongoDocument(user);
    const transformedRole = transformMongoDocument(user.role);

    if (!transformedUser || !transformedRole) {
      throw new Error('Failed to transform user document');
    }

    return {
      ...transformedUser,
      role: transformedRole.name
    } as CurrentUserResponse;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<CurrentUserResponse> {
    // Validate update data if needed
    if (!this.isValidUpdateData(updateUserDto)) {
      throw new BadRequestException(UserMessages.INVALID_USER_DATA);
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .select('-password')
      .populate({
        path: 'role',
        select: '_id name description',
      })
      .lean();
      
    if (!updatedUser) {
      throw new NotFoundException(UserMessages.USER_NOT_FOUND);
    }

    const transformedUser = transformMongoDocument(updatedUser);
    const transformedRole = transformMongoDocument(updatedUser.role);
    
    if (!transformedUser || !transformedRole) {
      throw new Error('Failed to transform user document');
    }

    return {
      ...transformedUser,
      role: transformedRole.name   
    } as CurrentUserResponse;
  }

  private isValidUpdateData(updateUserDto: UpdateUserDto): boolean {
    // Add your validation logic here
    return true;
  }
} 