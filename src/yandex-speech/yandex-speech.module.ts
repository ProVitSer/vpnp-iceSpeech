import { Module } from '@nestjs/common';
import { YandexSpeechService } from './yandex-speech.service';
import { YandexSpeechController } from './yandex-speech.controller';

@Module({
  providers: [YandexSpeechService],
  controllers: [YandexSpeechController]
})
export class YandexSpeechModule {}
