/**
 * Interfaces for the PayPal v2 Orders API.
 *
 * @see https://developer.paypal.com/docs/api/orders/v2/#orders_create
 */

export enum OrderIntent {
  CAPTURE = 'CAPTURE',
  AUTHORIZE = 'AUTHORIZE',
}

export enum LandingPage {
  LOGIN = 'LOGIN',
  BILLING = 'BILLING',
  NO_PREFERENCE = 'NO_PREFERENCE',
}

export enum ShippingPreference {
  GET_FROM_FILE = 'GET_FROM_FILE',
  NO_SHIPPING = 'NO_SHIPPING',
  SET_PROVIDED_ADDRESS = 'SET_PROVIDED_ADDRESS',
}

export enum UserAction {
  CONTINUE = 'CONTINUE',
  PAY_NOW = 'PAY_NOW',
}

export enum PayeePreferred {
  UNRESTRICTED = 'UNRESTRICTED',
  IMMEDIATE_PAYMENT_REQUIRED = 'IMMEDIATE_PAYMENT_REQUIRED',
}

export interface PayPalCreateOrder {
  intent: OrderIntent;
  payer?: any; // unimplemented
  purchase_units: PurchaseUnit[];
  application_context?: ApplicationContext;
}

export interface PurchaseUnit {
  reference_id?: string;
  amount: PurchaseAmount;
  payee?: any;
}

export interface PurchaseAmount {
  currency_code: string;
  value: string;
  breakdown?: PurchaseAmountBreakdown;
}

export interface PurchaseAmountBreakdown {
  item_total?: Money;
  shipping?: Money;
  tax_total?: Money;
  insurance?: Money;
  skipping_discount?: Money;
  discount?: Money;
}

export interface Money {
  currency_code: string;
  value: string;
}

export interface ApplicationContext {
  brand_name?: string;
  locale?: string;
  landing_page?: LandingPage;
  skipping_preference?: ShippingPreference;
  user_action?: UserAction;
  payment_method?: PaymentMethod;
  return_url?: string;
  cancel_url?: string;
}

export interface PaymentMethod {
  payer_selected?: string;
  payee_preferred?: PayeePreferred;
}
