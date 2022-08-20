import {  Module } from '@nestjs/common';
import { YandexSpeechService } from './yandex-speech.service';
import { YandexSpeechController } from './yandex-speech.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [
    ConfigModule,
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
          headers: {
              'User-Agent': 'Backend/1.0.2',
              'Content-Type': 'application/json',
          },
      }),
      inject: [ConfigService],
  })],
  providers: [YandexSpeechService],
  controllers: [YandexSpeechController]
})
export class YandexSpeechModule {}
