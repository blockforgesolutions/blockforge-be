import { ApiProperty } from '@nestjs/swagger';

export class CurrentUserResponse {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  id: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  email: string;

  @ApiProperty({ example: 'John' })
  name: string;

  @ApiProperty({ example: 'Doe' })
  surname: string;

  @ApiProperty({ example: '+905551234567', nullable: true })
  phone: string;

  @ApiProperty({ example: 'MANAGER' })
  role: string;

  @ApiProperty({ example: 'LOCAL', enum: ['LOCAL', 'GOOGLE'] })
  provider: string;

  @ApiProperty({ example: false })
  isPhoneVerified: boolean;

  @ApiProperty({ example: false })
  isEmailVerified: boolean;

  @ApiProperty({ example: 'https://example.com/photo.jpg', nullable: true })
  picture?: string;
} 