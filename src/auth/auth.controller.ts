import { Controller, Post, Body, UseGuards, Get, Param, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { SocialUserDto } from '../user/dto/social-user.dto';
import { ChangePasswordDto } from '../user/dto/change-password.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { User } from './decorators/user.decorator';
import { AuthResponse } from './models/auth.response';
import { AuthMessages } from '../common/enums/messages.enum';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ 
    summary: 'Register a new user',
    description: 'Creates a new user account and sends a verification email'
  })
  @ApiResponse({ 
    status: 201, 
    description: AuthMessages.USER_CREATED_SUCCESS,
    type: AuthResponse
  })
  @ApiResponse({ status: 400, description: AuthMessages.EMAIL_ALREADY_REGISTERED })
  @ApiBody({
    type: CreateUserDto,
    description: 'User registration data'
  })
  async signup(@Body() createUserDto: CreateUserDto): Promise<AuthResponse> {
    return this.authService.signup(createUserDto);
  }

  @Get('verify-email/:token')
  @ApiOperation({ 
    summary: 'Verify email address',
    description: 'Verifies a user\'s email address using the token sent to their email'
  })
  @ApiResponse({ 
    status: 200, 
    description: AuthMessages.EMAIL_VERIFIED_SUCCESS,
    schema: {
      oneOf: [
        { $ref: '#/components/schemas/AuthResponse' },
        {
          type: 'object',
          properties: {
            message: { type: 'string', example: AuthMessages.EMAIL_ALREADY_VERIFIED }
          }
        }
      ]
    }
  })
  @ApiResponse({ status: 400, description: AuthMessages.INVALID_VERIFICATION_TOKEN })
  @ApiParam({
    name: 'token',
    required: true,
    description: 'Email verification token sent to user\'s email',
    type: 'string'
  })
  async verifyEmail(@Param('token') token: string): Promise<AuthResponse | { message: string }> {
    return this.authService.verifyEmail(token);
  }

  @Post('resend-verification-email')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Resend verification email',
    description: 'Resends the verification email to the user\'s email address. Requires authentication.'
  })
  @ApiResponse({ 
    status: 200, 
    description: AuthMessages.VERIFICATION_EMAIL_SENT,
    schema: {
      properties: {
        message: { type: 'string', example: AuthMessages.VERIFICATION_EMAIL_SENT }
      }
    }
  })
  @ApiResponse({ status: 400, description: `${AuthMessages.EMAIL_ALREADY_VERIFIED} or ${AuthMessages.USER_NOT_FOUND}` })
  @ApiResponse({ status: 401, description: `${AuthMessages.UNAUTHORIZED_ACCESS}` })
  async resendVerificationEmail(@User('id') userId: string) {
    return this.authService.resendVerificationEmail(userId);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Sign in with email and password',
    description: 'Authenticates a user using their email and password'
  })
  @ApiResponse({ 
    status: 200, 
    description: AuthMessages.LOGIN_SUCCESS,
    type: AuthResponse
  })
  @ApiResponse({ status: 401, description: AuthMessages.INVALID_CREDENTIALS })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        email: {
          type: 'string',
          format: 'email',
          example: 'ycevik@live.com'
        },
        password: {
          type: 'string',
          format: 'password',
          example: '709332Ysn*'
        }
      }
    }
  })
  async signin(
    @Body('email') email: string,
    @Body('password') password: string,
  ): Promise<AuthResponse> {
    return this.authService.signin(email, password);
  }

  @Post('social')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Sign in with Google',
    description: 'Authenticates a user using their Google account. Creates a new user account if the email is not registered. The user information (email, name, etc.) will be extracted from the Google ID token.'
  })
  @ApiResponse({ 
    status: 200, 
    description: AuthMessages.LOGIN_SUCCESS,
    type: AuthResponse
  })
  @ApiResponse({ status: 400, description: AuthMessages.SOCIAL_USER_EXISTS })
  @ApiResponse({ status: 401, description: AuthMessages.INVALID_SOCIAL_TOKEN })
  @ApiBody({
    type: SocialUserDto,
    description: 'Social authentication data containing provider type and ID token from Google'
  })
  async socialAuth(@Body() socialUserDto: SocialUserDto): Promise<AuthResponse> {
    return this.authService.socialSignup(socialUserDto);
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Change password',
    description: 'Changes the password for the authenticated user. Only works for local accounts (not social login).'
  })
  @ApiResponse({ 
    status: 200, 
    description: AuthMessages.PASSWORD_CHANGED_SUCCESS,
    schema: {
      properties: {
        message: { type: 'string', example: AuthMessages.PASSWORD_CHANGED_SUCCESS }
      }
    }
  })
  @ApiResponse({ status: 400, description: AuthMessages.INVALID_PASSWORD })
  @ApiResponse({ status: 401, description: AuthMessages.UNAUTHORIZED_ACCESS })
  @ApiBody({
    type: ChangePasswordDto,
    description: 'Current and new password'
  })
  @ApiBearerAuth()
  async changePassword(
    @User('id') userId: string,
    @Body() changePasswordDto: ChangePasswordDto
  ) {
    return this.authService.changePassword(userId, changePasswordDto);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Request password reset email' })
  @ApiResponse({ status: 200, description: AuthMessages.PASSWORD_RESET_EMAIL_SENT })
  @ApiResponse({ status: 404, description: AuthMessages.USER_NOT_FOUND })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Get('verify-reset-token')
  @ApiOperation({ summary: 'Verify reset password token' })
  @ApiResponse({ status: 200, description: AuthMessages.TOKEN_VALID })
  @ApiResponse({ status: 401, description: AuthMessages.INVALID_RESET_TOKEN })
  async verifyResetToken(@Query('token') token: string) {
    return this.authService.verifyResetToken(token);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password with token' })
  @ApiResponse({ status: 200, description: AuthMessages.PASSWORD_RESET_SUCCESS })
  @ApiResponse({ status: 401, description: AuthMessages.INVALID_RESET_TOKEN })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }
} 