import { Module, OnModuleInit } from '@nestjs/common';
import { YandexSpeechService } from './yandex-speech.service';
import { YandexSpeechController } from './yandex-speech.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from "@nestjs/axios";
import axios, { HttpService } from '@nestjs/axios';
import { YandexSpeechIAMToken } from './yandex-speech-iamtoken';
import { UtilsModule } from '@app/utils/utils.module';

@Module({
  imports: [
    ConfigModule,
    UtilsModule,
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
          timeout: 5000,
          maxRedirects: 2,
          baseURL: configService.get('yandex.ttsUrl'),
          headers: {
              'User-Agent': 'Backend/1.0.2',
              'Content-Type': 'application/json',
          },
      }),
      inject: [ConfigService],
  })],
  providers: [YandexSpeechService, YandexSpeechIAMToken],
  controllers: [YandexSpeechController]
})
export class YandexSpeechModule{}
