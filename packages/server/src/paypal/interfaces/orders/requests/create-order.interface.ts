import { Payer } from '../shared/payer.interface';
import { PurchaseUnitRequest } from '../purchase-unit.interface';

/**
 * PayPal Create Order
 *
 * @see https://developer.paypal.com/docs/api/orders/v2/#orders-create-request-body
 */
export interface CreateOrderRequest {
  intent: 'CAPTURE' | 'AUTHORIZE';
  payer?: Payer;
  purchase_units: PurchaseUnitRequest[];
  application_context?: ApplicationContext;
}

/**
 * PayPal `order_application_context`
 *
 * @see https://developer.paypal.com/docs/api/orders/v2/#definition-order_application_context
 */
export interface ApplicationContext {
  brand_name?: string;
  locale?: string;
  landing_page?: 'LOGIN' | 'BILLING' | 'NO_PREFERENCE';
  skipping_preference?:
    | 'GET_FROM_FILE'
    | 'NO_SHIPPING'
    | 'GET_PROVIDED_ADDRESS';
  user_action?: 'CONTINUE' | 'PAY_NOW';
  payment_method?: PaymentMethod;
  return_url?: string;
  cancel_url?: string;
}

/**
 * PayPal `payment_method`
 *
 * @see https://developer.paypal.com/docs/api/orders/v2/#definition-payment_method
 */
export interface PaymentMethod {
  payer_selected?: string;
  payee_preferred?: 'UNRESTRICTED' | 'IMMEDIATE_PAYMENT_REQUIRED';
}
