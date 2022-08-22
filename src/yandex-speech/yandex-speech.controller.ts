import { Body, Controller, HttpStatus, Post, Res, UsePipes, ValidationPipe, Get, Delete } from '@nestjs/common';
import { YandexSpeechDto } from './dto/yandex-speech.dto';
import { YandexSpeechService } from './yandex-speech.service';
import { Response } from 'express'
import { YandexSpeechFileDto } from './dto/yandex-speech-file.dto';
import { UtilsService } from '@app/utils/utils.service';


@Controller('yandex-speech')
export class YandexSpeechController {
    constructor(
        private readonly ya: YandexSpeechService,
        private readonly utils: UtilsService,
    ){}

    @Post('tts')
    @UsePipes(new ValidationPipe())
    async tts( @Body() body: YandexSpeechDto, @Res() res: Response): Promise<any> {
        try {
            const fileName = await this.ya.textToSpeech(body);
            const file = this.utils.readStreamVoiceFile(fileName);
            file.pipe(res);
        }catch(e){
            throw e;
        } 
    }

    @Get('files')
    async getConvertFiles( @Res() res: Response): Promise<any> {
        try {
            const response = await this.ya.getAllTTSConvertFiles();
            return res.status(HttpStatus.OK).json(response);
        }catch(e){
            throw e;
        } 
    }

    @Post('file')
    @UsePipes(new ValidationPipe())
    async getConvertFile( @Body() body: YandexSpeechFileDto, @Res() res: Response): Promise<any> {
        try {
            const fileName = await this.ya.getTTSConvertFile(body.originFileName);
            if(!!fileName.length){
                const file = this.utils.readStreamVoiceFile(fileName);
                file.pipe(res);
            } else {
                return res.status(HttpStatus.NOT_FOUND).json();
            }
        }catch(e){
            throw e;
        } 
    }

    @Delete('file')
    @UsePipes(new ValidationPipe())
    async deleteFile( @Body() body: YandexSpeechFileDto, @Res() res: Response): Promise<any> {
        try {
            const response = await this.ya.deleteTTSConvertFile(body.originFileName);
            return res.status(HttpStatus.OK).json(response);
        }catch(e){
            throw e;
        } 
    }
}


