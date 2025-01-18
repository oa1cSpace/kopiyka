import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserCreateDto } from 'src/dto/user.create.dto';
import { UserLoginDto } from 'src/dto/user.login.dto';
import { UserService } from 'src/user/user.service';
import { pbkdf2, randomBytes } from 'crypto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(user: UserCreateDto) {
    const u = await this.userService.isUserExist(user);
    if (u) {
      throw new HttpException('email duplication', HttpStatus.BAD_REQUEST);
    }
    const hashPassword = await this.generatePassword(user.password);
    console.log('hashPassword:', hashPassword);
    const created = await this.userService.create({
      ...user,
      password: hashPassword.hash,
      salt: hashPassword.salt,
    });
    const payload = {
      email: created.email,
      sub: created.id,
    };
    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: await this.generateRefreshToken(created.id),
    };
  }

  async login(user: UserLoginDto) {
    const u = await this.userService.get(user);
    console.log('To login: ', user);
    console.log('IN DB: ', u);
    if (!u?.id) {
      throw new HttpException('user not exists', HttpStatus.BAD_REQUEST);
    }
    const isHashValid = await this.validPassword(
      user.password,
      u.password,
      u.salt,
    );
    console.log('isHashValid? :', isHashValid);
    const payload = { email: u.email, sub: u.id };
    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: await this.generateRefreshToken(u.id),
    };
  }

  async generateRefreshToken(userId: string): Promise<string> {
    const payload = { sub: userId };
    return this.jwtService.signAsync(payload, { expiresIn: '7d' });
  }

  async refreshToken(token: string): Promise<any> {
    console.log('process.env.JWT_SECRET: ', process.env.JWT_SECRET);

    const payload = await this.jwtService.verifyAsync(token, {
      secret: process.env.JWT_SECRET,
    });
    console.log('payload: ', payload);
    const user = await this.userService.get({ id: payload.sub });
    console.log('user: ', user);
    if (!user) {
      throw new Error('User not found');
    }
    return this.login(user);
  }

  async generatePassword(password): Promise<{ salt: string; hash: string }> {
    const salt: string = await new Promise((resolve, reject) => {
      randomBytes(32, (err, buffer) => {
        if (err) {
          return reject(err);
        }
        resolve(buffer.toString('hex'));
      });
    });

    console.log('salt: ', salt);

    const hash: string = await new Promise((resolve, reject) => {
      pbkdf2(password, salt, 10000, 64, 'sha512', (err, derivedKey) => {
        if (err) {
          return reject(err);
        }
        resolve(derivedKey.toString('hex'));
      });
    });

    return { salt, hash };
  }

  async validPassword(password, hash, salt) {
    const checkHash = await new Promise((resolve, reject) => {
      pbkdf2(password, salt, 10000, 64, 'sha512', (err, derivedKey) => {
        if (err) {
          return reject(err);
        }
        resolve(derivedKey.toString('hex'));
      });
    });

    return hash === checkHash;
  }
}
