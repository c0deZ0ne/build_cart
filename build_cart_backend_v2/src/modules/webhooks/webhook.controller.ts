import { Controller, Post,Headers, Body, ValidationPipe } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { WebhookService } from './webhook.sevice';
// import { RemitaWebhookRequestData } from '../payment/types';
import { ProjectWebhookRequestData, RemitaWebhookRequestData } from '../payment/dto/paymentDto';

@Controller('webhook')
@ApiTags('webhook')
export class WebhookController {
  private readonly merchantPrivateKey = 'privatekey';
  constructor(private webhookService: WebhookService) { }
  @ApiOperation({
    summary: 'Paystack webhook verification',
  })
  @Post('paystack/verify-transactions')
  async verifyPaystackPaymentWebhook(
    @Headers() headers,
    @Body(ValidationPipe) body: unknown,
  ) {
    return await this.webhookService.handlePaystackWebhook({body,headers})
  }

   @ApiOperation({
    summary: 'Remita webhook verification',
   })
    @ApiBody({
      description: 'verify remita payment',
      type:RemitaWebhookRequestData
  })
  @Post('remita/verify-transactions')
  async verifyRemitaPaymentWebhook(
    @Headers() headers,
    @Body(ValidationPipe) body: RemitaWebhookRequestData,
  ) {
    return await this.webhookService.handleRemitaWebhook(body)
   }
  





   @ApiOperation({
    summary: 'Project fund order webhook verification',
   })
    @ApiBody({
      description: 'verify project fund order payment',
      type:ProjectWebhookRequestData
  })
  @Post('project/verify-transactions')
  async verifyProjectPaymentWebhook(
    @Headers() headers,
    @Body(ValidationPipe) body: ProjectWebhookRequestData,
  ) {
    return await this.webhookService.handlePeojectPaymentWebook(body)
  }

}