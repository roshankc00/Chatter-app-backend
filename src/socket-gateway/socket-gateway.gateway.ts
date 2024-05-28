import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RedisPubSubService } from 'src/common/pubSub/pubSub.service';
import { MessagesService } from 'src/messages/messages.service';

@WebSocketGateway({
  cors: '*',
})
export class SocketGatewayGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  constructor(
    private readonly messageService: MessagesService,
    private readonly pubSub: RedisPubSubService,
  ) {}
  onModuleInit() {
    this.pubSub.onMessage('chat_messages', (message: string) => {
      this.server.emit('messages', JSON.parse(message));
    });
  }

  handleConnection(client: Socket, ...args: any[]) {}
  handleDisconnect(client: Socket, ...args: any[]) {}
  @SubscribeMessage('join_room')
  handleJoinRoom(
    @MessageBody()
    { chatId }: { chatId: number },
    @ConnectedSocket() socket: Socket,
  ): void {
    this.server
      .to(`chat-${chatId}`)
      .emit('user_joined', { chatId, id: socket.id });
    this.server
      .to(`chat-${chatId}`)
      .emit('user_joined', { chatId, id: socket.id });
    socket.join(`chat-${chatId}`);
  }

  @SubscribeMessage('leave_room')
  onConversationLeave(
    @MessageBody() data: any,
    @ConnectedSocket() socket: Socket,
  ) {
    socket.leave(`chat-${data.roomId}`);
    socket.to(`chat-${data.chatId}`).emit('userLeave');
  }

  @SubscribeMessage('start_typing')
  onTypingStart(
    @MessageBody()
    { chatId, name, userId }: { chatId: number; userId: number; name: string },
    @ConnectedSocket() socket: Socket,
  ) {
    socket.to(`chat-${chatId}`).emit('chat_typing', {
      typing: true,
      chatId,
      name,
      userId,
    });
  }

  @SubscribeMessage('end_typing')
  onTypingStop(
    @MessageBody()
    { chatId, name, userId }: { chatId: number; userId: number; name: string },
    @ConnectedSocket() socket: Socket,
  ) {
    socket.to(`chat-${chatId}`).emit('chat_typing', {
      typing: true,
      chatId,
      name,
      userId,
    });
  }

  @SubscribeMessage('user_message')
  async handleUserMessage(
    @MessageBody()
    {
      chatId,
      content,
      userId,
      name,
    }: { chatId: number; content: string; userId: number; name: string },
    @ConnectedSocket() socket: Socket,
  ): Promise<void> {
    await this.pubSub.publish(
      'chat_messages',
      JSON.stringify({ chatId, content, userId }),
    );
    await this.messageService.create({
      chatId,
      content,
      userId,
    });
  }

  @SubscribeMessage('user_call')
  handleUserCall(
    @MessageBody() { offer, to }: { to: string; offer: any },
    @ConnectedSocket() socket: Socket,
  ): void {
    socket.to(to).emit('incomming_call', { from: socket.id, offer: offer });
  }

  @SubscribeMessage('call_accepted')
  handleAcceptedCall(
    @MessageBody() { ans, to }: { to: string; ans: any },
    @ConnectedSocket() socket: Socket,
  ): void {
    socket.to(to).emit('call_accepted', { from: socket.id, ans });
  }

  @SubscribeMessage('peer_nego_needed')
  handleNegoNeeded(
    @MessageBody() { offer, to }: { to: string; offer: any },
    @ConnectedSocket() socket: Socket,
  ): void {
    socket.to(to).emit('peer_nego_needed', { from: socket.id, offer: offer });
  }

  @SubscribeMessage('peer_nego_done')
  handleNegoDone(
    @MessageBody() { ans, to }: { to: string; ans: any },
    @ConnectedSocket() socket: Socket,
  ): void {
    socket.to(to).emit('peer_nego_done', { from: socket.id, ans });
  }
}
