import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { YandexSpeechModule } from './yandex-speech/yandex-speech.module';
import configuration from '@app/config/config.provides';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { UtilsModule } from './utils/utils.module';

@Module({
  imports:[ ConfigModule.forRoot({ load: [configuration] }), YandexSpeechModule, UtilsModule],
  controllers: [],
  providers: [Logger],
  exports: [ConfigModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
