/**
 * PayPal `payee_base` and `payee`
 *
 * @see https://developer.paypal.com/docs/api/orders/v2/#definition-payee
 */

export interface Payee {
  email_address: string;
  merchant_id: string;
}
