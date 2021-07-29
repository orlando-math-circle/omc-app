import { Controller, Get, Param, Post } from '@nestjs/common';
import { PayPalService } from './paypal.service';

@Controller('/paypal')
export class PayPalController {
  constructor(private readonly payPalService: PayPalService) {}

  @Post('/orders/create')
  async createOrder() {
    // return this.payPalService.createOrder({);
  }

  @Post('/orders/capture/:id')
  async captureOrder(@Param('id') id: string) {
    return this.payPalService.captureOrder(id);
  }

  @Get('/orders/:id')
  async getOrder(@Param('id') id: string) {
    return this.payPalService.getOrder(id);
  }
}
