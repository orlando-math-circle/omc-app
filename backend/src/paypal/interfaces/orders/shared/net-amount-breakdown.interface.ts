import { ExchangeRate } from './exchange-rate.interface';
import { Money } from './money.interface';

/**
 * PayPal `net_amount_breakdown`
 *
 * @see https://developer.paypal.com/docs/api/orders/v2/#definition-net_amount_breakdown
 */

export interface NetAmountBreakdown {
  payable_amount: Money;
  converted_amount: Money;
  exchange_rate: ExchangeRate;
}
