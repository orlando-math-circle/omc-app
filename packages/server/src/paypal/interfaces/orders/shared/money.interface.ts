/**
 * PayPal `money`
 *
 * @see https://developer.paypal.com/docs/api/orders/v2/#definition-money
 */
export interface Money {
  currency_code: string;
  value: string;
}
