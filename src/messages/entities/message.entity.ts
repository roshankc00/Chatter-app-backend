import { Chat } from 'src/chats/entities/chat.entity';
import { AbstractEntity } from 'src/common/database/abstract.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class Message extends AbstractEntity<Message> {
  @Column()
  content: string;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.messages)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  chatId: number;

  @ManyToOne(() => Chat, (chatRoom) => chatRoom.messages)
  @JoinColumn({ name: 'chatId' })
  chatRoom: Chat;
}
