import { IsString, IsNotEmpty, IsArray, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({
    example: 'ADMIN',
    description: 'Unique name of the role',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'System Administrator',
    description: 'Description of the role',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: ['CREATE_USER', 'READ_USERS'],
    description: 'Array of privilege IDs',
  })
  @IsArray()
  @IsString({ each: true })
  privileges: string[];
} 