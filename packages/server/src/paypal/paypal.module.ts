import { HttpModule, Module } from '@nestjs/common';
import { PAYPAL_ENV_TOKEN } from '../app.constants';
import { ConfigService } from '../config/config.service';
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
    const isSandboxed = config.PAYPAL.SANDBOXED;
    const clientId = config.PAYPAL.CLIENT_ID;
    const secretKey = config.PAYPAL.SECRET_KEY;

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
