import { PurchaseUnit } from './purchase-unit.interface';
import { HATEOASLink } from './shared/link.interface';
import { Payer } from './shared/payer.interface';

/**
 * PayPal Capture & Get Order Details
 *
 * Some fields require the `Prefer return=representation` header.
 *
 * @see https://developer.paypal.com/docs/api/orders/v2/#orders_capture
 */
export interface OrderDetails {
  id: string;
  intent: 'CAPTURE' | 'AUTHORIZE';
  payer: Payer;
  status: 'CREATED' | 'SAVED' | 'APPROVED' | 'VOIDED' | 'COMPLETED';
  purchase_units: PurchaseUnit[];
  create_time: string;
  update_time: string;
  links: HATEOASLink[];
}
