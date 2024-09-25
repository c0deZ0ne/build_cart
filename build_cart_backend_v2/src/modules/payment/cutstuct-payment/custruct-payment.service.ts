import { InjectModel } from '@nestjs/sequelize';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Payment } from '../models/payment.model';
import { CutstructPayDto } from './dto/cutstruct-create-payment.dto';
import { User } from 'src/modules/user/models/user.model';
import { randomUUID } from 'crypto';
import { ConfigService } from '@nestjs/config';
import { Sequelize } from 'sequelize-typescript';
import { EmailService } from 'src/modules/email/email.service';
import {
  AdminPaymentRequestStatus,
  Contract,
} from 'src/modules/contract/models';

@Injectable()
export class CutstructPayService {
  constructor(
    @InjectModel(Payment)
    private readonly paymentModel: typeof Payment,
    @InjectModel(Contract)
    private readonly contractModel: typeof Contract,
    private readonly configService: ConfigService,
    private sequelize: Sequelize,

    private readonly emailService: EmailService,
  ) {}

  async createPayment({ data, user }: { data: CutstructPayDto; user: User }) {
    const dbTransaction = await this.sequelize.transaction();
    const vend_token = randomUUID();
    data.CreatedById = user.id;
    data.vend_token = vend_token;
    try {
      const contractStatus = await this.contractModel.findOne({
        where: {
          id: data.ContractId,
        },
      });
      if (
        contractStatus.adminPaymentRequestStatus ==
          AdminPaymentRequestStatus.DECLINED ||
        contractStatus.adminPaymentRequestStatus ==
          AdminPaymentRequestStatus.DISABLED
      ) {
        await await this.paymentModel.create(data, {
          transaction: dbTransaction,
        });
        contractStatus.adminPaymentRequestStatus =
          AdminPaymentRequestStatus.PENDING;
        await contractStatus.save({ transaction: dbTransaction });
        await this.emailService.adminTransactionApprove({
          title: data.title,
          approveLink: `${this.configService.get(
            'PAYMENT_VERIFY_SERVER',
          )}/admin/payment/${vend_token}/approve`,
          vend_token: vend_token,
          ContractId: data.ContractId,
          VendorName: data.VendorName,
          VendorEmail: data.VendorEmail,
          buyerEmail: data.buyerEmail,
          buyerName: data.buyerName,
          reciept_url: data.reciept_url,
          pay_amount_collected: data.pay_amount_collected,
        });
        dbTransaction.commit();
        return {
          message: 'The payment request has been sent to the admin',
          vend_token: vend_token,
        };
      } else if (
        contractStatus.adminPaymentRequestStatus ==
        AdminPaymentRequestStatus.BLOCKED
      ) {
        throw new BadRequestException(
          `Request is currently ${contractStatus.adminPaymentRequestStatus.toLocaleLowerCase()} for this contract`,
        );
      } else {
        throw new BadRequestException(
          `Request is ${contractStatus.adminPaymentRequestStatus.toLocaleLowerCase()} admin approval`,
        );
      }
    } catch (error) {
      dbTransaction.rollback();
      throw new BadRequestException(error.message);
    }
  }
}
