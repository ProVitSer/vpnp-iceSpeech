import { Injectable } from '@nestjs/common';
import axios, { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { YandexSpeech, YandexSpeechData, YandexTTSSaveConvertFile, YandexTTSSaveConvertFiles } from './interfaces/interface';
import { YandexSpeechDefaultSetting } from './interfaces/config';
import { URLSearchParams } from "url"
import * as fs from 'fs';
import { writeFile, readFile } from 'fs/promises';
import  { AxiosResponse } from 'axios';
import { join } from 'path';
import * as uuid from "uuid";
import * as moment from 'moment';



@Injectable()
export class YandexSpeechService {
    constructor(
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,
    ){}

    public async textToSpeech(data: YandexSpeechData): Promise<string> {
        try {
            return this.getTTSFile(data)
        }catch(e){
            throw e;
        }
    }

    public async getAllTTSConvertFiles(): Promise<YandexTTSSaveConvertFiles>{
        try {
            return await this.getVoicesFilesName();
        }catch(e){
            throw e;
        }
    }

    private async getTTSFile(data: YandexSpeechData): Promise<string> {
        const { fileName, text, voice} = data
        const voiceFile = `${fileName}-${uuid.v4()}.mp3`
        const ttsData: YandexSpeech = {
            text,
            voice,
            ...this.getDefaultSettings(data),
            folderId: this.configService.get('yandex.folderId')
        };
        let queryString = new URLSearchParams({...ttsData}).toString();
        const response =  await this.httpService.post(this.configService.get('yandex.ttsUrl'), queryString ,this.getHeader()).toPromise();
        await this.saveTTSFile(response, voiceFile);
        await this.addVoiceFileName(fileName, voiceFile);
        return voiceFile;
    }

    private async getVoicesFilesName(): Promise<YandexTTSSaveConvertFiles>{
        const files: YandexTTSSaveConvertFiles = JSON.parse((await readFile(`${join(__dirname, '..' , this.configService.get('projectDir.voiceDataDir'))}/voiceFile.json`)).toString());
        return files;
    }


    private async addVoiceFileName(userFileName: string, voiceFile: string){
        const info: YandexTTSSaveConvertFile = {
            originFileName: userFileName,
            saveFileName: voiceFile,
            date: moment().format('YYYY-MM-DDTHH:mm:ss')
        }
        await writeFile(`${join(__dirname, '..' , this.configService.get('projectDir.voiceDataDir'))}/voiceFile.json`, JSON.stringify({ data: [info] }));
    }


    private async saveTTSFile(response: AxiosResponse, voiceFile: string){
        let writer = fs.createWriteStream(`${join(__dirname, '..' , this.configService.get('projectDir.voiceFileDir'))}${voiceFile}`);
        return new Promise((resolve, reject) => {
            response.data.pipe(writer);
            let error = null;

            writer.on('error', err => {
                error = err;
                writer.close();
                reject(err);
              });
              writer.on('close', () => {
                if (!error) {
                  resolve(true);
                }
              });
        })
    }

    private getHeader(): any {
        return {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${this.configService.get('yandex.iamToken')}`,
            },
            responseType: 'stream'
        }
    }

    private getDefaultSettings(data: YandexSpeechData): YandexSpeech {
        const defaultSettings = {};
        Object.keys(YandexSpeechDefaultSetting).forEach((key: any) => {
          (!data.hasOwnProperty(key)) ? defaultSettings[key] = YandexSpeechDefaultSetting[key] : '';
        })
        return defaultSettings as YandexSpeech;

    }
}
