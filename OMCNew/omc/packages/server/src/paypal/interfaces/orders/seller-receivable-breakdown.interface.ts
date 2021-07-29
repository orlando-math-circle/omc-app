import { ExchangeRate } from './shared/exchange-rate.interface';
import { Money } from './shared/money.interface';
import { PlatformFee } from './shared/platform-fee.interface';

/**
 * PayPal `seller_receivable_breakdown`
 *
 * @see https://developer.paypal.com/docs/api/orders/v2/#definition-seller_receivable_breakdown
 */
export interface SellerReceivableBreakdown {
  gross_amount: Money;
  paypal_fee: Money;
  net_amount: Money;
  receivable_amount?: Money;
  exchange_rate?: ExchangeRate;
  platform_fees?: PlatformFee[];
}
