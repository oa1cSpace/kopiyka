import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MinLength } from 'class-validator';

export class SignUpDto {
  @IsEmail()
  @ApiProperty({ example: 'john.doe@mail.com' })
  email: string;

  @MinLength(8)
  @ApiProperty({ example: 'MySecretPassword' })
  password: string;
}
