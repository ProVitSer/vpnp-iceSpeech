import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { writeFile, readFile, unlink, readdir } from 'fs/promises';
import { join } from 'path';
import { access, constants, createReadStream, createWriteStream } from 'fs';
import { YandexTTSSaveConvertFile, YandexTTSSaveConvertFiles } from '@app/yandex-speech/interfaces/interface';


@Injectable()
export class UtilsService {
    constructor(
        private readonly configService: ConfigService
    ){}

    public async initProjectFile(){
        const filePathName = `${join(__dirname, '..' , this.configService.get('projectDir.voiceDataDir'))}/voiceFile.json`
        const isExists = await this.exists(filePathName);
        if(!isExists){
            await writeFile(filePathName, JSON.stringify({ data: [] }));
        }
    }

    public async exists (path: string): Promise<boolean> { 
        return new Promise((resolve) => {
            access(path, constants.F_OK, error  => {
                if (error) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            })
        }) 
    }

    public readStreamVoiceFile(fileName: string){
        return createReadStream(`${join(__dirname, '..' , this.configService.get('projectDir.voiceFileDir'))}${fileName}`);
    }

    public writeStreamVoiceFile(fileName: string){
        return createWriteStream(`${join(__dirname, '..' , this.configService.get('projectDir.voiceFileDir'))}${fileName}`);
    }

    public async writeToVoiceFileData(newData: YandexTTSSaveConvertFile[]){
        writeFile(`${join(__dirname, '..' , this.configService.get('projectDir.voiceDataDir'))}/voiceFile.json`, JSON.stringify({ data: newData }));
    }

    public async getVoiceFileData(): Promise<YandexTTSSaveConvertFiles>{
        return JSON.parse((await readFile(`${join(__dirname, '..' , this.configService.get('projectDir.voiceDataDir'))}/voiceFile.json`)).toString());
    }
    
    public async deleteVoiceFile(fileName: string){
        return await unlink(`${join(__dirname, '..' , this.configService.get('projectDir.voiceFileDir'))}${fileName}`)
    }

    public async getSaveVoiceFile(){
        return await readdir(`${join(__dirname, '..' , this.configService.get('projectDir.voiceFileDir'))}`)
    }
}
