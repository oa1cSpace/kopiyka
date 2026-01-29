import { Body, Controller, HttpCode, HttpStatus, Logger, Post } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { Auth } from './decorators/auth.decorator';
import { AuthType } from './enums/auth-type.enum';
import { ActiveUser } from '../decorators/active-user.decorator';
import { RefreshTokenDto } from './dto/refresch-token.dto';

@Auth(AuthType.None) // to set full controller public available
@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}
  private readonly logger = new Logger();

  @Post('sign-up')
  singUp(@Body() signUpDto: SignUpDto) {
    return this.authService.singup(signUpDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  signIn(@ActiveUser() activeUser, @Body() signInDto: SignInDto) {
    this.logger.debug(`activeUser: ${activeUser}`)
    return this.authService.signin(signInDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh-token')
  refreshToken(@Body() body: RefreshTokenDto) {
    return this.authService.refreshToken(body);
  }

  // cookies realization
  // @HttpCode(HttpStatus.OK)
  // @Post('sign-in')
  // async signIn(
  //   @Res({ passthrough: true }) response: Response,
  //   @Body() signInDto: SignInDto,
  // ) {
  //   const accessToken = await this.authService.signin(signInDto);
  //   response.cookie('accessToken', accessToken, {
  //     httpOnly: true,
  //     sameSite: true,
  //     secure: true,
  //   });
  // }
}
