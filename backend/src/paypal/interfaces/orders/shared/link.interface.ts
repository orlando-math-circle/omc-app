/**
 * PayPal HATEOAS link
 *
 * @see https://developer.paypal.com/docs/api/reference/api-responses/#hateoas-links
 */
export interface HATEOASLink {
  href: string;
  rel: string;
  method:
    | 'GET'
    | 'POST'
    | 'PUT'
    | 'DELETE'
    | 'HEAD'
    | 'CONNECT'
    | 'OPTIONS'
    | 'PATCH';
}
