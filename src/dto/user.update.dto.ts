import {
  IsString,
  IsEmail,
  IsOptional,
  IsUUID,
  MinLength,
} from 'class-validator';

export class UserUpdateDto {
  @IsUUID()
  id: string;

  @IsString()
  @IsOptional()
  name: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @MinLength(6)
  @IsOptional()
  password: string;
}
