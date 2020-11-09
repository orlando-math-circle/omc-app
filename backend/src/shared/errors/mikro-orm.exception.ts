import {
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

@Catch(UniqueConstraintViolationException, NotNullConstraintViolationException)
export class MikroORMConstraintExceptionFilter implements ExceptionFilter {
  catch(exception: ServerException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response
      .status(400)
      .json({ statusCode: 400, message: this.getMessage(exception.code) });
  }

  private getMessage(code: string) {
    switch (code) {
      case '23502':
        return 'SQL not null constraint violation';
      case '23505':
        return 'SQL unique constraint violation';
      default:
        return 'SQL constraint violation';
    }
  }
}
