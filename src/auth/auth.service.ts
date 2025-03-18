import { Injectable, UnauthorizedException, BadRequestException, ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';
import { AuthProvider, User } from '../user/user.schema';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { SocialUserDto } from '../user/dto/social-user.dto';
import { ChangePasswordDto } from '../user/dto/change-password.dto';
import { EmailVerification } from './email-verification.schema';
import { MailService } from '../mail/mail.service';
import { AuthResponse } from './models/auth.response';
import { AuthMessages, MailMessages } from '../common/enums/messages.enum';
import { Role } from '../roles/role.schema';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { PasswordReset } from './password-reset.schema';

@Injectable()
export class AuthService {
  private readonly googleClient: OAuth2Client;

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Role.name) private roleModel: Model<Role>,
    @InjectModel(EmailVerification.name) private emailVerificationModel: Model<EmailVerification>,
    @InjectModel(PasswordReset.name) private passwordResetModel: Model<PasswordReset>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailService: MailService,
  ) {
    this.googleClient = new OAuth2Client(
      this.configService.get('GOOGLE_CLIENT_ID'),
    );
  }

  private generateVerificationToken(): string {
    return randomBytes(32).toString('hex');
  }

  private async getManagerRole(): Promise<Role> {
    const role = await this.roleModel.findOne({ name: 'Yönetici' });
    if (!role) {
      throw new Error('Manager role not found');
    }
    return role;
  }

  private async getEmployeeRole(): Promise<Role> {
    const role = await this.roleModel.findOne({ name: 'Personel' });
    if (!role) {
      throw new Error('Employee role not found');
    }
    return role;
  }

  async signup(createUserDto: CreateUserDto) {
    const existingUser = await this.userModel.findOne({
      email: createUserDto.email,
    });

    if (existingUser) {
      throw new ConflictException(AuthMessages.EMAIL_ALREADY_REGISTERED);
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = await this.userModel.create({
      ...createUserDto,
      password: hashedPassword,
      provider: 'LOCAL',
    });

    // Generate and save verification token
    const token = this.generateVerificationToken();

    await this.emailVerificationModel.create({
      userId: user._id,
      token,
    });


    // Send verification email
    // await this.mailService.sendVerificationEmail(user, token);
    const newUser = await this.mapToUserResponse(user);
    return newUser
  }

  async verifyEmail(token: string): Promise<AuthResponse | { message: string }> {
    // First find the verification record
    const verification = await this.emailVerificationModel.findOne({ token });
    if (!verification) {
      throw new BadRequestException(AuthMessages.INVALID_VERIFICATION_TOKEN);
    }

    // Then find and check the user
    const user = await this.userModel.findById(verification.userId);
    if (!user) {
      throw new BadRequestException(AuthMessages.USER_NOT_FOUND);
    }

    // Check if email is already verified
    if (user.isEmailVerified) {
      // Delete the verification token since it's no longer needed
      await verification.deleteOne();
      return { message: AuthMessages.EMAIL_ALREADY_VERIFIED };
    }

    // If not verified, verify it now
    user.isEmailVerified = true;
    await user.save();

    // Delete the verification token
    await verification.deleteOne();

    return this.mapToUserResponse(user);
  }

  async resendVerificationEmail(userId: string): Promise<{ message: string }> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new BadRequestException(AuthMessages.USER_NOT_FOUND);
    }

    if (user.isEmailVerified) {
      return { message: AuthMessages.EMAIL_ALREADY_VERIFIED };
    }

    if (user.provider !== AuthProvider.LOCAL) {
      throw new BadRequestException(AuthMessages.CANNOT_VERIFY_EMAIL_FOR_PROVIDER.replace('{provider}', user.provider));
    }

    try {
      // Delete any existing verification tokens
      await this.emailVerificationModel.deleteMany({ userId: user._id });

      // Generate and save new verification token
      const token = this.generateVerificationToken();
      await this.emailVerificationModel.create({
        userId: user._id,
        token,
      });

      // Send verification email
      await this.mailService.sendVerificationEmail(user, token);

      return { message: AuthMessages.VERIFICATION_EMAIL_SENT };
    } catch (error) {
      console.error('Error in resendVerificationEmail:', error);
      throw new InternalServerErrorException(MailMessages.EMAIL_SEND_FAILED);
    }
  }

  async signin(email: string, password: string) {
    const user = await this.userModel
      .findOne({ email })
      .populate({
        path: 'role',
        select: '_id name description',
      });


    if (!user) {
      throw new UnauthorizedException(AuthMessages.INVALID_CREDENTIALS);
    }

    // isActive alanı yoksa varsayılan olarak true kabul et
    if (user.isActive === false) {
      throw new UnauthorizedException(AuthMessages.ACCOUNT_DEACTIVATED);
    }

    if (user.provider !== AuthProvider.LOCAL) {
      throw new UnauthorizedException(AuthMessages.SIGN_IN_WITH_PROVIDER.replace('{provider}', user.provider));
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException(AuthMessages.INVALID_CREDENTIALS);
    }

    return this.mapToUserResponse(user);
  }

  async socialSignup(socialUserDto: SocialUserDto) {
    try {
      // Verify the Google ID token
      const ticket = await this.googleClient.verifyIdToken({
        idToken: socialUserDto.idToken,
        audience: this.configService.get('GOOGLE_CLIENT_ID'),
      });

      const payload = ticket.getPayload();
      if (!payload) {
        throw new UnauthorizedException(AuthMessages.INVALID_SOCIAL_TOKEN);
      }

      // Extract user information from the token payload
      const { email, name, picture, sub: providerId, email_verified } = payload;
      const [firstName, ...restName] = name?.split(' ') || ['', ''];
      const surname = restName.join(' ');

      let user = await this.userModel
        .findOne({ email })
        .populate({
          path: 'role',
          select: '_id name description',
          populate: {
            path: 'privileges',
            select: '_id name description resource action'
          }
        });

      if (user) {
        // If user exists but used a different auth provider
        if (user.provider !== socialUserDto.provider) {
          throw new BadRequestException(AuthMessages.SOCIAL_USER_EXISTS);
        }

        // Update user information from Google
        user.name = firstName;
        user.surname = surname;
        user.picture = picture;
        await user.save();

        // Re-populate after save
        user = await user.populate({
          path: 'role',
          select: '_id name description',
          populate: {
            path: 'privileges',
            select: '_id name description resource action'
          }
        });
      } else {
        let role;
        let company;

        // Check if there's an invitation token
        if (socialUserDto.token) {
          // const invitation = await this.employeeInvitationModel.findOne({ 
          //   token: socialUserDto.token,
          //   email: email,
          //   status: InvitationStatus.PENDING,
          //   expiresAt: { $gt: new Date() }
          // });

          // if (!invitation) {
          //   throw new BadRequestException('Invalid or expired invitation token');
          // }

          // role = await this.getEmployeeRole();
          // company = invitation.company;

          // // Mark invitation as accepted
          // invitation.status = InvitationStatus.ACCEPTED;
          // await invitation.save();
        } else {
          role = await this.getManagerRole();
        }

        user = await this.userModel.create({
          email,
          name: firstName,
          surname,
          picture,
          provider: socialUserDto.provider,
          providerId,
          isEmailVerified: email_verified || false,
          role: new Types.ObjectId(role._id),
          company: company ? new Types.ObjectId(company) : undefined,
        });

        // Populate after create
        user = await user.populate({
          path: 'role',
          select: '_id name description',
          populate: {
            path: 'privileges',
            select: '_id name description resource action'
          }
        });
      }

      return this.mapToUserResponse(user);
    } catch (error) {
      if (error instanceof UnauthorizedException || error instanceof BadRequestException) {
        throw error;
      }
      throw new UnauthorizedException(AuthMessages.INVALID_SOCIAL_TOKEN);
    }
  }

  private async mapToUserResponse(user: User): Promise<AuthResponse> {
    const jwtPayload = {
      sub: user._id
    };

    const token = await this.jwtService.signAsync(jwtPayload);

    // Populate role and privileges
    const populatedUser = await this.userModel
      .findById(user._id)
      .select('-password')
      .populate({
        path: 'role',
        select: '_id name description'
      })
      .lean();

    if (!populatedUser || !populatedUser.role) {
      throw new NotFoundException(AuthMessages.USER_OR_ROLE_NOT_FOUND);
    }

    const response: AuthResponse = {
      access_token: token,
      user: {
        ...populatedUser,
        // eslint-disable-next-line @typescript-eslint/no-base-to-string
        _id: String(populatedUser._id),
        role: populatedUser.role.name
      }
    };

    return response;
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new BadRequestException(AuthMessages.USER_NOT_FOUND);
    }

    if (user.provider !== AuthProvider.LOCAL) {
      throw new BadRequestException(AuthMessages.CANNOT_CHANGE_PASSWORD_FOR_PROVIDER.replace('{provider}', user.provider));
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(changePasswordDto.currentPassword, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException(AuthMessages.INVALID_PASSWORD);
    }

    // Check if new password is same as current password
    const isSamePassword = await bcrypt.compare(changePasswordDto.newPassword, user.password);
    if (isSamePassword) {
      throw new BadRequestException(AuthMessages.SAME_PASSWORD);
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);

    // Update password
    user.password = hashedPassword;
    await user.save();

    return { message: AuthMessages.PASSWORD_CHANGED_SUCCESS };
  }

  private generateShortToken(length: number = 32): string {
    return randomBytes(length / 2).toString('hex');
  }

  private generateResetToken(): string {
    return randomBytes(32).toString('hex');
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.userModel.findOne({ email: forgotPasswordDto.email });
    if (!user) {
      throw new NotFoundException(AuthMessages.USER_NOT_FOUND);
    }

    if (user.provider !== AuthProvider.LOCAL) {
      throw new BadRequestException(AuthMessages.CANNOT_RESET_PASSWORD_FOR_PROVIDER.replace('{provider}', user.provider));
    }

    // Generate reset token
    const token = this.generateResetToken();

    // Delete any existing reset tokens for this user
    await this.passwordResetModel.deleteMany({ userId: user._id });

    // Create new reset token
    await this.passwordResetModel.create({
      userId: user._id,
      token,
    });

    // Send reset password email
    await this.mailService.sendPasswordResetEmail(user.email, user.name, token);

    return { message: AuthMessages.PASSWORD_RESET_EMAIL_SENT };
  }

  async verifyResetToken(token: string) {
    try {
      const resetToken = await this.passwordResetModel.findOne({ token });
      if (!resetToken) {
        throw new UnauthorizedException(AuthMessages.INVALID_RESET_TOKEN);
      }

      return { valid: true };
    } catch (error) {
      console.log(error);

      throw new UnauthorizedException(AuthMessages.INVALID_RESET_TOKEN);
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { token, password } = resetPasswordDto;

    try {
      // Find reset token and validate
      const resetToken = await this.passwordResetModel.findOne({ token });
      if (!resetToken) {
        throw new UnauthorizedException(AuthMessages.INVALID_RESET_TOKEN);
      }

      // Find user
      const user = await this.userModel.findById(resetToken.userId);
      if (!user) {
        throw new NotFoundException(AuthMessages.USER_NOT_FOUND);
      }

      // Check if new password is same as current password (if exists)
      if (user.password) {
        const isSamePassword = await bcrypt.compare(password, user.password);
        if (isSamePassword) {
          throw new BadRequestException(AuthMessages.SAME_PASSWORD);
        }
      }

      // Hash and update password
      const hashedPassword = await bcrypt.hash(password, 10);
      await this.userModel.findByIdAndUpdate(user._id, {
        password: hashedPassword,
        activeSessions: [] // Invalidate all active sessions
      });

      // Delete the used reset token
      await resetToken.deleteOne();

      return { message: AuthMessages.PASSWORD_RESET_SUCCESS };
    } catch (error) {
      if (error instanceof UnauthorizedException || error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new UnauthorizedException(AuthMessages.INVALID_RESET_TOKEN);
    }
  }
} 