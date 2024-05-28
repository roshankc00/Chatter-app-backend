import { Module } from '@nestjs/common';
import { SocketGatewayGateway } from './socket-gateway.gateway';
import { MessagesModule } from 'src/messages/messages.module';
import { RedisPubSubService } from 'src/common/pubSub/pubSub.service';

@Module({
  imports: [MessagesModule],
  providers: [SocketGatewayGateway, RedisPubSubService],
})
export class SocketGatewayModule {}
