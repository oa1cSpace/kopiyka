import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { HashingService } from '../hashing/hashing.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { IActiveUserData } from '../interfaces/active-user-data.interface';
import { RefreshTokenDto } from './dto/refresch-token.dto';
import {
  InvalidateRefreshTokenError,
  RefreshTokensIdsStorage,
} from './refresh-tokens-ids.storage/refresh-tokens-ids.storage';
import { randomUUID } from 'crypto';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly refreshTokenIdsStorage: RefreshTokensIdsStorage,
  ) {}

  async singup(signupDto: SignUpDto) {
    try {
      const user = new User();
      user.email = signupDto.email;
      user.password = await this.hashingService.hash(signupDto.password);

      await this.userRepository.save(user);
    } catch (error) {
      const pgUniqueViolationErrorCode = '23505'; // TODO: move it into separate file for constants.
      if (error.code === pgUniqueViolationErrorCode) {
        throw new ConflictException();
      }
      throw error;
    }
  }

  async signin(signinDto: SignInDto) {
    const user = await this.userRepository.findOne({
    where: { email: signinDto.email },
    select: {
      id: true,
      email: true,
      password: true,
      salt: true,
    },
  });
    if (!user) {
      throw new UnauthorizedException('user does not exist');
    }
    const isEqual = await this.hashingService.compare(
      signinDto.password,
      user.password,
    );
    if (!isEqual) {
      throw new UnauthorizedException('incorrect credentials');
    }

    return await this.generateTokens(user);
  }

  private async generateTokens(user: User) {
    const refreshTokenId = randomUUID();
    try {
      const [accessToken, refreshToken] = await Promise.all([
        this.signToken<Partial<IActiveUserData>>(
          user.id,
          this.jwtConfiguration.accessTokenTtl,
          { email: user.email },
        ),
        this.signToken(user.id, this.jwtConfiguration.accessTokenTtl, {
          refreshTokenId,
        }),
      ]);

      // insert userId & refreshTokenId into Redis
      await this.refreshTokenIdsStorage.insert(user.id, refreshTokenId);

      return { accessToken, refreshToken };
    } catch (error) {
      if (error instanceof InvalidateRefreshTokenError) {
        throw new InvalidateRefreshTokenError('access denied');
      }
      throw new UnauthorizedException();
    }
  }

  private async signToken<T>(userId: string, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn: expiresIn,
      },
    );
  }

  async refreshToken(refreshToken: RefreshTokenDto): Promise<RefreshTokenDto> {
    try {
      const { sub, refreshTokenId } = await this.jwtService.verifyAsync<
        Pick<IActiveUserData, 'sub'> & { refreshTokenId: string }
      >(refreshToken.refreshToken, {
        secret: this.jwtConfiguration.secret,
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
      });

      const user = await this.userRepository.findOneByOrFail({ id: sub });

      const isValid = await this.refreshTokenIdsStorage.validate(
        user.id,
        refreshTokenId,
      );

      if (isValid) {
        await this.refreshTokenIdsStorage.invalidate(user.id);
      } else {
        throw new UnauthorizedException('Refresh token is invalid');
      }

      return this.generateTokens(user);
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
