import { LoggerService } from '@app/logger/logger.service';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(
    private readonly logger: LoggerService,
  ){
  }

  use(req: Request, res: Response, next: NextFunction) {
    const { method, statusCode, body,  url } = req;

    this.logger.info({ method, url, statusCode, body});
    next();
  }
}