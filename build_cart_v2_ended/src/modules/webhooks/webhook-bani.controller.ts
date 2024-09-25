import { Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { WebhookBaniPaymentService } from './webhook-bani.sevice';

@Controller('webhook')
@ApiTags('webhook')
export class BaniWebhookController {
  private readonly merchantPrivateKey = 'privatekey';
  constructor(private webhookBaniPaymentService: WebhookBaniPaymentService) {}

  @ApiOperation({
    summary: 'Receive webhook from bani',
  })
  @Post('bani')
  async handleWebhook() {
    return this.webhookBaniPaymentService.handleWebhook();
  }
}
