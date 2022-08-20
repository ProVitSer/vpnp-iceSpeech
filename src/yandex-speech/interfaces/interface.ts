import { YandexSpeechEmotion, YandexSpeechFormat, YandexSpeechLang, YandexSpeechSampleRateHertz, YandexSpeechSpeed, YandexSpeechVoice } from "./types";

export interface YandexSpeechData {
    fileName: string;
    text: string;
    voice: YandexSpeechVoice;
}

export interface YandexSpeech {
    text?: string;
    ssml?: string;
    lang: YandexSpeechLang;
    voice: YandexSpeechVoice;
    emotion: YandexSpeechEmotion;
    speed: YandexSpeechSpeed;
    format: YandexSpeechFormat;
    sampleRateHertz: YandexSpeechSampleRateHertz;
    folderId: string;
}

export interface YandexTTSSaveConvertFiles {
    data: YandexTTSSaveConvertFile[];
}

export interface YandexTTSSaveConvertFile {
    originFileName: string;
    saveFileName: string;
    date: string
}