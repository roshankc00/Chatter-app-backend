import { Chat } from 'src/chats/entities/chat.entity';
import { AbstractEntity } from 'src/common/database/abstract.entity';
import { Message } from 'src/messages/entities/message.entity';
import { Column, Entity, ManyToMany, OneToMany } from 'typeorm';

@Entity()
export class User extends AbstractEntity<User> {
  @Column()
  name: string;

  @Column({ nullable: true, select: false })
  password: string;

  @Column({ unique: true })
  email: string;

  @OneToMany(() => Message, (mes) => mes.user)
  messages: Message[];

  @ManyToMany(() => Chat, (chat) => chat.users)
  chats: Chat[];

  @Column({ default: false })
  isActive: boolean;
}
