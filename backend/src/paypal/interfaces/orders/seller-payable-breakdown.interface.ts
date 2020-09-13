import { Money } from './shared/money.interface';
import { NetAmountBreakdown } from './shared/net-amount-breakdown.interface';
import { PlatformFee } from './shared/platform-fee.interface';

/**
 * PayPal `seller_payable_breakdown`
 *
 * @see https://developer.paypal.com/docs/api/orders/v2/#definition-seller_payable_breakdown
 */

export interface SellerPayableBreakdown {
  gross_amount: Money;
  paypal_fee: Money;
  net_amount: Money;
  platform_fees: PlatformFee[];
  net_amount_breakdown: NetAmountBreakdown[];
  total_refund_amount: Money;
}
