import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';
import { PASSWORD_REGEX, PASSWORD_MESSAGE } from '../../common/constants/validation.constants';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'Reset password token received via email',
  })
  @IsNotEmpty()
  @IsString()
  token: string;

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
  password: string;
} 