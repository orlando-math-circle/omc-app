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
    const message = exception.code
      ? this.getMessage(exception.code)
      : exception.message;

    response.status(400).json({ statusCode: 400, message });
  }

  private getMessage(code: string) {
    switch (code) {
      case '23502':
        return 'SQL not null constraint violation';
      case '23503':
        return 'SQL Foreign Key Constraint Violation';
      case '23505':
        return 'SQL unique constraint violation';
      default:
        return 'SQL constraint violation';
    }
  }
}
