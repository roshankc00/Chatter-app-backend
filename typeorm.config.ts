import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { Chat } from 'src/chats/entities/chat.entity';
import { Message } from 'src/messages/entities/message.entity';
import { User } from 'src/users/entities/user.entity';

import { DataSource, DataSourceOptions } from 'typeorm';

config();

const configService = new ConfigService();

export const datasourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: configService.getOrThrow('POSTGRES_HOST'),
  port: configService.getOrThrow('POSTGRES_PORT'),
  username: configService.getOrThrow('POSTGRES_USERNAME'),
  database: configService.getOrThrow('POSTGRES_DATABASE'),
  password: configService.getOrThrow('POSTGRES_PASSWORD'),
  entities: [User, Chat, Message],
  synchronize: true,
  subscribers: [],
};
const dataSource = new DataSource(datasourceOptions);

export default dataSource;
