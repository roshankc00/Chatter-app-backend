import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CURSOR_FLAGS, EntityManager, Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly entityManager: EntityManager,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const { email, name, password } = createUserDto;
    const userExist = await this.usersRepository.findOne({
      where: { email },
    });
    if (userExist) {
      throw new BadRequestException();
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      password: hashedPassword,
      name,
    });
    return this.entityManager.save(newUser);
  }

  findAll() {
    return this.usersRepository.find({});
  }

  findOne(id: number) {
    return this.existUser(id);
  }

  async remove(id: number) {
    const user = await this.existUser(id);
    user.isActive = false;
    return this.usersRepository.save(user);
  }

  private async existUser(id: number) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  async validateUserGoogle(email: string, name: string) {
    const userExist = await this.usersRepository.findOne({
      where: { email },
    });
    if (userExist) {
      return userExist;
    } else {
      const newUser = new User({
        email,
        name,
      });
      return this.entityManager.save(newUser);
    }
  }

  async validate(email: string, password: string) {
    const userexist = await this.usersRepository.findOne({
      where: {
        email,
      },
      select: {
        password: true,
        id: true,
      },
    });
    if (!userexist) {
      throw new BadRequestException('User with this email doesnt exists');
    } else {
      const isPasswordCorrect = await bcrypt.compare(
        password,
        userexist.password,
      );
      if (!isPasswordCorrect) {
        throw new BadRequestException('Invalid creadentials');
      }

      return {
        id: userexist.id,
      };
    }
  }
}
