import { BadGatewayException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaystackWebhookEnum, PaystackWebhookRequest } from '../project/types';
import * as crypto from 'crypto';
import { PaystackPaymentService } from '../payment/paystack-payment/paystack-payment.service';
import { RemitaPaymentService } from '../payment/remiter-payment/remitter-payment.service';
import { ProjectWebhookRequestData, RemitaWebhookRequestData } from '../payment/dto/paymentDto';
import { ProjectPaymentService } from '../payment/project-payment/project-payment.service';
@Injectable()
export class WebhookService {
  constructor(
    private configService: ConfigService,
    private paystackPaymentService: PaystackPaymentService,
    private remitaPaymentService: RemitaPaymentService,
    private projectPaymentService: ProjectPaymentService,
  ) { }

  async handlePaystackWebhook({ body, headers }) {
    try {
       const secret = this.configService.get('PAYSTACK_SECRET');
    const hash = crypto
      .createHmac('sha512', secret)
      .update(JSON.stringify(body))
      .digest('hex');
    if (hash !== headers['x-paystack-signature'])
      throw new UnauthorizedException('unauthorized');
    const { event, data } = body as PaystackWebhookRequest;

    if (event === PaystackWebhookEnum.CHARGE_SUCCESS) {
      return await this.paystackPaymentService.verifyPaystackPayment(data);
    } else {
      throw new BadGatewayException();
    }
    } catch (error) {
      console.log(error)
    }
    
  }
  
  async handleRemitaWebhook(body:RemitaWebhookRequestData) {
    return await this.remitaPaymentService.verifyRemitaPayment(body)
  }

  async handlePeojectPaymentWebook(body: ProjectWebhookRequestData) {
    return await this.projectPaymentService.verifyProjectPayment(body)
  }
}
