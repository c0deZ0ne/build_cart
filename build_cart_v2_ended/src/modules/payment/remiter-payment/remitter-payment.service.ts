import { InjectModel } from '@nestjs/sequelize';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Payment } from '../models/payment.model';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { PaymentService } from '../payment.service';
import { User } from 'src/modules/user/models/user.model';
import { EmailService } from 'src/modules/email/email.service';
import { Contract } from 'src/modules/contract/models';
import { ContractService } from 'src/modules/contract/contract.service';
import { Order, OrderStatus } from 'src/modules/order/models';
import { Sequelize } from 'sequelize-typescript';
import * as crypto from 'crypto';
import { UserWalletService } from 'src/modules/user-wallet/user-wallet.service';
import {
  PaymentMethod,
  TransactionStatus,
  PaymentProvider as payProvider,
} from 'src/modules/user-wallet-transaction/models/user-transaction.model';
import {
  RfqRequestMaterial,
  RfqQuote,
  RfqRequest,
} from 'src/modules/rfq/models';
import { UserWallet } from 'src/modules/user-wallet/models/user-wallet.model';
import { PaymentType } from './dto/remiter-contractPay-dto';
@Injectable()
export class RemitterPaymentService {
  constructor(
    @InjectModel(Payment)
    private readonly payment: typeof Payment,
    @InjectModel(Order)
    private readonly orderModel: typeof Order,
    @InjectModel(Contract)
    private readonly contractModel: typeof Contract,
    private paymentService: PaymentService,
    private userWalletService: UserWalletService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    private readonly contractService: ContractService,
    private readonly sequelize: Sequelize,
  ) {}

  /**
   * Pays for an order using funds from the fundManager's wallet.
   * @param {string} orderId - The ID of the order to be paid for.
   * @param {User} user - The user initiating the payment.
   * @param {string} [description] - An optional description for the payment.
   * @returns {Promise<unknown>} The result of the payment operation.
   * @throws {NotFoundException} If the order does not exist.
   * @throws {BadRequestException} If there is an issue with the wallet or payment process.
   */
  async PayOrderWithRemita({
    orderId,
    user,
    pay_ref,
  }: {
    orderId: string;
    user: User;
    description?: string;
    pay_ref: string;
    paymentType: PaymentType;
  }): Promise<unknown> {
    const dbTransaction = await this.sequelize.transaction();
    try {
      const order = await this.orderModel.findOne({
        where: { id: orderId },
        include: [
          { model: RfqRequestMaterial },
          { model: Contract },
          {
            model: RfqQuote,
            include: [
              {
                model: User,
                as: 'CreatedBy',
                include: [{ model: UserWallet }],
              },
              { model: RfqRequest },
            ],
          },
          { model: User, as: 'CreatedBy', include: [{ model: UserWallet }] },
        ],
      });
      if (!order) throw new NotFoundException('order does not exist');
      const verified = await this.verifyPayment(pay_ref);
      if (verified) {
        await this.contractService.payForContract({
          contractId: order.ContractId,
          user,
          dbTransaction,
          vend_token: crypto.randomUUID(),
        });
        order.status = OrderStatus.PAID;
        await order.save();
        return order;
      } else {
        throw new BadRequestException(
          'we could not verify your payment please contact admin',
        );
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async verifyPayment(transactionId: string) {
    const TXN_HASH = crypto
      .createHash('sha512')
      .update(
        `${transactionId}${this.configService.getOrThrow(
          'REMITA_PRIVATE_KEY',
        )}`,
      )
      .digest('hex');
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://remitademo.net/payment/v1/payment/query/${transactionId}`,
      headers: {
        publicKey: this.configService.getOrThrow('REMITA_PUBLIC_KEY'),
        'Content-Type': 'application/json',
        TXN_HASH: TXN_HASH,
      },
    };

    try {
      const { data } = await axios(config);
      const responseData = data['responseData'][0];
      if (
        responseData['message'] == 'Approved' &&
        responseData['paymentState'] == 'SUCCESSFUL'
      ) {
        return responseData;
      } else {
        return null;
      }
    } catch (error) {
      null;
    }
  }

  async WalletTopUp({ user, pay_ref }: { user: User; pay_ref: string }) {
    try {
      const verify = await this.verifyPayment(pay_ref);
      if (verify) {
        await this.userWalletService.fundWallet({
          amount: verify?.amount,
          paymentMethod: PaymentMethod.BANK_TRANSFER,
          paymentProvider: payProvider.REMITA,
          description: 'Wallet top-up',
          user: user,
          meta: verify,
          ref: pay_ref,
          itemName:"Wallet top up",
          transactionStatus: TransactionStatus.COMPLETED,
        });
      }
      return verify;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
