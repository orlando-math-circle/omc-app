import { Injectable } from '@nestjs/common';
import { Account } from './account.entity';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Injectable()
export class AccountService {
  create(createAccountDto: CreateAccountDto) {
    const account = new Account();

    Account.merge(account, createAccountDto);

    return account.save();
  }

  findOne(id: number) {
    return Account.findOneOrFail(id);
  }

  findOneByEmail(email: string) {
    return Account.findOne({ email });
  }

  findAll(take: number = 20, skip: number = 0) {
    return Account.findAndCount({ take, skip });
  }

  async update(id: number, updateAccountDto: UpdateAccountDto) {
    const account = await Account.findOneOrFail(id);

    Account.merge(account, updateAccountDto);

    return Account.save(account);
  }

  async delete(id: number) {
    const account = await Account.findOneOrFail(id);

    return Account.remove(account);
  }
}
