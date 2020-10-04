import { Controller, Get, Param } from '@nestjs/common';
import { Account } from '../account/account.entity';
import { Acc } from '../auth/decorators/account.decorator';
import { UserAuth } from '../auth/decorators/auth.decorator';
import { InvoiceService } from './invoice.service';

@Controller('invoice')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @UserAuth()
  @Get('/event/:eventId')
  findByEvent(@Param('eventId') eventId: number, @Acc() account: Account) {
    return this.invoiceService.find({
      event: { id: eventId },
      user: { id: { $in: account.users.toArray().map((u) => u.id) } },
    });
  }

  @UserAuth()
  @Get('/course/:courseId')
  findByCourse(@Param('courseId') courseId: number, @Acc() account: Account) {
    return this.invoiceService.find({
      course: { id: courseId },
      user: { id: { $in: account.users.toArray().map((u) => u.id) } },
    });
  }
}
