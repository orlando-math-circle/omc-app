import { ShippingAddress } from './shipping.interface';

/**
 * PayPal `payer`
 *
 * @see https://developer.paypal.com/docs/api/orders/v2/#definition-payer
 */
export interface Payer {
  name?: PayerName;
  email_address?: string;
  payer_id?: string;
  phone?: PhoneWithType;
  birth_date?: string;
  tax_info?: TaxInfo;
  address?: ShippingAddress;
}

/**
 * PayPal `tax_info`
 *
 * @see https://developer.paypal.com/docs/api/orders/v2/#definition-tax_info
 */
export interface TaxInfo {
  tax_id: string;
  tax_id_type: 'BR_CPF' | 'BR_CNPJ';
}

/**
 * PayPal `payer.name`
 *
 * @see https://developer.paypal.com/docs/api/orders/v2/#definition-payer.name
 */
export interface PayerName {
  given_name: string;
  surname: string;
}

/**
 * PayPal `phone_with_type`
 *
 * Requires merchant setting to utilize.
 *
 * @see https://developer.paypal.com/docs/api/orders/v2/#definition-phone_with_type
 */
export interface PhoneWithType {
  phone_type: 'FAX' | 'HOME' | 'MOBILE' | 'OTHER' | 'PAGER';
  phone_number: Phone;
}

/**
 * PayPal `phone_with_type.phone`
 *
 * @see https://developer.paypal.com/docs/api/orders/v2/#definition-phone_with_type.phone
 */
export interface Phone {
  national_number: string;
}
