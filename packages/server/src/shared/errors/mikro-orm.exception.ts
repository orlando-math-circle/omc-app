import {
  ForeignKeyConstraintViolationException,
  NotNullConstraintViolationException,
  ServerException,
  UniqueConstraintViolationException,
} from '@mikro-orm/core';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';

/**
 * Exception filter for the MikroORM library to catch constraint
 * violations and inform the user through a 400 BadRequest error.
 */

@Catch(
  UniqueConstraintViolationException,
  NotNullConstraintViolationException,
  ForeignKeyConstraintViolationException,
)
export class MikroORMConstraintExceptionFilter implements ExceptionFilter {
  catch(exception: ServerException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception.code) {
      const message = this.getMessage(exception.code);
      const statusCode = this.getStatusCode(exception.code);

      return response
        .status(statusCode)
        .json({ statusCode, message, exception });
    }

    response.status(400).json({
      statusCode: 400,
      message: exception.message,
      exception,
    });
  }

  private getMessage(code: string) {
    switch (code) {
      case '23502':
        return 'SQL not null constraint violation';
      case '23503':
        return 'SQL foreign key constraint violation';
      case '23505':
        return 'SQL unique constraint violation';
      default:
        return 'SQL constraint violation';
    }
  }

  private getStatusCode(code: string) {
    switch (code) {
      case '23505':
        return 409;
      default:
        return 400;
    }
  }
}
