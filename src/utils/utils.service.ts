import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { writeFile, readFile } from 'fs/promises';
import { join } from 'path';
import { access, constants } from 'fs';


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
}
