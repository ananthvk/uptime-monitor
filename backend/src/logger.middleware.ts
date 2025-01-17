import { Injectable, NestMiddleware, Logger } from '@nestjs/common';

import { Request, Response, NextFunction } from 'express';

// https://github.com/julien-sarazin/nest-playground/issues/1#issuecomment-682588094
@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, originalUrl } = request;
    response.on('finish', () => {
      const { statusCode } = response;
      const contentLength = response.get('Content-Length') || 0;

      this.logger.log(`[${ip}] ${method} ${originalUrl} ${statusCode} - ${contentLength}`);
    });

    next();
  }
}
