import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserCreateDto } from 'src/dto/user.create.dto';
import { User } from 'src/entities/user.entity';
import { plainToInstance } from 'class-transformer';
import { UserLoginDto } from 'src/dto/user.login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() user: UserCreateDto): Promise<Partial<User>> {
    const newUser = await this.authService.register(user);
    return plainToInstance(User, newUser);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() user: UserLoginDto) {
    await this.authService.login(user);
  }

  @Post('refresh')
  async refresh(@Body() body: { refreshToken: string }) {
    return this.authService.refreshToken(body.refreshToken);
  }
}
