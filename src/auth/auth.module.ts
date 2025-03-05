import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { User, UserSchema } from '../user/user.schema';
import { EmailVerification, EmailVerificationSchema } from './email-verification.schema';
import { MailModule } from '../mail/mail.module';
import { RoleGuard } from './guards/role.guard';
import { PrivilegeGuard } from './guards/privilege.guard';
import { Role, RoleSchema } from '../roles/role.schema';
import { PasswordReset } from './password-reset.schema';
import { EmployeeInvitation, EmployeeInvitationSchema } from '../employee/schemas/employee-invitation.schema';
import { SchemaFactory } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: EmailVerification.name, schema: EmailVerificationSchema },
      { name: Role.name, schema: RoleSchema },
      { name: PasswordReset.name, schema: SchemaFactory.createForClass(PasswordReset) },
      { name: EmployeeInvitation.name, schema: EmployeeInvitationSchema },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRATION'),
        },
      }),
      inject: [ConfigService],
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    MailModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    RoleGuard,
    PrivilegeGuard,
  ],
  exports: [RoleGuard, PrivilegeGuard],
})
export class AuthModule {} 