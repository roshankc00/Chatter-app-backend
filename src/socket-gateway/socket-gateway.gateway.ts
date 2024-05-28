import { UseGuards } from '@nestjs/common';
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
import { JWtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
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
      const { chatId, content, userId, name } = JSON.parse(message);
      this.server
        .to(`chat-${chatId}`)
        .emit('messages', { chatId, content, userId, name });
    });

    this.pubSub.onMessage('chat_typing', (message: string) => {
      const { chatId, typing, name, userId } = JSON.parse(message);
      this.server
        .to(`chat-${chatId}`)
        .emit('chat_typing', { typing, chatId, name, userId });
    });

    this.pubSub.onMessage('chat_join', (message: string) => {
      const { chatId, socketId } = JSON.parse(message);
      this.server
        .to(`chat-${chatId}`)
        .emit('user_joined', { chatId, id: socketId });
    });

    this.pubSub.onMessage('chat_leave', (message: string) => {
      const { chatId, socketId } = JSON.parse(message);
      this.server
        .to(`chat-${chatId}`)
        .emit('user_leave', { chatId, id: socketId });
    });

    this.pubSub.onMessage('user_call', (message: string) => {
      const { offer, from, to } = JSON.parse(message);
      this.server.to(to).emit('incoming_call', { from, offer });
    });

    this.pubSub.onMessage('call_accepted', (message: string) => {
      const { ans, from, to } = JSON.parse(message);
      this.server.to(to).emit('call_accepted', { from, ans });
    });

    this.pubSub.onMessage('peer_nego_needed', (message: string) => {
      const { offer, from, to } = JSON.parse(message);
      this.server.to(to).emit('peer_nego_needed', { from, offer });
    });

    this.pubSub.onMessage('peer_nego_done', (message: string) => {
      const { ans, from, to } = JSON.parse(message);
      this.server.to(to).emit('peer_nego_done', { from, ans });
    });
  }

  handleConnection(client: Socket, ...args: any[]) {}
  handleDisconnect(client: Socket, ...args: any[]) {}

  @SubscribeMessage('join_room')
  async handleJoinRoom(
    @MessageBody() { chatId }: { chatId: number },
    @ConnectedSocket() socket: Socket,
  ): Promise<void> {
    socket.join(`chat-${chatId}`);
    await this.pubSub.publish(
      'chat_join',
      JSON.stringify({ chatId, socketId: socket.id }),
    );
  }

  @SubscribeMessage('leave_room')
  async onConversationLeave(
    @MessageBody() { chatId }: { chatId: number },
    @ConnectedSocket() socket: Socket,
  ) {
    socket.leave(`chat-${chatId}`);
    await this.pubSub.publish(
      'chat_leave',
      JSON.stringify({ chatId, socketId: socket.id }),
    );
  }

  @SubscribeMessage('start_typing')
  async onTypingStart(
    @MessageBody()
    { chatId, name, userId }: { chatId: number; userId: number; name: string },
    @ConnectedSocket() socket: Socket,
  ) {
    await this.pubSub.publish(
      'chat_typing',
      JSON.stringify({ typing: true, chatId, name, userId }),
    );
  }

  @SubscribeMessage('end_typing')
  async onTypingStop(
    @MessageBody()
    { chatId, name, userId }: { chatId: number; userId: number; name: string },
    @ConnectedSocket() socket: Socket,
  ) {
    await this.pubSub.publish(
      'chat_typing',
      JSON.stringify({ typing: false, chatId, name, userId }),
    );
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
      JSON.stringify({ chatId, content, userId, name }),
    );
    const me = await this.messageService.create({
      chatId,
      content,
      userId,
    });
    console.log(me);
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
