import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { UsersService } from 'src/users/users.service';
import { Chat } from './entities/chat.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class ChatsService {
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(Chat) private readonly chatRepository: Repository<Chat>,
    private readonly entityManager: EntityManager,
  ) {}
  async create(createChatDto: CreateChatDto) {
    const { userIds } = createChatDto;
    const users = await this.usersService.findByIds(userIds);
    const chat = new Chat({
      users: users,
      messages: [],
    });
    return this.entityManager.save(chat);
  }
  findAll() {
    return this.chatRepository.find({
      relations: {
        messages: true,
        users: true,
      },
    });
  }
  findOne(id: number) {
    return this.chatRepository.findOne({
      where: { id },
      relations: {
        messages: true,
        users: true,
      },
    });
  }
  update(id: number, updateChatDto: UpdateChatDto) {
    return `This action updates a #${id} chat`;
  }
}
