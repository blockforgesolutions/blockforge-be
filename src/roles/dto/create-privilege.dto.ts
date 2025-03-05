import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePrivilegeDto {
  @ApiProperty({
    example: 'CREATE_USER',
    description: 'Unique name of the privilege',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Can create new users',
    description: 'Description of what this privilege allows',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: 'users',
    description: 'The resource this privilege applies to',
  })
  @IsString()
  @IsNotEmpty()
  resource: string;

  @ApiProperty({
    example: 'create',
    description: 'The action allowed on the resource',
  })
  @IsString()
  @IsNotEmpty()
  action: string;
} 