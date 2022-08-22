import { HttpStatus, Injectable, OnModuleInit } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { YandexSpeech, YandexSpeechData, YandexTTSSaveConvertFile, YandexTTSSaveConvertFiles } from './interfaces/interface';
import { YandexSpeechDefaultSetting } from './interfaces/config';
import { URLSearchParams } from "url"
import  { AxiosResponse, AxiosError } from 'axios';
import * as uuid from "uuid";
import * as moment from 'moment';
import { YandexSpeechIAMToken } from './yandex-speech-iamtoken';
import { UtilsService } from '@app/utils/utils.service';
import { LoggerService } from '@app/logger/logger.service';



@Injectable()
export class YandexSpeechService implements OnModuleInit{

    constructor(
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,
        private readonly iamToken: YandexSpeechIAMToken,
        private readonly utils: UtilsService,
        private readonly logger: LoggerService
    ){
        const axios = this.httpService.axiosRef;
        const iam = this.iamToken;
        const log =  this.logger;
        this.httpService.axiosRef.interceptors.response.use((response: AxiosResponse) => {
            return response;
          }, async function (error: AxiosError) {
            const originalRequest = error.config;

            try {
                if (error.response.status === HttpStatus.UNAUTHORIZED) {
                    log.error(`Token expire: ${originalRequest.headers['Authorization']}  start refresh`)
                    const iamToken = await iam.refreshIAMToken();
                    originalRequest.headers['Authorization'] = `Bearer ${iamToken}`;
                    return axios.request(originalRequest);
                }
            } catch(e){
                
                return Promise.reject(error);
            }
            return Promise.reject(error);
          })
    }
    async onModuleInit() {
        await this.utils.initProjectFile();
    }

    public async textToSpeech(data: YandexSpeechData): Promise<string> {
        try {
            return this.getTTSFile(data)
        }catch(e){
            this.logger.error(`Error convert text to voice file: ${e}`)
            throw e;
        }
    }

    public async getAllTTSConvertFiles(): Promise<YandexTTSSaveConvertFiles>{
        try {
            return await this.getVoicesFilesName();
        }catch(e){
            this.logger.error(`Error get all convert files from voiceDataDir: ${e}`)
            throw e;
        }
    }

    public async getTTSConvertFile(fileName: string): Promise<string>{
        try {
            const files = await this.getVoicesFilesName();
            const fileInfo =  files.data.filter((file: YandexTTSSaveConvertFile) => {
                return (file.originFileName == fileName);
            });
            return (fileInfo.length != 0)? fileInfo[0].saveFileName :  "";
        }catch(e){
            this.logger.error(`Error get all convert files from voiceDataDir: ${e}`)
            throw e;
        }
    }

    public async deleteTTSConvertFile(fileName: string): Promise<any>{
        try {
            const files = await this.getVoicesFilesName();
            const newFiles = files.data.filter((file: YandexTTSSaveConvertFile) => file.originFileName != fileName)
            await this.utils.writeToVoiceFileData(newFiles);
        } catch(e){
            this.logger.error(`Error delete file from voiceDataDir: ${e}`)
            throw e;
        }
    }

    private async getTTSFile(data: YandexSpeechData): Promise<string> {
        const { fileName, text, voice } = data
        const voiceFile = `${fileName}-${uuid.v4()}.mp3`
        const ttsData: YandexSpeech = {
            text,
            voice,
            ...this.getDefaultSettings(data),
            folderId: this.configService.get('yandex.folderId')
        };
        let queryString = new URLSearchParams({...ttsData}).toString();
        const response =  await this.httpService.post(this.configService.get('yandex.ttsUrl'), queryString, await this.getHeader()).toPromise();
        await this.saveTTSFile(response, voiceFile);
        await this.addVoiceFileName(fileName, voiceFile);
        return voiceFile;
    }

    private async getVoicesFilesName(): Promise<YandexTTSSaveConvertFiles>{
        const files: YandexTTSSaveConvertFiles = await this.utils.getVoiceFileData();
        return files;
    }


    private async addVoiceFileName(userFileName: string, voiceFile: string){
        const info: YandexTTSSaveConvertFile = {
            originFileName: await this.checkFileName(userFileName),
            saveFileName: voiceFile,
            date: moment().format('YYYY-MM-DD HH:mm:ss')
        }
        const files = await this.getVoicesFilesName();
        files.data.push(info)
        await this.utils.writeToVoiceFileData(files.data);;
    }

    private async checkFileName(userFileName: string): Promise<string>{
        const isFileNameExist = await this.getTTSConvertFile(userFileName);
        return (!!isFileNameExist) ? `${userFileName}-${moment().format('HH:mm:ss')}` : userFileName;
    }

    private async saveTTSFile(response: AxiosResponse, voiceFile: string){
        let writer = this.utils.writeStreamVoiceFile(voiceFile);
        return new Promise((resolve, reject) => {
            response.data.pipe(writer);
            let error = null;

            writer.on('error', err => {
                error = err;
                writer.close();
                this.logger.error(`Write file error: ${error}`)
                reject(err);
              });
              writer.on('close', () => {
                if (!error) {
                  resolve(true);
                }
              });
        })
    }

    private async getHeader(): Promise<any> {
        const token = await this.iamToken.getIAMToken();
        return {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${token}`,
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

