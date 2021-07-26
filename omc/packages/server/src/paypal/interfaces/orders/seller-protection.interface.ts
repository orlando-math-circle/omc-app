/**
 * PayPal `seller_protection`
 *
 * @see https://developer.paypal.com/docs/api/orders/v2/#definition-seller_protection
 */
export interface SellerProtection {
  status: 'ELIGIBLE' | 'PARTIALLY_ELIGIBLE' | 'NOT_ELIGIBLE';
  dispute_categories: Array<'ITEM_NOT_RECEIVED' | 'UNAUTHORIZED_TRANSACTION'>;
}
