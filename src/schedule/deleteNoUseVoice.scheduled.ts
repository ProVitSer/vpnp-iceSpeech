import { LoggerService } from "@app/logger/logger.service";
import { UtilsService } from "@app/utils/utils.service";
import { YandexTTSSaveConvertFile } from "@app/yandex-speech/interfaces/interface";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Cron, CronExpression } from "@nestjs/schedule";

@Injectable()
export class DeleteNoUseVoiceScheduleService {
    constructor(
        private readonly logger: LoggerService,
        private readonly utils: UtilsService,
        private readonly configService: ConfigService
      ) {}

    @Cron(CronExpression.EVERY_DAY_AT_1AM)
    async deleteVoiceFile() {
        try{
            if(this.configService.get('deleteNoUseVoice')){
                const voiceDataFiles = (await this.utils.getVoiceFileData()).data.map((voiceDataFiles: YandexTTSSaveConvertFile) => { return voiceDataFiles.saveFileName });
                const voiceFiles = await this.utils.getSaveVoiceFile();
                await Promise.all( voiceFiles.map( async (voiceFile: string) => {
                    if(!voiceDataFiles.includes(voiceFile)){
                        await this.utils.deleteVoiceFile(voiceFile);
                    }
                }))
            }
        }catch(e){
            this.logger.error(`Delete No Use Voice Schedule Error: ${e}`)
        }
    }
}

