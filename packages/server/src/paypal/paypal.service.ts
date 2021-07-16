import {
  HttpException,
  Inject,
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import qs from 'querystring';
import { PAYPAL_ENV_TOKEN, PAYPAL_MAX_RETRIES } from '../app.constants';
import { OrderDetails } from './interfaces/orders/order-details.interface';
import { PurchaseUnitRequest } from './interfaces/orders/purchase-unit.interface';
import { CreateOrderRequest } from './interfaces/orders/requests/create-order.interface';
import { PayPalEnvironment } from './paypal-environment.class';
import { PayPalTokenLoader } from './paypal-token-loader.class';
import { PayPalToken } from './paypal-token.class';

export type AxiosRetryConfig = AxiosRequestConfig & { retries?: number };

@Injectable()
export class PayPalService {
  private readonly axios: AxiosInstance;
  private token: PayPalToken | null = null;

  constructor(
    private readonly loader: PayPalTokenLoader,
    @Inject(PAYPAL_ENV_TOKEN)
    private readonly environment: PayPalEnvironment,
  ) {
    this.axios = axios.create({
      baseURL: this.environment.baseUrl,
      headers: {
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
    });
    this.initInterceptor();
  }

  get hasValidToken() {
    return this.token && this.token.isValid && !this.token.isExpired;
  }

  /**
   * Creates a simple PayPal order with a provided cost.
   *
   * @param cost Cost of the order, e.g. '15.75'.
   * @param customId ID associated with the purchase unit.
   */
  public async createOrder(purchaseUnits: PurchaseUnitRequest[]) {
    const order: CreateOrderRequest = {
      intent: 'CAPTURE',
      purchase_units: purchaseUnits,
    };

    const resp = await this.axios.post('/v2/checkout/orders', order);

    return resp.data;
  }

  /**
   * Completes an order with the `CAPTURE` intent for immediately
   * available funds. This method will not work on `AUTHORIZE`
   * transactions.
   *
   * @param id ID of the order to complete.
   */
  public async captureOrder(id: string) {
    const resp = await this.axios.post<OrderDetails>(
      `/v2/checkout/orders/${id}/capture`,
    );

    return resp.data;
  }

  /**
   * Retrives an order by its ID from PayPal. These entities can expire,
   * however.
   *
   * @param id ID of the order to retrieve.
   */
  public async getOrder(id: string) {
    const resp = await this.axios.get<OrderDetails>(
      `/v2/checkout/orders/${id}`,
    );

    return resp.data;
  }

  /**
   * Validates that an order matches the expected arributes.
   */
  public validateCapture(
    order: OrderDetails,
    status: OrderDetails['status'],
    value: string,
  ) {
    if (order.intent !== 'CAPTURE') {
      throw new BadRequestException('Order intent mismatch');
    }

    if (order.status !== status) {
      throw new BadRequestException('Order status mismatch');
    }

    for (const purchase_unit of order.purchase_units) {
      if (purchase_unit.amount!.value !== value) {
        throw new BadRequestException('Order cost mismatch');
      }
    }
  }

  /**
   * Generic Axios request with the PayPal BaseURL.
   * This method is used internally when a request needs to be
   * repeated for an expired token.
   */
  private request(request: AxiosRequestConfig) {
    return this.axios.request(request);
  }

  /**
   * Creates a new access token for PayPal.
   */
  public async getAccessToken() {
    this.loader.lock();

    try {
      const resp = await this.axios.post(
        '/v1/oauth2/token',
        qs.stringify({
          grant_type: 'client_credentials',
        }),
        {
          headers: {
            Authorization: this.environment.getAuthorizationString(),
            'content-type': 'application/x-www-form-urlencoded',
          },
        },
      );

      const token = new PayPalToken(resp.data);

      this.token = token;
      this.loader.flush();
      this.loader.unlock();

      return token;
    } catch (error) {
      this.token = null;
      this.loader.flush(error);
      this.loader.unlock();

      throw error;
    }
  }

  /**
   * Modifies an Axios request to utilize the current token
   * bearer credentials.
   *
   * @param config Axios request.
   */
  private setAuthHeader(config: AxiosRequestConfig) {
    config.headers = config.headers || {};
    config.headers.Authorization = this.token!.getAuthString();

    return config;
  }

  /**
   * Installs both a request and error response interceptor. The request
   * interceptor shall configure retries and ensure the token exists whereas
   * the error response interceptor will attempt retries when appropriate.
   */
  private initInterceptor() {
    this.axios.interceptors.request.use(async (config: AxiosRetryConfig) => {
      config.retries = config.retries || 0;

      if (config.headers.Authorization) return config;

      if (config.url === '/v1/oauth2/token') return config;

      if (this.loader.isLocked) {
        await this.loader.enqueue(config);
      } else if (!this.hasValidToken) {
        await Promise.all([this.loader.enqueue(config), this.getAccessToken()]);
      }

      return this.setAuthHeader(config);
    });

    this.axios.interceptors.response.use(undefined, async (error) => {
      const config = error.config;

      // No request config; cannot retry.
      if (!config) return Promise.reject(error);

      // Only retry 401 Unathenticated requests (token issues).
      if (
        error?.response?.status === 401 &&
        config.retries < PAYPAL_MAX_RETRIES
      ) {
        return this.retryRequest(config);
      }

      console.log(error);
      throw new HttpException(
        error?.response?.data,
        error?.response?.status || 500,
      );
    });
  }

  /**
   * Reinitiates an Axios request from its configuration after
   * refreshing the token and enqueuing the request on the loader.
   *
   * @param config Axios request config with retries.
   */
  private retryRequest(config: AxiosRetryConfig) {
    config.retries = config.retries ? config.retries + 1 : 1;

    const promise = this.loader.enqueue(config).then(() => {
      this.setAuthHeader(config);
      return this.request(config);
    });

    // If the loader is locked, a token is already being retrieved.
    // The enqueued config will be released once it finishes.
    if (this.loader.isLocked) return promise;

    this.getAccessToken();

    return promise;
  }
}
