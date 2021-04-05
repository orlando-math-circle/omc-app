import { PurchaseUnitRequest } from '../purchase-unit.interface';
import { HATEOASLink } from '../shared/link.interface';

/**
 * PayPal Create Order Response
 */
export interface CreateOrderResponse {
  id: string;
  intent: 'CAPTURE' | 'AUTHORIZE';
  status: 'CREATED' | 'SAVED' | 'APPROVED' | 'VOIDED' | 'COMPLETED';
  purchase_units: PurchaseUnitRequest[];
  create_time: string;
  links: HATEOASLink[];
}
