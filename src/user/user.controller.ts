import { Controller, Get, Body, Patch, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiSecurity } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User as UserDecorator } from '../auth/decorators/user.decorator';
import { UserMessages } from '../common/enums/messages.enum';
import { CurrentUserResponse } from './models/user.response';

@ApiTags('Users')
@ApiSecurity('bearer')
@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('current')
  @ApiOperation({ summary: 'Get current user', description: 'Returns the authenticated user\'s information' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns current user information',
    type: CurrentUserResponse
  })
  @ApiResponse({ status: 401, description: UserMessages.UNAUTHORIZED_ACCESS })
  @ApiResponse({ status: 403, description: UserMessages.UNAUTHORIZED_ACCESS })
  @ApiResponse({ status: 404, description: UserMessages.USER_NOT_FOUND })
  getCurrent(@UserDecorator('id') id: string): Promise<CurrentUserResponse> {    
    return this.userService.findById(id);
  }

  @Patch('current')
  @ApiOperation({ summary: 'Update current user', description: 'Updates the authenticated user\'s information' })
  @ApiResponse({ 
    status: 200, 
    description: UserMessages.PROFILE_UPDATED_SUCCESS,
    type: CurrentUserResponse
  })
  @ApiResponse({ status: 401, description: UserMessages.UNAUTHORIZED_ACCESS })
  @ApiResponse({ status: 403, description: UserMessages.UNAUTHORIZED_ACCESS })
  @ApiResponse({ status: 404, description: UserMessages.USER_NOT_FOUND })
  @ApiResponse({ status: 400, description: UserMessages.INVALID_USER_DATA })
  updateCurrent(@UserDecorator('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<CurrentUserResponse> {
    return this.userService.update(id, updateUserDto);
  }
} 