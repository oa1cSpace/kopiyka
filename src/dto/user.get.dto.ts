import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class UserGetDto {
  @ApiProperty({
    description: 'user id',
    example: '5e039a4f-c2ed-4e0c-931d-c90951349419',
  })
  @IsUUID('4')
  id: string;
}
