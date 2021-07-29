export interface Shipping {
  name: ShippingName;
  address: ShippingAddress;
}

export interface ShippingName {
  full_name: string;
}

/**
 * PayPal `shipping_detail.address_portable`
 *
 * @see https://developer.paypal.com/docs/api/orders/v2/#definition-shipping_detail.address_portable
 */
export interface ShippingAddress {
  address_line_1?: string;
  admin_area_2?: string;
  admin_area_1?: string;
  postal_code?: string;
  country_code: string;
}
