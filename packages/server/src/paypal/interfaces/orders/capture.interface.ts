import { SellerProtection } from './seller-protection.interface';
import { SellerReceivableBreakdown } from './seller-receivable-breakdown.interface';
import { HATEOASLink } from './shared/link.interface';
import { Money } from './shared/money.interface';

/**
 * PayPal `capture`
 *
 * @see https://developer.paypal.com/docs/api/orders/v2/#definition-capture
 */
export interface Capture {
  id: string;
  status:
    | 'COMPLETED'
    | 'DECLINED'
    | 'PARTIALLY_REFUNDED'
    | 'PENDING'
    | 'REFUNDED';
  status_details?: CaptureStatusDetails;
  amount: Money;
  invoice_id?: string;
  custom_id?: string;
  final_capture: boolean;
  seller_protection: SellerProtection;
  seller_receivable_breakdown: SellerReceivableBreakdown;
  disbursement_mode?: 'INSTANT' | 'DELAYED';
  links: HATEOASLink[];
  supplementary_data?: any;
  create_time: string;
  update_time: string;
}

/**
 * PayPal `capture_status_details`
 *
 * @see https://developer.paypal.com/docs/api/orders/v2/#definition-capture_status_details
 */
export interface CaptureStatusDetails {
  reason:
    | 'BUYER_COMPLAINT'
    | 'CHARGEBACK'
    | 'ECHECK'
    | 'INTERNATIONAL_WITHDRAWAL'
    | 'OTHER'
    | 'PENDING_REVIEW'
    | 'RECEIVING_PREFERENCE_MANDATES_MANUAL_ACTION'
    | 'REFUNDED'
    | 'TRANSACTION_APPROVED_AWAITING_FUNDING'
    | 'UNILATERAL'
    | 'VERIFICATION_REQUIRED';
}
