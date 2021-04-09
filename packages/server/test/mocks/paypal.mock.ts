import { OrderDetails } from '../../src/paypal/types/orders/order-details.interface';
import { CreateOrderResponse } from '../../src/paypal/types/orders/responses/create-order.interface';

export class PayPalMock {
  constructor(
    public readonly id: string,
    public readonly amount: string,
    private readonly customId: string,
  ) {}

  public getCreateMock(): CreateOrderResponse {
    return {
      id: this.id,
      intent: 'CAPTURE',
      status: 'CREATED',
      purchase_units: [
        {
          reference_id: 'default',
          amount: {
            currency_code: 'USD',
            value: this.amount,
          },
          payee: {
            email_address: 'example@business.example.com',
            merchant_id: '2DDDCFLFXE5TA',
          },
          custom_id: this.customId,
        },
      ],
      create_time: new Date().toISOString(),
      links: [],
    };
  }

  public getCaptureMock(): OrderDetails {
    return {
      id: this.id,
      intent: 'CAPTURE',
      status: 'COMPLETED',
      purchase_units: [
        {
          reference_id: 'default',
          amount: {
            currency_code: 'USD',
            value: this.amount,
          },
          payee: {
            email_address: 'example@business.example.com',
            merchant_id: '2DDDCCCBBBAAA',
          },
          custom_id: this.customId,
          shipping: {
            name: {
              full_name: 'Jane Doe',
            },
            address: {
              address_line_1: '1 Fake St',
              admin_area_2: 'Sane Jose',
              admin_area_1: 'CA',
              postal_code: '95131',
              country_code: 'US',
            },
          },
          payments: {
            captures: [
              {
                id: '2D257582J6902173H',
                status: 'COMPLETED',
                amount: {
                  currency_code: 'USD',
                  value: this.amount,
                },
                final_capture: true,
                seller_protection: {
                  status: 'ELIGIBLE',
                  dispute_categories: [
                    'ITEM_NOT_RECEIVED',
                    'UNAUTHORIZED_TRANSACTION',
                  ],
                },
                seller_receivable_breakdown: {
                  gross_amount: {
                    currency_code: 'USD',
                    value: this.amount,
                  },
                  paypal_fee: {
                    currency_code: 'USD',
                    value: this.getPayPalFee(this.amount),
                  },
                  net_amount: {
                    currency_code: 'USD',
                    value: (
                      parseFloat(this.amount) -
                      parseFloat(this.getPayPalFee(this.amount))
                    ).toString(10),
                  },
                },
                links: [],
                create_time: new Date().toISOString(),
                update_time: new Date().toISOString(),
              },
            ],
          },
        },
      ],
      payer: {
        name: {
          given_name: 'Jane',
          surname: 'Doe',
        },
        email_address: 'example@personal.example.com',
        payer_id: '2FX4Q66PXJD6L',
        address: {
          country_code: 'US',
        },
      },
      create_time: new Date().toISOString(),
      update_time: new Date().toISOString(),
      links: [],
    };
  }

  public getOrderMock(): OrderDetails {
    return {
      id: this.id,
      intent: 'CAPTURE',
      status: 'COMPLETED',
      purchase_units: [
        {
          reference_id: 'default',
          amount: {
            currency_code: 'USD',
            value: this.amount,
          },
          payee: {
            email_address: 'example@business.example.com',
            merchant_id: '2DDDCFLFXE5TA',
          },
          shipping: {
            name: {
              full_name: 'Jane Doe',
            },
            address: {
              address_line_1: '1 Fake St',
              admin_area_2: 'Sane Jose',
              admin_area_1: 'CA',
              postal_code: '95131',
              country_code: 'US',
            },
          },
          payments: {
            captures: [
              {
                id: '2D257582J6902173H',
                status: 'COMPLETED',
                amount: {
                  currency_code: 'USD',
                  value: this.amount,
                },
                final_capture: true,
                seller_protection: {
                  status: 'ELIGIBLE',
                  dispute_categories: [
                    'ITEM_NOT_RECEIVED',
                    'UNAUTHORIZED_TRANSACTION',
                  ],
                },
                seller_receivable_breakdown: {
                  gross_amount: {
                    currency_code: 'USD',
                    value: this.amount,
                  },
                  paypal_fee: {
                    currency_code: 'USD',
                    value: this.getPayPalFee(this.amount),
                  },
                  net_amount: {
                    currency_code: 'USD',
                    value: (
                      parseFloat(this.amount) -
                      parseFloat(this.getPayPalFee(this.amount))
                    ).toString(10),
                  },
                },
                links: [],
                create_time: new Date().toISOString(),
                update_time: new Date().toISOString(),
              },
            ],
          },
        },
      ],
      payer: {
        name: {
          given_name: 'Jane',
          surname: 'Doe',
        },
        email_address: 'example@personal.example.com',
        payer_id: '2FX4Q66PXJD6L',
        address: {
          country_code: 'US',
        },
      },
      create_time: new Date().toISOString(),
      update_time: new Date().toISOString(),
      links: [],
    };
  }

  public getAuthCredentials() {
    return {
      scope: '',
      access_token: 'ACCESS_TOKEN',
      token_type: 'Bearer',
      app_id: 'APP-00000000000000',
      expires_in: 31408,
      nonce: '',
    };
  }

  private getPayPalFee(amount: string) {
    return (parseFloat(amount) * 0.029 + 0.3).toFixed(2);
  }
}
