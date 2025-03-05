import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User, UserSchema } from './user.schema';
import { RolesModule } from '../roles/roles.module';
import { Role, RoleSchema } from '../roles/role.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Role.name, schema: RoleSchema }
    ]),
    RolesModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, MongooseModule], // Export MongooseModule to make models available
})
export class UserModule {} 