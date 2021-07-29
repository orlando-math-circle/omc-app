import { HATEOASLink } from './shared/link.interface';
import { Money } from './shared/money.interface';
import { SellerProtection } from './seller-protection.interface';

/**
 * PayPal `authorization`
 *
 * @see https://developer.paypal.com/docs/api/orders/v2/#definition-authorization
 */
export interface Authorization {
  status:
    | 'CREATED'
    | 'CAPTURED'
    | 'DENIED'
    | 'EXPIRED'
    | 'PARTIALLY_CAPTURED'
    | 'PARTIALLY_CREATED'
    | 'VOIDED'
    | 'PENDING';
  status_details?: AuthorizationStatusDetails;
  id: string;
  amount: Money;
  invoice_id?: string;
  custom_id?: string;
  seller_protection: SellerProtection;
  expiration_time: string;
  links: HATEOASLink[];
  create_time: string;
  update_time: string;
}

/**
 * PayPal `authorization_status_details`
 *
 * @see https://developer.paypal.com/docs/api/orders/v2/#definition-authorization_status_details
 */
export interface AuthorizationStatusDetails {
  reason: 'PENDING_REVIEW';
}
