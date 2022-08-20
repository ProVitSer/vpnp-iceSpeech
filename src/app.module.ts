import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { YandexSpeechModule } from './yandex-speech/yandex-speech.module';
import configuration from '@app/config/config.provides';

@Module({
  imports:[ ConfigModule.forRoot({ load: [configuration] }), YandexSpeechModule],
  controllers: [],
  providers: [],
  exports: [ConfigModule],
})
export class AppModule {}
