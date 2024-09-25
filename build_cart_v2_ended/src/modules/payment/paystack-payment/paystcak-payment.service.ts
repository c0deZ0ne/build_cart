import { InjectModel } from '@nestjs/sequelize';
import { BadRequestException, Injectable } from '@nestjs/common';
import {
  Payment,
  PaymentStatus,
} from '../models/payment.model';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { PaymentService } from '../payment.service';
import { User } from 'src/modules/user/models/user.model';
import { EmailService } from 'src/modules/email/email.service';
import { Contract } from 'src/modules/contract/models';
import { PaystackVerifyPaymentDto } from './dto/paystack-contractPay-dto';
import { Transaction as SequelizeTransaction } from 'sequelize';
import { initializePaymentData } from 'src/modules/project/types';
import { PaymentMethod,  PaymentProvider,  TransactionStatus } from 'src/modules/user-wallet-transaction/models/user-transaction.model';
import { UserWalletService } from 'src/modules/user-wallet/user-wallet.service';

@Injectable()
export class PaystackPaymentService {
  constructor(
    @InjectModel(Payment)
    @InjectModel(Contract)
    private readonly contractModel: typeof Contract,
    private paymentService: PaymentService,
    private userWalletService: UserWalletService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {}

  async verifyPayment(
    paystackVerifyPaymentDto: PaystackVerifyPaymentDto,
    user: User,
    transaction: SequelizeTransaction,
  ) {
    const contractData = await this.contractModel.findOne({
      where: { id: paystackVerifyPaymentDto.ContractId },
      include: { all: true },
    });

    try {
      const { data } = await axios.get(
        `https://api.paystack.co/transaction/verify/${paystackVerifyPaymentDto.pay_ref}`,
        {
          headers: {
            Authorization: `Bearer ${await this.configService.get(
              'PAYSTACK_SECRET',
            )}`,
          },
        },
      );

      if (data.data.status !== 'success')
        throw new BadRequestException('Payment not successful');

      const match_amount = data.data.amount / 100;
      await this.paymentService.createPayment(
        {
          vend_token: paystackVerifyPaymentDto.vend_token,
          UserId: user.id,
          pay_ref: paystackVerifyPaymentDto.pay_ref,
          pay_ext_ref: paystackVerifyPaymentDto.vend_token,
          CreatedById: user.id,
          BuilderId: data.data.metadata.buyer_id,
          VendorId: data.data.metadata.vendor_id,
          ContractId: data.data.metadata.contract_id,
          paymentProvider:PaymentProvider.PAYSTACK,
          RfqRequestId: data.data.metadata.RfqRequest,
          pay_status: PaymentStatus.SUCCESS,
          pay_amount_collected: Number(data.data.amount / 100),
          pay_amount_outstanding: Number(data.data.amount / 100 - match_amount),
          match_amount: Number(data.data.amount / 100),
          custom_data: data.data.metadata,
          confirm_server_url: '',
        },
        transaction,
      );
      return true;
    } catch (error) {
      const dataFile = {
        title: contractData.RfqRequest.title,
        buyerName: user.businessName,
        VendorName: contractData.Vendor.businessName,
        ContractId: contractData.id,
        buyerEmail: contractData.Builder.email,
        vend_token: paystackVerifyPaymentDto.vend_token,
        VendorEmail: contractData.Vendor.email,
        approveLink: `${this.configService.get(
          'PAYMENT_VERIFY_SERVER',
        )}/admin/payment/${paystackVerifyPaymentDto.vend_token}/approve`,
        provider_reference: paystackVerifyPaymentDto.pay_ref,
        Provider: 'PAYSTACK',
        pay_amount_collected: paystackVerifyPaymentDto?.pay_amount_collected,
      };
      await this.emailService.failedVerification(dataFile);
      return false;
    }
  }
  

  async initiateProjectWalletTransaction(data: initializePaymentData) {
    try {
      const { userId, reference, email, amount, metadata } = data;
      const res = await axios.post(
        'https://api.paystack.co/transaction/initialize',
        {
          email,
          amount: amount * 100,
          reference,
          metadata,
          callback_url: `${this.configService.get(
            'CALLBACK_URL',
          )}&id=${userId}`,
        },
        {
          headers: {
            Authorization: `Bearer ${this.configService.get(
              'PAYSTACK_SECRET',
            )}`,
            'Accept-Encoding': 'identity',
          },
        },
      );

      if (!res.data.status) return { error: 'Error initializing transaction' };
      const { authorization_url: paymentUrl } = res.data.data;
      return {
        data: {
          paymentUrl,
          reference,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async WalletTopUp({ user, pay_ref }: { user: User; pay_ref: string }) {
    try {
       const { data } = await axios.get(
        `https://api.paystack.co/transaction/verify/${pay_ref}`,
        {
          headers: {
            Authorization: `Bearer ${await this.configService.get(
              'PAYSTACK_SECRET',
            )}`,
          },
        },
      );

      if (data.data.status !== 'success')
        throw new BadRequestException('Payment not successful');

      const match_amount = data.data.amount / 100;
     
        await this.userWalletService.fundWallet({
          amount: match_amount,
          paymentMethod: PaymentMethod.BANK_TRANSFER,
          paymentProvider:PaymentProvider.PAYSTACK,
          description: 'Wallet top-up',
          user: user,
          meta: data,
          ref: pay_ref,
          itemName:"Wallet top up",
          transactionStatus: TransactionStatus.COMPLETED,
        });
   
      return data;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

}
