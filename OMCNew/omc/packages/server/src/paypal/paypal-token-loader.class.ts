import { Injectable } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';
import { EventEmitter } from 'events';

@Injectable()
export class PayPalTokenLoader {
  private locked = false;
  private requests: AxiosRequestConfig[] = [];
  private emitter = new EventEmitter();

  constructor() {
    // Sets an infinite number of event listeners (requests).
    this.emitter.setMaxListeners(0);
  }

  get isLocked() {
    return this.locked === true;
  }

  public lock() {
    this.locked = true;
  }

  public unlock() {
    this.locked = false;
  }

  enqueue(request: AxiosRequestConfig) {
    this.requests.push(request);

    return new Promise((resolve, reject) => {
      const completeHandler = (req: AxiosRequestConfig) => {
        if (request === req) {
          this.emitter.removeListener('complete', completeHandler);
          resolve(request);
        }
      };

      const failHandler = (error: Error) => {
        this.emitter.removeListener('fail', failHandler);
        reject(error);
      };

      this.emitter.on('complete', completeHandler);
      this.emitter.on('fail', failHandler);
    });
  }

  flush(error?: Error) {
    if (error) {
      this.emitter.emit('fail', error);
    } else {
      this.requests.forEach((request) =>
        this.emitter.emit('complete', request),
      );
    }

    this.requests = [];
    this.emitter.removeAllListeners();
  }
}
