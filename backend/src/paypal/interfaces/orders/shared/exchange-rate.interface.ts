/**
 * PayPal `exchange_rate`
 *
 * @see https://developer.paypal.com/docs/api/orders/v2/#definition-exchange_rate
 */
export interface ExchangeRate {
  source_currency: string;
  target_currency: string;
  value: string;
}
