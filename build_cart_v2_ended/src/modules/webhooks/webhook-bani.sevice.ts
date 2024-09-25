import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WebhookBaniPaymentService {
  constructor(private configService: ConfigService) {}

  handleWebhook() {
    return 'ok';
  }
}
