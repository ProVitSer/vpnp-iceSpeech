import { IsEnum , IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { YandexSpeechEmotion, YandexSpeechSampleRateHertz, YandexSpeechSpeed, YandexSpeechVoice } from '../interfaces/types';

export class YandexSpeechDto  {
    @IsString()
    @IsNotEmpty()
    fileName: string;

    @IsString()
    @IsNotEmpty()
    text: string;

    @IsString()
    @IsNotEmpty()
    @IsEnum(YandexSpeechVoice)
    voice: YandexSpeechVoice;

    @IsString()
    @IsNotEmpty()
    @IsEnum(YandexSpeechEmotion)
    @IsOptional()
    emotion?: YandexSpeechEmotion;

    @IsString()
    @IsNotEmpty()
    @IsEnum(YandexSpeechSpeed)
    @IsOptional()
    speed?: YandexSpeechSpeed;

    @IsString()
    @IsNotEmpty()
    @IsEnum(YandexSpeechSampleRateHertz)
    @IsOptional()
    sampleRateHertz?: YandexSpeechSampleRateHertz;
}