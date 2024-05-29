import { Module } from '@nestjs/common';
import { CustomLoggerModule } from './common/logger/logger.module';
import { DatabaseModule } from './common/database/database.module';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ChatsModule } from './chats/chats.module';
import { MessagesModule } from './messages/messages.module';
import { SocketGatewayModule } from './socket-gateway/socket-gateway.module';
import { BullModule } from '@nestjs/bull';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
        },
      }),
      inject: [ConfigService],
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
