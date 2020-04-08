import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';

@Catch(QueryFailedError, EntityNotFoundError)
export class TypeORMExceptionFilter implements ExceptionFilter {
  catch(
    exception: (QueryFailedError & { code: string }) | EntityNotFoundError,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof EntityNotFoundError) {
      return response.status(404).json({
        statusCode: 404,
        message: 'Not found',
      });
    }

    // Use switch to deal with QueryFailedError
    // switch(exception.code)
  }
}
