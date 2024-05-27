import { AbstractEntity } from 'src/common/database/abstract.entity';
import { Message } from 'src/messages/entities/message.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToMany, OneToMany } from 'typeorm';

@Entity()
export class Chat extends AbstractEntity<Chat> {
  @OneToMany(() => Message, (mes) => mes.chatRoom)
  messages: Message[];

  @ManyToMany(() => User, (user) => user.chats)
  users: User[];
}
