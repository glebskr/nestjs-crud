import { Repository, EntityRepository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp({ userName, password }: AuthCredentialsDto): Promise<void> {
    const user = new User();
    const salt = await bcrypt.genSalt(10);

    user.userName = userName;
    user.salt = salt;
    user.password = await this.hashPassword(password, salt);

    try {
      await user.save();
    } catch (err) {
      if (err.code === '23505')
        throw new ConflictException('Username already exists');
      else {
        throw new InternalServerErrorException();
      }
    }
  }

  async validateUserPassword(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<string> {
    const { userName, password } = authCredentialsDto;
    const user = await this.findOne({ userName });

    if (user && (await user.validatePassword(password))) {
      return userName;
    } else {
      return null;
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
