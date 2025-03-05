import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';
import { PASSWORD_REGEX, PASSWORD_MESSAGE } from '../../common/constants/validation.constants';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'Current password',
    minLength: 6,
  })
  @IsNotEmpty()
  @IsString()
  currentPassword: string;

  @ApiProperty({
    description: 'New password',
    minLength: 6,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @Matches(PASSWORD_REGEX, {
    message: PASSWORD_MESSAGE
  })
  newPassword: string;
} 