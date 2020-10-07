import { MikroORM } from '@mikro-orm/core';
import { INestApplication } from '@nestjs/common';
import { set, sub } from 'date-fns';
import { isNumber } from 'lodash';
import request from 'supertest';
import { CreateAccountDto } from '../../src/account/dtos/create-account.dto';
import { Roles } from '../../src/app.roles';
import { Grades } from '../../src/user/enums/grades.enum';
import { User } from '../../src/user/user.entity';

export class UserFixtures {
  public tokens: string[] = [];

  constructor(
    private readonly app: INestApplication,
    private readonly orm: MikroORM,
  ) {}

  /**
   * Creates a new account with a fixture primary user.
   *
   * @param first First name.
   * @param last Last name.
   * @param age Age in years subtracted from the current date.
   * @param email Email address.
   * @param grade Grade level.
   */
  public async createAccount(
    first = 'Jane',
    last = 'Doe',
    age = 25,
    email?: string,
    grade?: Grades,
  ) {
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

    const resp = await request(this.app.getHttpServer())
      .post('/account/register')
      .send(dto)
      .expect(201);

    expect(resp.body).toBeDefined();
    expect(typeof resp.body.token).toBe('string');
    expect(resp.body.complete).toBe(true);

    this.tokens.push(resp.body.token);

    return resp.body.token;
  }

  /**
   * Changes the roles of a fixture user.
   *
   * @param idOrUser User id or class instance.
   * @param roles User roles array.
   */
  public async setUserRoles(idOrUser: number | User, roles: Roles[]) {
    const user = isNumber(idOrUser)
      ? await this.orm.em.findOneOrFail(User, idOrUser)
      : idOrUser;

    user.roles = roles;

    await this.orm.em.flush();

    expect(Array.isArray(user.roles)).toBeTruthy();
    expect(user.roles).toEqual(roles);

    return user;
  }
}
