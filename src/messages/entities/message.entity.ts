import { Chat } from 'src/chats/entities/chat.entity';
import { AbstractEntity } from 'src/common/database/abstract.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class Message extends AbstractEntity<Message> {
  @Column()
  content: string;

  @ManyToOne(() => User, (user) => user.messages)
  user: User;

  @Column()
  chatId: number;

  @ManyToOne(() => Chat, (chatRoom) => chatRoom.messages)
  @JoinColumn({ name: 'chatRoomId' })
  chatRoom: Chat;
}
