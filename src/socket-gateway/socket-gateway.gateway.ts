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
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { RedisPubSubService } from 'src/common/pubSub/pubSub.service';
import { MessagesService } from 'src/messages/messages.service';
import { JoinRoomDto } from './dtos/join.room.dto';
import { LeaveRoomDto } from './dtos/leaveRoom';
import { UserMessageDto } from './dtos/user.message.dto';

@ApiTags('SocketGateway')
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
    // Initialization logic with Redis PubSub
  }

  handleConnection(client: Socket, ...args: any[]) {}
  handleDisconnect(client: Socket, ...args: any[]) {}

  @ApiOperation({ summary: 'Join a chat room' })
  @SubscribeMessage('join_room')
  async handleJoinRoom(
    @MessageBody() joinRoomDto: JoinRoomDto,
    @ConnectedSocket() socket: Socket,
  ): Promise<void> {
    const { chatId } = joinRoomDto;
    socket.join(`chat-${chatId}`);
    await this.pubSub.publish(
      'chat_join',
      JSON.stringify({ chatId, socketId: socket.id }),
    );
  }

  @SubscribeMessage('leave_room')
  @ApiOperation({ summary: 'Leave a chat room' })
  async onConversationLeave(
    @MessageBody() leaveRoomDto: LeaveRoomDto,
    @ConnectedSocket() socket: Socket,
  ) {
    const { chatId } = leaveRoomDto;
    socket.leave(`chat-${chatId}`);
    await this.pubSub.publish(
      'chat_leave',
      JSON.stringify({ chatId, socketId: socket.id }),
    );
  }

  @SubscribeMessage('start_typing')
  @ApiOperation({ summary: 'Notify when a user starts typing' })
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
  @ApiOperation({ summary: 'Notify when a user stops typing' })
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
  @ApiOperation({ summary: 'Send a user message' })
  async handleUserMessage(
    @MessageBody() userMessageDto: UserMessageDto,
    @ConnectedSocket() socket: Socket,
  ): Promise<void> {
    const { chatId, content, userId, name } = userMessageDto;
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
  @ApiOperation({ summary: 'Initiate a user call' })
  handleUserCall(
    @MessageBody() { offer, to }: { to: string; offer: any },
    @ConnectedSocket() socket: Socket,
  ): void {
    socket.to(to).emit('incomming_call', { from: socket.id, offer: offer });
  }

  @SubscribeMessage('call_accepted')
  @ApiOperation({ summary: 'Notify when a call is accepted' })
  handleAcceptedCall(
    @MessageBody() { ans, to }: { to: string; ans: any },
    @ConnectedSocket() socket: Socket,
  ): void {
    socket.to(to).emit('call_accepted', { from: socket.id, ans });
  }

  @SubscribeMessage('peer_nego_needed')
  @ApiOperation({ summary: 'Notify when peer negotiation is needed' })
  handleNegoNeeded(
    @MessageBody() { offer, to }: { to: string; offer: any },
    @ConnectedSocket() socket: Socket,
  ): void {
    socket.to(to).emit('peer_nego_needed', { from: socket.id, offer: offer });
  }

  @SubscribeMessage('peer_nego_done')
  @ApiOperation({ summary: 'Notify when peer negotiation is done' })
  handleNegoDone(
    @MessageBody() { ans, to }: { to: string; ans: any },
    @ConnectedSocket() socket: Socket,
  ): void {
    socket.to(to).emit('peer_nego_done', { from: socket.id, ans });
  }
}
