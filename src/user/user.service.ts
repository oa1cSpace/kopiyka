import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UUID } from 'crypto';
import { UserCreateDto } from 'src/dto/user.create.dto';
import { UserUpdateDto } from 'src/dto/user.update.dto';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async get(user: Partial<User>): Promise<User | null> {
    const { id, name, email } = user;

    if (!id && !name && !email) {
      throw new Error(
        'At least one criterion (id, name, email) must be provided',
      );
    }
    return this.userRepository.findOne({
      where: [
        { id },
        { name }, // Matches by name if provided
        { email },
      ],
    }); // TODO: find where - id, name, email
  }

  async getById(id: UUID): Promise<User | null> {
    return this.userRepository.findOneBy({ id: id });
  }

  async create(user: UserCreateDto): Promise<User> {
    console.log('create user: ', user);
    const u = await this.isUserExist(user);
    if (u) {
      throw new HttpException('email duplication', HttpStatus.BAD_REQUEST);
    }
    return this.userRepository.save(user);
  }

  async update(user: UserUpdateDto): Promise<User> {
    const u = await this.isUserExist(user);
    if (!u) {
      throw new HttpException('no such user', HttpStatus.BAD_REQUEST);
    }
    return this.userRepository.save(user);
  }

  async delete(id: UUID) {
    const u = await this.isUserExist({ id });
    if (!u) {
      throw new HttpException('no such user', HttpStatus.BAD_REQUEST);
    }
    await this.userRepository.delete(id);
  }

  async isUserExist(user: Partial<User>): Promise<Boolean> {
    const u = await this.get(user);
    return u?.id ? true : false;
  }
}
