import { Money } from './money.interface';
import { Payee } from './payee-base.interface';

/**
 * PayPal `platform_fee`
 *
 * @see https://developer.paypal.com/docs/api/orders/v2/#definition-platform_fee
 */
export interface PlatformFee {
  amount: Money;
  payee: Payee;
}
