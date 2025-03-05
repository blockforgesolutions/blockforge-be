jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../user/user.schema';
import * as bcrypt from 'bcrypt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { EmailVerification } from './email-verification.schema';
import { MailService } from '../mail/mail.service';

describe('AuthService', () => {
  let service: AuthService;
  let userModel: Model<User>;
  let emailVerificationModel: Model<EmailVerification>;
  let jwtService: JwtService;
  let mailService: MailService;

  const mockUser = {
    _id: 'user-id',
    email: 'test@example.com',
    name: 'Test',
    surname: 'User',
    phone: '+905551234567',
    password: 'hashedPassword',
    provider: 'LOCAL',
    picture: undefined,
    isEmailVerified: false,
    isPhoneVerified: false,
    save: jest.fn(),
  };

  const mockEmailVerification = {
    _id: 'verification-id',
    userId: mockUser._id,
    token: 'verification-token',
    deleteOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken(User.name),
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
            findById: jest.fn(),
          },
        },
        {
          provide: getModelToken(EmailVerification.name),
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
            deleteMany: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('jwt-token'),
          },
        },
        {
          provide: MailService,
          useValue: {
            sendVerificationEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userModel = module.get<Model<User>>(getModelToken(User.name));
    emailVerificationModel = module.get<Model<EmailVerification>>(getModelToken(EmailVerification.name));
    jwtService = module.get<JwtService>(JwtService);
    mailService = module.get<MailService>(MailService);
  });

  describe('signup', () => {
    const createUserDto = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test',
      surname: 'User',
      phone: '+905551234567',
    };

    it('should create a new user and send verification email', async () => {
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      (userModel.findOne as jest.Mock).mockResolvedValue(null);
      (userModel.create as jest.Mock).mockResolvedValue(mockUser);
      (emailVerificationModel.create as jest.Mock).mockResolvedValue(mockEmailVerification);

      const result = await service.signup(createUserDto);

      expect(userModel.findOne).toHaveBeenCalledWith({ email: createUserDto.email });
      expect(bcrypt.hash).toHaveBeenCalledWith(createUserDto.password, 10);
      expect(userModel.create).toHaveBeenCalledWith({
        ...createUserDto,
        password: 'hashedPassword',
        provider: 'LOCAL',
        isEmailVerified: false,
        isPhoneVerified: false,
      });
      expect(emailVerificationModel.create).toHaveBeenCalled();
      expect(mailService.sendVerificationEmail).toHaveBeenCalledWith(mockUser, mockEmailVerification.token);
      expect(result).toEqual({
        access_token: 'jwt-token',
        user: {
          id: mockUser._id,
          email: mockUser.email,
          name: mockUser.name,
          surname: mockUser.surname,
          phone: mockUser.phone,
          isPhoneVerified: mockUser.isPhoneVerified,
          isEmailVerified: mockUser.isEmailVerified,
          picture: mockUser.picture,
        },
      });
    });

    it('should throw BadRequestException if email already exists', async () => {
      (userModel.findOne as jest.Mock).mockResolvedValue(mockUser);

      await expect(service.signup(createUserDto)).rejects.toThrow('Email already registered');
    });
  });

  describe('verifyEmail', () => {
    it('should verify email successfully', async () => {
      (emailVerificationModel.findOne as jest.Mock).mockResolvedValue(mockEmailVerification);
      (userModel.findById as jest.Mock).mockResolvedValue({ ...mockUser, isEmailVerified: false });

      const result = await service.verifyEmail('verification-token');

      expect(emailVerificationModel.findOne).toHaveBeenCalledWith({ token: 'verification-token' });
      expect(userModel.findById).toHaveBeenCalledWith(mockUser._id);
      expect(mockUser.save).toHaveBeenCalled();
      expect(mockEmailVerification.deleteOne).toHaveBeenCalled();
      if ('user' in result) {
        expect(result.user.isEmailVerified).toBe(true);
      }
    });

    it('should throw BadRequestException if token is invalid', async () => {
      (emailVerificationModel.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.verifyEmail('invalid-token')).rejects.toThrow('Invalid verification token');
    });

    it('should throw BadRequestException if user not found', async () => {
      (emailVerificationModel.findOne as jest.Mock).mockResolvedValue(mockEmailVerification);
      (userModel.findById as jest.Mock).mockResolvedValue(null);

      await expect(service.verifyEmail('verification-token')).rejects.toThrow('User not found');
    });

    it('should throw BadRequestException if email already verified', async () => {
      (emailVerificationModel.findOne as jest.Mock).mockResolvedValue(mockEmailVerification);
      (userModel.findById as jest.Mock).mockResolvedValue({ ...mockUser, isEmailVerified: true });

      await expect(service.verifyEmail('verification-token')).rejects.toThrow('Email already verified');
    });
  });

  describe('resendVerificationEmail', () => {
    it('should resend verification email successfully', async () => {
      (userModel.findById as jest.Mock).mockResolvedValue({ ...mockUser, isEmailVerified: false });
      (emailVerificationModel.deleteMany as jest.Mock).mockResolvedValue({ deletedCount: 1 });
      (emailVerificationModel.create as jest.Mock).mockResolvedValue(mockEmailVerification);

      const result = await service.resendVerificationEmail('user-id');

      expect(userModel.findById).toHaveBeenCalledWith('user-id');
      expect(emailVerificationModel.deleteMany).toHaveBeenCalledWith({ userId: mockUser._id });
      expect(emailVerificationModel.create).toHaveBeenCalled();
      expect(mailService.sendVerificationEmail).toHaveBeenCalledWith(mockUser, mockEmailVerification.token);
      expect(result).toEqual({ message: 'Verification email sent' });
    });

    it('should throw BadRequestException if user not found', async () => {
      (userModel.findById as jest.Mock).mockResolvedValue(null);

      await expect(service.resendVerificationEmail('invalid-id')).rejects.toThrow('User not found');
    });

    it('should throw BadRequestException if email already verified', async () => {
      (userModel.findById as jest.Mock).mockResolvedValue({ ...mockUser, isEmailVerified: true });

      await expect(service.resendVerificationEmail('user-id')).rejects.toThrow('Email already verified');
    });
  });
}); 