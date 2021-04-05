import { Money } from './money.interface';

/**
 * PayPal `amount_with_breakdown`
 *
 * @see https://developer.paypal.com/docs/api/orders/v2/#definition-amount_with_breakdown
 */
export interface AmountWithBreakdown {
  currency_code: string;
  value: string;
  breakdown?: AmountBreakdown;
}

/**
 * PayPal `amount_breakdown`
 *
 * @see https://developer.paypal.com/docs/api/orders/v2/#definition-amount_breakdown
 */
export interface AmountBreakdown {
  item_total: Money;
  shipping: Money;
  handling: Money;
  tax_total: Money;
  insurance: Money;
  shipping_discount: Money;
  discount: Money;
}
