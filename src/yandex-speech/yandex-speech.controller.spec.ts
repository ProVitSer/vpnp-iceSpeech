import { Test, TestingModule } from '@nestjs/testing';
import { YandexSpeechController } from './yandex-speech.controller';

describe('YandexSpeechController', () => {
  let controller: YandexSpeechController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [YandexSpeechController],
    }).compile();

    controller = module.get<YandexSpeechController>(YandexSpeechController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
