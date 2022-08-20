import { IsNotEmpty, IsString } from "class-validator";

export class YandexSpeechFileDto  {
    @IsString()
    @IsNotEmpty()
    originFileName: string;
}