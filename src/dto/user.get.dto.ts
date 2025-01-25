import { IsUUID } from 'class-validator';

export class UserGetDto {
  @IsUUID('4')
  id: string;
}
