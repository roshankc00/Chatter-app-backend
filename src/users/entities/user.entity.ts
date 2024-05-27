import { AbstractEntity } from 'src/common/database/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class User extends AbstractEntity<User> {
  @Column()
  name: string;

  @Column({ nullable: true, select: false })
  password: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: false })
  isActive: boolean;
}
