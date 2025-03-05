import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from './role.schema';
import { Privilege } from './privilege.schema';
import { CreateRoleDto } from './dto/create-role.dto';
import { RoleMessages } from '../common/enums/messages.enum';
import { User } from '../user/user.schema';
import { transformMongoDocument, transformMongoArray } from '../common/utils/mongo.utils';
import { PrivilegeResponse, RoleResponse, CreateRoleResponse, UpdateRoleResponse } from './models/role.response';

@Injectable()
export class RolesService {
  private readonly DEFAULT_ROLES = ['Yönetici', 'Personel'];

  constructor(
    @InjectModel(Role.name) private roleModel: Model<Role>,
    @InjectModel(Privilege.name) private privilegeModel: Model<Privilege>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  // Privilege operations
  async findAllPrivileges(): Promise<PrivilegeResponse[]> {
    const privileges = await this.privilegeModel.find().lean();
    return privileges.map(transformMongoDocument);
  }

  // Role operations
  async createRole(createRoleDto: CreateRoleDto, userId: string): Promise<CreateRoleResponse> {
    const existingRole = await this.roleModel.findOne({ name: createRoleDto.name });
    if (existingRole) {
      throw new ConflictException(RoleMessages.ROLE_ALREADY_EXISTS);
    }

    // Validate privileges
    const privileges = await this.privilegeModel.find({
      _id: { $in: createRoleDto.privileges },
    });

    if (privileges.length !== createRoleDto.privileges.length) {
      throw new BadRequestException(RoleMessages.INVALID_PRIVILEGE);
    }

    const role = await this.roleModel.create({
      ...createRoleDto,
      createdBy: userId,
    });

    const populatedRole = await role.populate('privileges');
    const transformedRole = transformMongoDocument(populatedRole.toObject());

    return { 
      role: {
        ...transformedRole,
        privileges: populatedRole.privileges.map(transformMongoDocument)
      } as RoleResponse, 
      message: RoleMessages.ROLE_CREATED_SUCCESS 
    };
  }

  async findAllRoles(userId: string): Promise<RoleResponse[]> {
    // Default rolleri ve kullanıcının oluşturduğu rolleri getir
    const roles = await this.roleModel.find({
      $or: [
        { name: { $in: this.DEFAULT_ROLES } }, // Default roller
        { createdBy: userId } // Kullanıcının oluşturduğu roller
      ]
    })
    .populate('privileges')
    .lean();

    return roles.map(role => {
      const transformedRole = transformMongoDocument(role);
      return {
        ...transformedRole,
        privileges: role.privileges.map(transformMongoDocument)
      } as RoleResponse;
    });
  }

  async findRoleById(id: string, userId: string): Promise<RoleResponse> {
    const role = await this.roleModel.findById(id).populate('privileges').lean();
    if (!role) {
      throw new NotFoundException(RoleMessages.ROLE_NOT_FOUND);
    }

    // Eğer default rol değilse ve kullanıcı oluşturmamışsa erişimi engelle
    if (!this.DEFAULT_ROLES.includes(role.name) && role.createdBy?.toString() !== userId) {
      throw new NotFoundException(RoleMessages.ROLE_NOT_FOUND);
    }

    const transformedRole = transformMongoDocument(role);
    return {
      ...transformedRole,
      privileges: role.privileges.map(transformMongoDocument)
    } as RoleResponse;
  }

  async updateRole(id: string, updateRoleDto: CreateRoleDto, userId: string): Promise<UpdateRoleResponse> {
    // Önce rolü bul ve erişim kontrolü yap
    const existingRole = await this.roleModel.findById(id);
    if (!existingRole) {
      throw new NotFoundException(RoleMessages.ROLE_NOT_FOUND);
    }

    // Default rolleri güncellemeyi engelle
    if (this.DEFAULT_ROLES.includes(existingRole.name)) {
      throw new BadRequestException('Default roller güncellenemez');
    }

    // Sadece rolü oluşturan kullanıcı güncelleyebilir
    if (existingRole.createdBy?.toString() !== userId) {
      throw new BadRequestException('Bu rolü güncelleme yetkiniz yok');
    }

    // Validate privileges
    const privileges = await this.privilegeModel.find({
      _id: { $in: updateRoleDto.privileges },
    });

    if (privileges.length !== updateRoleDto.privileges.length) {
      throw new BadRequestException(RoleMessages.INVALID_PRIVILEGE);
    }

    const role = await this.roleModel
      .findByIdAndUpdate(id, updateRoleDto, { new: true })
      .populate('privileges')
      .lean();

    const transformedRole = transformMongoDocument(role);
    return { 
      role: {
        ...transformedRole,
        privileges: role.privileges.map(transformMongoDocument)
      } as RoleResponse, 
      message: RoleMessages.ROLE_UPDATED_SUCCESS 
    };
  }

  async deleteRole(id: string, userId: string): Promise<{ message: string }> {
    // Önce rolü bul ve erişim kontrolü yap
    const role = await this.roleModel.findById(id);
    if (!role) {
      throw new NotFoundException(RoleMessages.ROLE_NOT_FOUND);
    }

    // Default rolleri silmeyi engelle
    if (this.DEFAULT_ROLES.includes(role.name)) {
      throw new BadRequestException('Default roller silinemez');
    }

    // Sadece rolü oluşturan kullanıcı silebilir
    if (role.createdBy?.toString() !== userId) {
      throw new BadRequestException('Bu rolü silme yetkiniz yok');
    }

    // Check if role is in use
    const usersWithRole = await this.userModel.countDocuments({ role: id });
    if (usersWithRole > 0) {
      throw new ConflictException(RoleMessages.ROLE_IN_USE);
    }

    const result = await this.roleModel.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      throw new NotFoundException(RoleMessages.ROLE_NOT_FOUND);
    }

    return { message: RoleMessages.ROLE_DELETED_SUCCESS };
  }
} 