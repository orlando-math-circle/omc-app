import { Money } from './money.interface';

/**
 * PayPal `item`
 *
 * @see https://developer.paypal.com/docs/api/orders/v2/#definition-item
 */
export interface Item {
  name: string;
  unit_amount: Money;
  tax?: Money;
  quantity: string;
  description?: string;
  sku?: string;
  category: 'DIGITAL_GOODS' | 'PHYSICAL_GOODS';
}
