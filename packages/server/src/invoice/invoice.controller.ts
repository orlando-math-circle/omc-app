import { Controller, Get, Param } from '@nestjs/common';
import { Account } from '../account/account.entity';
import { Acc } from '../auth/decorators/account.decorator';
import { AccountAuth, UserAuth } from '../auth/decorators/auth.decorator';
import { InvoiceService } from './invoice.service';

@Controller('invoice')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @UserAuth('invoice', 'read:any')
  @Get('/event/:eventId')
  findByEvent(@Param('eventId') eventId: number, @Acc() account: Account) {
    return this.invoiceService.findByCourse(eventId, account);
  }

  @UserAuth('invoice', 'read:any')
  @Get('/course/:courseId')
  findByCourse(@Param('courseId') courseId: number, @Acc() account: Account) {
    return this.invoiceService.findByCourse(courseId, account);
  }

  @AccountAuth()
  @Get('/account')
  findByAccount(@Acc() account: Account) {
    return this.invoiceService.find(
      {
        user: { id: account.users.toArray().map((u) => u.id) },
      },
      ['course'],
    );
  }
}
