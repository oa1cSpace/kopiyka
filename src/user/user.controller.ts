import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserUpdateDto } from 'src/dto/user.update.dto';
import { UUID } from 'crypto';
import { UserGetDto } from 'src/dto/user.get.dto';
import { User } from 'src/entities/user.entity';
import { plainToInstance } from 'class-transformer';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { IActiveUserData } from 'src/iam/interfaces/active-user-data.interface';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async get(
    @ActiveUser() activeUser: IActiveUserData,
    @Param() params: UserGetDto,
  ): Promise<Partial<User>> {
    console.log('GET user | active user: ', activeUser);
    const { id } = params;
    const user = this.userService.getById(id as UUID);
    return plainToInstance(User, user); // Transform and apply @Exclude()
  }

  // @Post()
  // async create(@Body() user: UserCreateDto): Promise<Partial<User>> {
  //   const newUser = this.userService.create(user);
  //   return plainToInstance(User, newUser);
  // }

  @Patch()
  async update(@Body() user: UserUpdateDto) {
    const updated = this.userService.update(user);
    return plainToInstance(User, updated);
  }

  @Delete(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async delete(@Param() params: UserGetDto) {
    const { id } = params;
    await this.userService.delete(id as UUID);
  }
}
