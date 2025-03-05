import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockUser = {
    id: 'testId',
    email: 'test@example.com',
    name: 'Test',
    surname: 'User',
    phone: '+90555123456',
    isPhoneVerified: false,
    isEmailVerified: false,
  };

  const mockAuthResponse = {
    access_token: 'test-token',
    user: mockUser,
  };

  const mockAuthService = {
    signup: jest.fn().mockResolvedValue(mockAuthResponse),
    signin: jest.fn().mockResolvedValue(mockAuthResponse),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signup', () => {
    const createUserDto: CreateUserDto = {
      email: 'test@example.com',
      password: 'Password123!',
      name: 'Test',
      surname: 'User',
      phone: '+90555123456',
    };

    it('should create a new user and return auth response', async () => {
      const result = await controller.signup(createUserDto);

      expect(result).toBe(mockAuthResponse);
      expect(service.signup).toHaveBeenCalledWith(createUserDto);
      expect(result.user).toHaveProperty('email', createUserDto.email);
      expect(result.user).toHaveProperty('name', createUserDto.name);
      expect(result.user).toHaveProperty('surname', createUserDto.surname);
    });

    it('should propagate service errors', async () => {
      const error = new Error('Test error');
      mockAuthService.signup.mockRejectedValueOnce(error);

      await expect(controller.signup(createUserDto)).rejects.toThrow(error);
    });
  });

  describe('signin', () => {
    it('should authenticate user and return auth response', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'Password123!',
      };

      const result = await controller.signin(credentials.email, credentials.password);

      expect(result).toBe(mockAuthResponse);
      expect(service.signin).toHaveBeenCalledWith(credentials.email, credentials.password);
    });

    it('should propagate service errors', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'Password123!',
      };

      const error = new UnauthorizedException('Invalid credentials');
      mockAuthService.signin.mockRejectedValueOnce(error);

      await expect(controller.signin(credentials.email, credentials.password)).rejects.toThrow(error);
    });
  });
}); 