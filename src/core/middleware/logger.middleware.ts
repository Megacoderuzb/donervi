import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, headers, body } = req;
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      method,
      originalUrl,
      authentication: headers.authorization || 'Not Authenticated',
      body,
      userAgent: req.headers['user-agent'],
    };

    const logsFolderPath = path.resolve(process.cwd(), 'logs');
    const logFileName = `${new Date().toISOString().split('T')[0]}.json`;
    const logFilePath = path.join(logsFolderPath, logFileName);

    if (!fs.existsSync(logsFolderPath)) {
      fs.mkdirSync(logsFolderPath, { recursive: true });
    }

    const logData = JSON.stringify(logEntry, null, 2);
    if (!fs.existsSync(logFilePath)) {
      fs.writeFileSync(logFilePath, `[${logData}\n]`);
    } else {
      const fileContent = fs.readFileSync(logFilePath, 'utf8');
      const updatedContent = fileContent.replace(/\n]$/, `,\n${logData}\n]`);
      fs.writeFileSync(logFilePath, updatedContent);
    }

    next();
  }
}
