import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { exec }  from "child_process";
import { writeFile, readFile } from 'fs/promises';
import { join } from 'path';


@Injectable()
export class YandexSpeechIAMToken implements OnModuleInit {
    private readonly logger = new Logger(YandexSpeechIAMToken.name);
    constructor(
        private readonly configService: ConfigService,
    ){}

    async onModuleInit() {
        const iamToken = await this.refreshIAMToken();
        await this.saveToken(iamToken)
    }

    public async refreshIAMToken(): Promise<string>{
        try {
            let token = await new Promise<string>(function (resolve, reject) {
                exec("yc iam create-token", (error, stdout, stderr) => {
                    if(!!stdout){
                        resolve(stdout)
                    }
                    reject()
                });
            });
            token = token.replace(/\n/g, '');
            await this.saveToken(token);
            this.logger.log(`New token generate: ${token}`)

            return token;
        } catch(e){
            this.logger.error(`Refresh Token error: ${e}`)
            throw e;
        }
    
    }

    public async getIAMToken():Promise<string>{
        const token = JSON.parse((await readFile(`${join(__dirname, '..' , this.configService.get('yandex.tokenFolder'))}/token.json`)).toString())
        return token.iamToken;
    }

    private async saveToken(token: string): Promise<void>{
        await writeFile(`${join(__dirname, '..' ,this.configService.get('yandex.tokenFolder'))}/token.json`, JSON.stringify({ iamToken: token }));
    }
}