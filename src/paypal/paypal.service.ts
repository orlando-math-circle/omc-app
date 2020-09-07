import { HttpException, Inject, Injectable } from '@nestjs/common';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import qs from 'querystring';
import { PAYPAL_ENV_TOKEN, PAYPAL_MAX_RETRIES } from '../app.constants';
import { PayPalCreateOrder } from './interfaces/create-order.interface';
import { PayPalEnvironment } from './paypal-environment.class';
import { PayPalTokenLoader } from './paypal-token-loader.class';
import { PayPalToken } from './paypal-token.class';

export type AxiosRetryConfig = AxiosRequestConfig & { retries: number };

@Injectable()
export class PayPalService {
  private readonly axios: AxiosInstance;
  private token: PayPalToken;

  constructor(
    private readonly loader: PayPalTokenLoader,
    @Inject(PAYPAL_ENV_TOKEN) private readonly environment: PayPalEnvironment,
  ) {
    this.axios = axios.create({
      baseURL: this.environment.baseUrl,
    });
    this.initInterceptor();
  }

  get hasValidToken() {
    return this.token && this.token.isValid && !this.token.isExpired;
  }

  /**
   * Creates a simple PayPal order with a provided cost. This method
   * only supports
   */
  public async createOrder(paypalCreateOrder: PayPalCreateOrder) {
    const resp = await this.axios.post(
      '/v2/checkout/orders',
      paypalCreateOrder,
    );

    return resp.data;
  }

  public async captureOrder(id: string) {
    const resp = await this.axios.post(
      `/v2/checkout/orders/${id}/capture`,
      null,
      {
        headers: {
          'Content-Type': 'application/json',
          Prefer: 'return=representation',
        },
      },
    );

    return resp.data;
  }

  public async getOrder(id: string) {
    const resp = await this.axios.get(`/v2/checkout/orders/${id}`);

    return resp.data;
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
    config.headers.Authorization = this.token.getAuthString();

    return config;
  }

  /**
   * Sets an interceptor on the axios instance to attempt
   * to retry failed requests due to an expired token.
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

    this.axios.interceptors.response.use(null, async (error) => {
      const config = error.config;

      // No request config; cannot retry.
      if (!config) return Promise.reject(error);

      if (
        error?.response?.status === 401 &&
        config.retries < PAYPAL_MAX_RETRIES
      ) {
        return this.retryRequest(config);
      }

      throw new HttpException(
        error?.response?.data,
        error?.response?.status || 500,
      );
    });
  }

  private retryRequest(config: AxiosRetryConfig) {
    config.retries++;

    const promise = this.loader.enqueue(config).then(() => {
      this.setAuthHeader(config);
      return this.request(config);
    });

    if (this.loader.isLocked) return promise;

    this.getAccessToken();

    return promise;
  }
}
