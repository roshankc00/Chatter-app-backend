import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { MessageConsumer } from 'src/processors/message.consumer';
import { BullModule } from '@nestjs/bull';
import { MEASSAGE_QUEUE } from 'src/processors/constant';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message]),
    BullModule.registerQueue({
      name: MEASSAGE_QUEUE,
    }),
  ],
  controllers: [MessagesController],
  providers: [MessagesService, MessageConsumer],
  exports: [MessagesService],
})
export class MessagesModule {}
