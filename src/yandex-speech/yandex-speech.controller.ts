import { Body, Controller, HttpStatus, StreamableFile, Post, Req, Res, UsePipes, ValidationPipe, Get, Query } from '@nestjs/common';
import { YandexSpeechDto } from './dto/yandex-speech.dto';
import { YandexSpeechService } from './yandex-speech.service';
import { Response } from 'express'
import { createReadStream } from 'fs';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';


@Controller('yandex-speech')
export class YandexSpeechController {
    constructor(
        private readonly configService: ConfigService,
        private readonly ya: YandexSpeechService,
    ){}

    @Post('tts')
    @UsePipes(new ValidationPipe())
    async tts( @Body() body: YandexSpeechDto, @Res() res: Response): Promise<any> {
        try {
            const fileName = await this.ya.textToSpeech(body);
            const file = createReadStream(`${join(__dirname, '..' , this.configService.get('projectDir.voiceFileDir'))}${fileName}`);
            file.pipe(res);
        }catch(e){
            throw e;
        } 
    }

    @Get('files')
    async getConvertFiles(  @Res() res: Response): Promise<any> {
        try {
            const response = await this.ya.getAllTTSConvertFiles();
            return res.status(HttpStatus.OK).json(response);
        }catch(e){
            throw e;
        } 
    }

    @Get('files')
    async getConvertFile( @Query('originFileName') originFileName: string, @Res() res: Response): Promise<any> {
        try {
            const fileName = await this.ya.getAllTTSConvertFiles();
            const file = createReadStream(`${join(__dirname, '..' , this.configService.get('projectDir.voiceFileDir'))}${fileName}`);
            file.pipe(res);
        }catch(e){
            throw e;
        } 
    }
}


