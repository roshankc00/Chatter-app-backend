import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomLoggerModule } from './common/logger/logger.module';
import { DatabaseModule } from './common/database/database.module';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PassportModule.register({ session: true }),
    DatabaseModule,
    CustomLoggerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
