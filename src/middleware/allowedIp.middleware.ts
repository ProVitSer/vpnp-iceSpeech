import e, { Request, Response, NextFunction } from "express";
import { Injectable, NestMiddleware, HttpException, HttpStatus, UseFilters } from "@nestjs/common";
import * as requestIp from 'request-ip';
import { ConfigService } from "@nestjs/config";
import { LoggerService } from "@app/logger/logger.service";

@Injectable()
export class AllowedIpMiddleware implements NestMiddleware {
    constructor(
        private readonly configService: ConfigService,
      ){}

    use(request: Request, response: Response, next: NextFunction): any {
        try {
            const ip = requestIp.getClientIp(request)
            const allowedIp = this.configService.get("security.ipWhiteList");
            if (!!allowedIp && allowedIp != '*' && !allowedIp.includes(ip)) {
                throw `Запросы с IP ${ip} не допустимы`;
            }
            next();
        } catch(e){
            next(new HttpException(e, HttpStatus.FORBIDDEN))
        }
    }
}
