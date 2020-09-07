import { Authorization } from './authorization.interface';
import { Capture } from './capture.interface';
import { Refund } from './refund.interface';
import { AmountWithBreakdown } from './shared/amount-with-breakdown.interface';
import { Item } from './shared/item.interface';
import { Payee } from './shared/payee-base.interface';
import { PlatformFee } from './shared/platform-fee.interface';
import { Shipping } from './shared/shipping.interface';

/**
 * PayPal `purchase_unit_request`
 *
 * @see https://developer.paypal.com/docs/api/orders/v2/#definition-purchase_unit_request
 */
export interface PurchaseUnitRequest {
  reference_id?: string;
  amount: AmountWithBreakdown;
  payee?: Payee;
  payment_instruction?: PaymentInstruction;
  description?: string;
  custom_id?: string;
  invoice_id?: string;
  soft_descriptor?: string;
  items?: Item[];
  shipping?: Shipping;
}

/**
 * PayPal `payment_instruction`
 *
 * @see https://developer.paypal.com/docs/api/orders/v2/#definition-payment_instruction
 */
export interface PaymentInstruction {
  playform_fees: PlatformFee[];
  disbursement_mode: 'INSTANT' | 'DELAYED';
}

/**
 * PayPal `purchase_unit`
 *
 * @see https://developer.paypal.com/docs/api/orders/v2/#definition-purchase_unit
 */
export interface PurchaseUnit {
  reference_id?: string;
  shipping: Shipping;
  amount?: AmountWithBreakdown;
  payee?: Payee;
  payment_instruction?: PaymentInstruction;
  description?: string;
  custom_id?: string;
  invoice_id?: string;
  id?: string;
  soft_descriptor?: string;
  items?: Item[];
  payments: PaymentCollection[];
}

/**
 * PayPal `payment_collection`
 *
 * @see https://developer.paypal.com/docs/api/orders/v2/#definition-payment_collection
 */
export interface PaymentCollection {
  authorizations?: Authorization[];
  captures?: Capture[];
  refunds?: Refund[];
}
