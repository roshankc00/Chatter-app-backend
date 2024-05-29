import { Process, Processor } from '@nestjs/bull';
import { MEASSAGE_QUEUE } from './constant';
import { Job } from 'bull';
import { CreateMessageDto } from '../messages/dto/create-message.dto';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from 'src/messages/entities/message.entity';
import { Repository, EntityManager } from 'typeorm';

@Processor(MEASSAGE_QUEUE)
export class MessageConsumer {
  private readonly logger = new Logger(MessageConsumer.name);
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    private readonly entityManager: EntityManager,
  ) {}
  @Process()
  async createMessage(job: Job<CreateMessageDto>) {
    const { chatId, content, userId } = job.data;
    const message = new Message({
      chatId,
      content,
      userId,
    });
    return this.entityManager.save(message);
  }
}
