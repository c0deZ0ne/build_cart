import { InjectModel } from '@nestjs/sequelize';
import { Injectable } from '@nestjs/common';
import {
  Payment,
  PaymentProvider,
  PaymentStatus,
} from '../models/payment.model';
import * as crypto from 'crypto';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { BaniVerifyPaymentDto } from './dto/bani-verify-payment.dto';
import { PaymentService } from '../payment.service';
import { User } from 'src/modules/user/models/user.model';
import { EmailService } from 'src/modules/email/email.service';
import { Contract } from 'src/modules/contract/models';
import { Sequelize } from 'sequelize-typescript';
import { Transaction } from 'sequelize';

@Injectable()
export class BaniPaymentService {
  constructor(
    @InjectModel(Payment)
    private readonly paymentModel: typeof Payment,
    @InjectModel(Contract)
    private readonly contractModel: typeof Contract,
    private readonly configService: ConfigService,
    private readonly paymentService: PaymentService,
    private readonly emailService: EmailService,
    private readonly sequelise: Sequelize,
  ) {}

  async webhookProcess() {
    return {};
  }

  async getBaniMoniSignature() {
    const tribe_account_ref = this.configService.get('tribe_account_ref');
    const public_key = this.configService.get('public_key');
    const merchant_private_key = this.configService.get('merchant_private_key');
    const hmac = crypto.createHmac('sha256', merchant_private_key);
    const digest_msg = tribe_account_ref + public_key;
    const data = hmac.update(digest_msg);
    const moni_signature = data.digest('hex');
    return moni_signature;
  }

  async updatePaymentStatus(
    veryfyData: BaniVerifyPaymentDto,
    user: User,
    transaction: Transaction,
  ) {
    const contractData = await this.contractModel.findOne({
      where: { id: veryfyData.ContractId },
      include: { all: true },
    });
    const { pay_ref, vend_token, ContractId, BuilderId } = veryfyData;

    try {
      if (!pay_ref || !vend_token) {
        await this.paymentModel.destroy({ where: { vend_token } });
        throw new Error('InvalidPayment ');
      }

      const url = `${this.configService.get(
        'bani_base_url',
      )}partner/collection/pay_status_check/`;
      const headers = {
        'Content-userType': 'application/json',
        Authorization: 'Bearer ' + this.configService.get('access_token'),
        'moni-signature': await this.getBaniMoniSignature(),
      };
      const requestData = {
        pay_ref: pay_ref,
      };

      const response = await axios.post(url, requestData, { headers });
      const {
        pay_status,
        pay_amount_collected,
        match_currency,
        pay_ext_ref,
        custom_data,
        pay_amount_outstanding,
        match_amount,
      } = response?.data?.data;
      if (pay_status === 'paid' || pay_status === 'completed') {
        this.paymentService.createPayment(
          {
            pay_status: PaymentStatus.SUCCESS,
            pay_ref,
            pay_amount_collected,
            match_amount: match_amount,
            ContractId,
            pay_ext_ref,
            confirm_server_url: '',
            paymentProvider: PaymentProvider.BANI,
            vend_token,
            BuilderId,
            CreatedById: user.id,
            custom_data,
            pay_amount_outstanding,
            VendorId: custom_data.vendor_id,
          },
          transaction,
        );

        return true;
      } else if (pay_status === 'failed') {
        await this.paymentModel.destroy({ where: { vend_token } });
        return false;
      } else if (
        pay_status === 'in_progress' ||
        pay_status === 'source_processing' ||
        pay_status === 'on_going'
      ) {
        await this.paymentModel.update(
          {
            pay_status: PaymentStatus.PENDING,
            RfqRequestId: custom_data.RfqRequest,
            VendorId: custom_data.vendor_id,
            BuilderId: custom_data.buyer_id,
            pay_amount_collected,
            pay_ref,
            match_amount: match_amount,
            match_currency: match_currency,
            pay_ext_ref,
            pay_amount_outstanding,
            custom_data,
          },
          { where: { vend_token }, transaction },
        );
        return false;
      }
    } catch (error) {
      const dataFile = {
        title: contractData.RfqRequest.title,
        buyerName: user.name,
        VendorName: contractData.Vendor.businessName,
        ContractId: contractData.id,
        buyerEmail: contractData.Builder.email,
        vend_token,
        VendorEmail: contractData.Vendor.email,
        approveLink: `${this.configService.get(
          'PAYMENT_VERIFY_SERVER',
        )}/admin/payment/${vend_token}/approve`,
        provider_reference: pay_ref,
        Provider: 'Bani',
        pay_amount_collected: veryfyData?.pay_amount_collected,
      };
      await this.emailService.failedVerification(dataFile);
      return false;
    }
  }
}
