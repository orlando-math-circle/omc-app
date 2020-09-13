import { HttpModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  PAYPAL_CLIENT_ID,
  PAYPAL_ENV_TOKEN,
  PAYPAL_SANDBOXED,
  PAYPAL_SECRET_KEY,
} from '../app.constants';
import { InvoiceModule } from '../invoice/invoice.module';
import {
  LiveEnvironment,
  SandboxEnvironment,
} from './paypal-environment.class';
import { PayPalTokenLoader } from './paypal-token-loader.class';
import { PayPalController } from './paypal.controller';
import { PayPalService } from './paypal.service';

const environmentFactory = {
  provide: PAYPAL_ENV_TOKEN,
  useFactory: (config: ConfigService) => {
    const isSandboxed = config.get(PAYPAL_SANDBOXED) === true;
    const clientId = config.get(PAYPAL_CLIENT_ID);
    const secretKey = config.get(PAYPAL_SECRET_KEY);

    if (isSandboxed) {
      return new SandboxEnvironment(clientId, secretKey);
    } else {
      return new LiveEnvironment(clientId, secretKey);
    }
  },
  inject: [ConfigService],
};

@Module({
  imports: [HttpModule, InvoiceModule],
  controllers: [PayPalController],
  providers: [PayPalService, PayPalTokenLoader, environmentFactory],
  exports: [PayPalService],
})
export class PayPalModule {}
