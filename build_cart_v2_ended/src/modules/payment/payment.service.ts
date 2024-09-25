import { InjectModel } from '@nestjs/sequelize';
import { BadRequestException, Injectable } from '@nestjs/common';
import {
  Payment,
  PaymentProvider,
  PaymentStatus,
} from './models/payment.model';
import { randomUUID } from 'crypto';
import { User } from '../user/models/user.model';
import { Contract, ContractPaymentStatus } from '../contract/models';
import { PaymnetDto } from './dto/create-paymentDto';
import { Transaction as SequelizeTransaction } from 'sequelize';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment)
    private readonly paymentModel: typeof Payment,
    @InjectModel(Contract)
    private readonly contractModel: typeof Contract,
  ) {}

  async getContractPayToken({
    user,
    contractId,
    provider,
  }: {
    user: User;
    contractId: string;
    provider: PaymentProvider;
  }) {
    const key = provider.toUpperCase();
    const paymentHistory = await this.paymentModel.findOne({
      where: {
        ContractId: contractId,
        CreatedById: user.id,
      },
    });

    const contractData = await this.contractModel.findOne({
      where: {
        id: contractId,
      },
      include: { all: true },
    });
    if (contractData.paymentStatus != ContractPaymentStatus.PENDING)
      throw new BadRequestException('You already paid');
    if (!paymentHistory) {
      const newPayment = await this.paymentModel.create({
        vend_token: randomUUID(),
        CreatedById: user.id,
        ContractId: contractId,
        paymentProvider: PaymentProvider[`${key}`]
          ? PaymentProvider[`${key}`]
          : PaymentProvider.BANK,
        pay_status: PaymentStatus.PENDING,
        pay_amount_outstanding: contractData.totalCost,
        title: contractData.RfqRequest.title,
      });
      return {
        vend_token: newPayment.vend_token,
        pay_status: newPayment.pay_status,
        pay_amount_outstanding: newPayment.pay_amount_outstanding,
      };
    } else if (paymentHistory.pay_status == PaymentStatus.PENDING) {
      return {
        vend_token: randomUUID(),
        pay_status: paymentHistory.pay_status,
        pay_amount_outstanding: paymentHistory.pay_amount_outstanding,
      };
    } else if (paymentHistory.pay_status == PaymentStatus.SUCCESS) {
      throw new BadRequestException('You already paid');
    }
  }

  async getAllContractPayments(ContractId: string) {
    return await this.paymentModel.findAll({
      where: {
        ContractId,
      },
    });
  }
  async getTotalPayeForContractByContractId(ContractId: string) {
    const totalPayment = await this.getAllContractPayments(ContractId);
    if (totalPayment.length > 0) {
      return totalPayment.reduce(
        (a, b) => Number(a) + Number(b.pay_amount_collected),
        0,
      );
    }
    return 0;
  }

  async createPayment(
    paymentData: PaymnetDto,
    dbTransaction: SequelizeTransaction,
  ) {
    const checkPayment = await this.paymentModel.findOne({
      where: {
        vend_token: paymentData.vend_token,
      },
    });
    if (checkPayment && checkPayment.pay_status == PaymentStatus.SUCCESS) {
      throw new BadRequestException('You already paid');
    } else if (
      checkPayment &&
      checkPayment.pay_status == PaymentStatus.PENDING
    ) {
      await this.paymentModel.destroy({
        where: {
          vend_token: paymentData.vend_token,
        },
        transaction: dbTransaction,
      });
    }
    return await this.paymentModel.create(paymentData, {
      transaction: dbTransaction,
    });
  }
}
