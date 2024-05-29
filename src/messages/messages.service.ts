import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { User } from 'src/users/entities/user.entity';
import { Message } from './entities/message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { PaginataionDto } from 'src/common/dtos/pagination.dto';
import { FindAllMessageDto } from './dto/findall.dto';
import { Queue } from 'bull';
import { MEASSAGE_QUEUE } from 'src/processors/constant';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class MessagesService {
  constructor(
    @InjectQueue(MEASSAGE_QUEUE) private readonly messageQueue: Queue,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    private readonly entityManager: EntityManager,
  ) {}
  async create(createMessageDto: CreateMessageDto) {
    await this.messageQueue.add(createMessageDto);
  }

  findAll(query: FindAllMessageDto) {
    return this.filter(query);
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

  async filter(query: FindAllMessageDto) {
    const { page, pageSize, chatId } = query;
    const totalItems = await this.messageRepository
      .createQueryBuilder()
      .getCount();
    const totalPages = Math.ceil(totalItems / pageSize);
    if (page && pageSize) {
      const queryBuilder = this.messageRepository.createQueryBuilder('message');
      const skip = (+page - 1) * +pageSize;
      if (chatId) {
        queryBuilder.andWhere('chatId = :chatId', {
          chatId,
        });
      }
      return {
        messages: await queryBuilder
          .leftJoinAndSelect('message.chatRoom', 'chatRoom')
          .leftJoinAndSelect('message.user', 'user')
          .where('chat.id = :chatId', { chatId })
          .skip(+skip)
          .take(+pageSize)
          .getMany(),
        totalPage: totalPages,
        currentPage: +page,
      };
    } else {
      return this.messageRepository
        .createQueryBuilder('message')
        .leftJoinAndSelect('message.chatRoom', 'chatRoom')
        .leftJoinAndSelect('message.user', 'user')
        .getMany();
    }
  }
}
