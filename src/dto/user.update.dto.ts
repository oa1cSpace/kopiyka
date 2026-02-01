import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsOptional,
  IsUUID,
  MinLength,
} from 'class-validator';

export class UserUpdateDto {
  @IsUUID('4')
  @ApiProperty({
  example: '5e039a4f-c2ed-4e0c-931d-c90951349419',
  })
  id: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    example: 'John',
  })
  name: string;

  @IsEmail()
  @IsOptional()
  @ApiPropertyOptional({
    example: 'john.doe@mail.com',
  })
  email: string;

  @IsString()
  @MinLength(6)
  @IsOptional()
  @ApiPropertyOptional({
    example: 'MySecretPassword',
  })
  password: string;
}
