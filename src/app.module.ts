import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { YandexSpeechModule } from './yandex-speech/yandex-speech.module';
import configuration from '@app/config/config.provides';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { UtilsModule } from './utils/utils.module';
import { LoggerModule } from './logger/logger.module';
import { AllowedIpMiddleware } from './middleware/allowedIp.middleware';
import { DeleteNoUseVoiceScheduleService } from './schedule/deleteNoUseVoice.scheduled';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports:[ ConfigModule.forRoot({ load: [configuration] }), ScheduleModule.forRoot(), YandexSpeechModule, UtilsModule, LoggerModule],
  controllers: [],
  providers: [Logger, DeleteNoUseVoiceScheduleService],
  exports: [ConfigModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware, AllowedIpMiddleware).forRoutes('*');
  }
}
