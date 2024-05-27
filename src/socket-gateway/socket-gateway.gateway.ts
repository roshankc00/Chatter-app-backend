import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

@WebSocketGateway({
  cors: '*',
})
export class SocketGatewayGateway {
  @WebSocketServer() server;
  @SubscribeMessage('send_message')
  async create(@MessageBody() data: any) {
    await this.server.emit('message', data);
  }
}
