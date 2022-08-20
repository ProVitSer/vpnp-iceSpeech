import { Test, TestingModule } from '@nestjs/testing';
import { YandexSpeechService } from './yandex-speech.service';

describe('YandexSpeechService', () => {
  let service: YandexSpeechService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [YandexSpeechService],
    }).compile();

    service = module.get<YandexSpeechService>(YandexSpeechService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
