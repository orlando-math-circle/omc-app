import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { JsonWebTokenError } from 'jsonwebtoken';

@Catch(JsonWebTokenError)
export class JsonWebTokenFilter implements ExceptionFilter {
  catch(exception: JsonWebTokenError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const resp = ctx.getResponse<Response>();

    resp.status(400).json({
      statusCode: 400,
      message: exception.message,
    });
  }
}
