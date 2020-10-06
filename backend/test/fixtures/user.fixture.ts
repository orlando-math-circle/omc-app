import { INestApplication } from '@nestjs/common';
import { set, sub } from 'date-fns';
import request from 'supertest';
import { CreateAccountDto } from '../../src/account/dtos/create-account.dto';
import { Grades } from '../../src/user/enums/grades.enum';

/**
 * Creates a new account with a primary user.
 */
export const createAccountFixture = async (
  app: INestApplication,
  first = 'Jane',
  last = 'Doe',
  email?: string,
  age = 25,
  grade?: Grades,
): Promise<string> => {
  const dob = set(sub(new Date(), { years: age }), {
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  });

  const dto: CreateAccountDto = {
    first,
    last,
    email: email || `${first}@${last}.com`.toLowerCase(),
    dob,
    password: 'apple',
    grade: grade || undefined,
  };

  const resp = await request(app.getHttpServer())
    .post('/account/register')
    .send(dto)
    .expect(201);

  expect(resp.body).toBeDefined();
  expect(typeof resp.body.token).toBe('string');
  expect(resp.body.complete).toBe(true);

  return resp.body.token;
};
