import { InjectModel } from '@nestjs/sequelize';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Payment } from '../models/payment.model';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { PaymentService } from '../payment.service';
import { User } from 'src/modules/user/models/user.model';
import { EmailService } from 'src/modules/email/email.service';
import { Contract, ContractPaymentStatus, ContractStatus } from 'src/modules/contract/models';
import { ContractService } from 'src/modules/contract/contract.service';
import { Order, OrderStatus } from 'src/modules/order/models';
import { Sequelize } from 'sequelize-typescript';
import * as crypto from 'crypto';
import { UserWalletService } from 'src/modules/user-wallet/user-wallet.service';
import {
  TransactionStatus,
  TransactionType,
} from 'src/modules/user-wallet-transaction/models/user-transaction.model';
import {
  RfqRequestMaterial,
  RfqQuote,
  RfqRequest,
} from 'src/modules/rfq/models';
import { UserWallet } from 'src/modules/user-wallet/models/user-wallet.model';
import { PlatformSubscriptionService } from 'src/modules/platfrom-subscription/platform-subacription.service';
import { SubscriptionType } from 'src/modules/platfrom-subscription/types';
import { UserTransactionService } from 'src/modules/user-wallet-transaction/user-transaction.service';
import { PaymentMethod, PaymentProvider, PaymentStatus, SystemPaymentPurpose } from '../types';
import { Commission } from 'src/modules/escrow/models/commision.model';
import { Escrow, EscrowStatus } from 'src/modules/escrow/models/escrow.model';
import { ProjectWallet } from 'src/modules/project-wallet/models/project-wallet.model';
import { ProjectTransaction } from 'src/modules/project-wallet-transaction/models/project-transaction.model';
import { Project, ProjectStatus } from 'src/modules/project/models/project.model';
import { generateReference } from 'src/util/util';
import { ProjectWebhookRequestData } from '../dto/paymentDto';
@Injectable()
export class ProjectPaymentService {
  constructor(
    @InjectModel(Payment)
    private readonly paymentModel: typeof Payment,
    @InjectModel(Order)
    private readonly orderModel: typeof Order,
    @InjectModel(User)
    private readonly userModel: typeof User,
    @InjectModel(Contract)
    private readonly contractModel: typeof Contract,
    @InjectModel(Commission)
    private readonly commissionModel: typeof Commission,
    @InjectModel(UserWallet)
    private readonly userWalletModel: typeof UserWallet,
    @InjectModel(Escrow)
    private readonly escrowModel: typeof Escrow,
    @InjectModel(ProjectWallet)
    private readonly projectWalletModel: typeof ProjectWallet,
    @InjectModel(ProjectTransaction)
    private readonly projectTransactionModel: typeof ProjectTransaction,
    @InjectModel(Project)
    private readonly projectModel: typeof Project,
    private readonly sequelize: Sequelize,
  ) { }

  async verifyProjectPayment(body: ProjectWebhookRequestData): Promise<any> {

        const dbTransaction = await this.sequelize.transaction();
    try {
     
      const { reference, userId } = body;
          const userData = await this.userModel.findOne({where:{id:userId},include:[{model:UserWallet}]})

        try {    
          const transaction = await this.paymentModel.findOne({
            where: {
              pay_ref: reference,
            },
            include:[{model:Project,include:[{model:ProjectWallet},{model:User ,as:"CreatedBy",include:[{model:UserWallet}]}]}]
          });
          if (!transaction) throw new NotFoundException('transaction not found');  
      if (transaction.paymentPurpose === SystemPaymentPurpose.FUND_ORDER) {
        await this.contractModel.update(
          {
            status: ContractStatus.ACCEPTED,
            paymentStatus: ContractPaymentStatus.CONFIRMED,
          },
          {
            where: { ProjectId: transaction.ProjectId },
            transaction: dbTransaction,
          },
        );

        await this.orderModel.update(
          {
            status: OrderStatus.PAID,
          },
          {
            where: { id: transaction.OrderId },
            transaction: dbTransaction,
            returning: true,
          },
        );

        const commission = await this.commissionModel.findOne({
          where: {
            active: true,
          },
        });

        const commision = (commission.percentageNumber / 100) * transaction.pay_amount_outstanding;
        const order = await this.orderModel.findOne({
          where: { id: transaction.OrderId },
        });

        if (!order) throw new NotFoundException('order does not exist');
        const contract = await this.contractModel.findOne({
          where: { ProjectId: order.ProjectId },
        });

        if (!contract) throw new NotFoundException('contract does not exist');

        await this.escrowModel.create(
          {
            orderId: transaction.OrderId,
            contractId: contract.id,
            projectId: transaction.ProjectId,
            rfqRequestId: order.RfqRequestId,
            initialPrice: transaction.pay_amount_outstanding,
            commisionPercentage: commission.percentageNumber,
            commisionValue: commision,
            finalAmount: transaction.pay_amount_outstanding - commision,
            status: EscrowStatus.PENDING,
          },
          { transaction: dbTransaction },
        );

        await this.projectModel.update(
          {
            status: ProjectStatus.ACTIVE,
          },
          {
            where: { id: transaction.ProjectId },
            transaction: dbTransaction,
          },
        );

        await this.projectTransactionModel.update(
          {
            status: TransactionStatus.COMPLETED,
          },
          {
            where: { id: transaction.id },
            transaction: dbTransaction,
          },
        );

        await this.projectModel.increment(
          {
            amountSpent: transaction.pay_amount_outstanding,
          },
          {
            where: { id: transaction.ProjectId },
            transaction: dbTransaction,
          },
        );
        await this.projectWalletModel.decrement(
          {
            balance: transaction.pay_amount_outstanding,
          },
          {
            where: { ProjectId: transaction.ProjectId },
            transaction: dbTransaction,
          },
        );

        await this.projectTransactionModel.create(
          {
            walletId: userData?.walletId,
            ProjectWalletId: transaction?.Project?.walletId,
            amount: transaction.pay_amount_outstanding,
            ProjectId: transaction.ProjectId,
            description: 'order funded with project wallet',
            userType: TransactionType.DEPOSIT,
            status: TransactionStatus.COMPLETED,
            fee: commision,
            paymentMethod: PaymentMethod.CUTSTRUCT_PAY,
            paymentProvider: PaymentProvider.CUTSTRUCT_PAY,
            paymentPurpose: SystemPaymentPurpose.FUND_ORDER,
            reference: generateReference(),
            CreatedById: transaction.CreatedById,
            
          },
          { transaction: dbTransaction },
        );
      } else {
        throw ("Action not allowed please contact admin")
      }

          transaction.pay_status = PaymentStatus.SUCCESS
          transaction.custom_data = {...transaction.custom_data }
          await transaction.save({transaction:dbTransaction})
          await dbTransaction.commit();
        } catch (error) { 
          console.log(error)
          throw new Error("error occurred please contact admin if you where debited")
        }

    } catch (error) {
      console.log(error)
      dbTransaction.rollback()
      throw new BadRequestException("We could not verify Payment")
     }
  }
}