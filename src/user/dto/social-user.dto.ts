import { IsString, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AuthProvider } from '../user.schema';

export class SocialUserDto {
  @ApiProperty({
    description: 'Social authentication provider',
    enum: AuthProvider,
    example: AuthProvider.GOOGLE
  })
  @IsEnum(AuthProvider)
  provider: AuthProvider;

  @ApiProperty({
    description: 'ID token from the social provider',
    example: 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjFiZDY4...'
  })
  @IsString()
  idToken: string;

  @ApiPropertyOptional({
    description: 'Employee invitation token',
    example: '1234567890abcdef',
  })
  @IsOptional()
  @IsString()
  token?: string;
} 