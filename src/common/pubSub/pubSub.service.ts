// redis-pubsub.service.ts
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import 'dotenv/config';
@Injectable()
export class RedisPubSubService {
  private readonly publisher: Redis;
  private readonly subscriber: Redis;

  constructor() {
    this.publisher = new Redis({
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
    });
    this.subscriber = new Redis({
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
    });

    this.subscriber.subscribe('chat_messages');
    this.subscriber.subscribe('chat_typing');
    this.subscriber.subscribe('chat_join');
    this.subscriber.subscribe('chat_leave');
    this.subscriber.subscribe('user_call');
    this.subscriber.subscribe('call_accepted');
    this.subscriber.subscribe('peer_nego_needed');
    this.subscriber.subscribe('peer_nego_done');
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
