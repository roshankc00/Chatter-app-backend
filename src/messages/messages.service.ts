import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { User } from 'src/users/entities/user.entity';
import { Message } from './entities/message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    private readonly entityManager: EntityManager,
  ) {}
  create(createMessageDto: CreateMessageDto, user: User) {
    const { chatId, content } = createMessageDto;
    const message = new Message({
      chatId,
      content,
    });
    return this.entityManager.save(message);
  }

  findAll() {
    return this.messageRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.chatRoom', 'chatRoom')
      .leftJoinAndSelect('message.user', 'user')
      .getMany();
  }

  findOne(id: number) {
    return this.messageRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.chatRoom', 'chatRoom')
      .leftJoinAndSelect('message.user', 'user')
      .where('message.id = :messageId', { messageId: id })
      .getOne();
  }

  async update(id: number, updateMessageDto: UpdateMessageDto) {
    const message = await this.messageRepository.findOne({ where: { id } });
    const newMessage = Object.assign(message, updateMessageDto);
    return this.entityManager.save(newMessage);
  }

  async remove(id: number) {
    const messageExist = await this.messageRepository.find({ where: { id } });
    return this.entityManager.remove(messageExist);
  }
}
