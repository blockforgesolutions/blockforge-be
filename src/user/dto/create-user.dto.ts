import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches, MinLength, IsOptional } from 'class-validator';
import { PASSWORD_REGEX, PASSWORD_MESSAGE } from '../../common/constants/validation.constants';

export class CreateUserDto {
  @ApiProperty({
    description: 'Email address',
    example: 'user@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Password',
    minLength: 6,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @Matches(PASSWORD_REGEX, {
    message: PASSWORD_MESSAGE
  })
  password: string;

  @ApiProperty({
    description: 'First name',
    example: 'John',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Last name',
    example: 'Doe',
  })
  @IsNotEmpty()
  @IsString()
  surname: string;

  @ApiPropertyOptional({
    description: 'Employee invitation token',
    example: '1234567890abcdef',
  })
  @IsOptional()
  @IsString()
  token?: string;
} 