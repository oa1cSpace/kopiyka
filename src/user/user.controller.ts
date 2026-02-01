import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
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
import { UserGetRespDto } from 'src/dto/usre.get.resp.dto';
import { ApiBasicAuth, ApiBearerAuth, ApiBody, ApiHeader, ApiResponse } from '@nestjs/swagger';
import { UserUpdateRespDto } from 'src/dto/user.update.resp.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  private readonly logger = new Logger();

  @Get(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiHeader({ name: "Bearer" })
  @ApiResponse({ status: 200, type: UserGetRespDto })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async get(
    @ActiveUser() activeUser: IActiveUserData,
    @Param() params: UserGetDto,
  ): Promise<UserGetRespDto> {
    this.logger.debug(`GET activeUser: `, activeUser);
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
  @ApiHeader({ name: "Bearer" })
  @ApiBody({ type: UserUpdateDto })
  @ApiResponse({ status: 201, type: UserUpdateRespDto })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async update(@Body() user: UserUpdateDto): Promise<UserUpdateRespDto> {
    const updated = this.userService.update(user);
    return plainToInstance(User, updated);
  }

  @Delete(':id')
  @ApiHeader({ name: "Bearer" })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async delete(@Param() params: UserGetDto) {
    const { id } = params;
    await this.userService.delete(id as UUID);
  }
}
