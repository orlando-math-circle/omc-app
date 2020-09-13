import { SellerPayableBreakdown } from './seller-payable-breakdown.interface';
import { HATEOASLink } from './shared/link.interface';
import { Money } from './shared/money.interface';

/**
 * PayPal `refund`
 *
 * @see https://developer.paypal.com/docs/api/orders/v2/#definition-refund
 */

export interface Refund {
  id: string;
  status: 'CANCELLED' | 'PENDING' | 'COMPLETED';
  status_details?: 'ECHECK';
  amount: Money;
  invoice_id?: string;
  note_to_payer?: string;
  seller_payable_breakdown: SellerPayableBreakdown;
  links: HATEOASLink[];
}
