import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsPhoneNumber, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    example: 'John',
    description: 'User first name',
    required: false
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    example: 'Doe',
    description: 'User last name',
    required: false
  })
  @IsString()
  @IsOptional()
  surname?: string;

  @ApiProperty({
    example: '+905551234567',
    description: 'User phone number',
    required: false
  })
  @IsPhoneNumber()
  @IsOptional()
  phone?: string;
} 