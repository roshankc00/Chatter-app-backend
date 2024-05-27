import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
@Module({
  imports: [
    LoggerModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const isProduction = configService.get('NODE_ENV') === 'production';
        return {
          pinoHttp: {
            transport: isProduction
              ? undefined
              : {
                  target: 'pino-pretty',
                  options: {
                    singleLine: true,
                  },
                  levels: isProduction ? 'info' : 'debug',
                },
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class CustomLoggerModule {}
