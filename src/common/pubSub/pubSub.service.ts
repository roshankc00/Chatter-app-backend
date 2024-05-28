// redis-pubsub.service.ts
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisPubSubService {
  private readonly publisher: Redis;
  private readonly subscriber: Redis;

  constructor() {
    this.publisher = new Redis({
      host: 'localhost',
      port: 6379,
    });
    this.subscriber = new Redis({
      host: 'localhost',
      port: 6379,
    });

    this.subscriber.subscribe('chat_messages');
  }

  async publish(channel: string, message: string): Promise<void> {
    await this.publisher.publish(channel, message);
  }

  onMessage(channel: string, callback: (message: string) => void): void {
    this.subscriber.on('message', (receivedChannel, message) => {
      if (receivedChannel === channel) {
        callback(message);
      }
    });
  }
}
