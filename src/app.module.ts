import { Module } from '@nestjs/common';
import { CustomLoggerModule } from './common/logger/logger.module';
import { DatabaseModule } from './common/database/database.module';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ChatsModule } from './chats/chats.module';
import { MessagesModule } from './messages/messages.module';
import { SocketGatewayModule } from './socket-gateway/socket-gateway.module';
import { BullModule } from '@nestjs/bull';
import { MEASSAGE_QUEUE } from './processors/constant';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    PassportModule.register({ session: true }),
    DatabaseModule,
    CustomLoggerModule,
    AuthModule,
    UsersModule,
    ChatsModule,
    MessagesModule,
    SocketGatewayModule,
  ],
})
export class AppModule {}
