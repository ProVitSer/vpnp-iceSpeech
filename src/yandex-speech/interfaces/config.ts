import { YandexSpeech } from "./interface";
import { YandexSpeechEmotion, YandexSpeechFormat, YandexSpeechLang, YandexSpeechSampleRateHertz, YandexSpeechSpeed, YandexSpeechVoice } from "./types";

export const YandexSpeechDefaultSetting= {
    lang: YandexSpeechLang.RU,
    emotion: YandexSpeechEmotion.good,
    speed: YandexSpeechSpeed.middle,
    format: YandexSpeechFormat.mp3,
    sampleRateHertz: YandexSpeechSampleRateHertz.FortyEight,
}

export const YandexSpeechSettingsMap: { [key in YandexSpeechVoice]?: any} = {}