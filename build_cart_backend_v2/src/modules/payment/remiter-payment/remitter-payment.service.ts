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
import { PaymentType } from './dto/remiter-contractPay-dto';
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
import { RemitaWebhookRequestData } from '../dto/paymentDto';
@Injectable()
export class RemitaPaymentService {
  constructor(
    @InjectModel(Payment)
    private readonly paymentModel: typeof Payment,
    @InjectModel(Order)
    private readonly orderModel: typeof Order,
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
    private paymentService: PaymentService,
    private userWalletService: UserWalletService,
    private readonly userTransactionService: UserTransactionService,
    private platformSubscriptionService: PlatformSubscriptionService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    private readonly contractService: ContractService,
    private readonly sequelize: Sequelize,
  ) { }

  async verifyRemitaPayment(body: RemitaWebhookRequestData): Promise<any> {
    const TXN_HASH = crypto
      .createHash('sha512')
      .update(
        `${body.remitaReference}${this.configService.getOrThrow(
          'REMITA_PRIVATE_KEY',
        )}`,
      )
      .digest('hex');
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://remitademo.net/payment/v1/payment/query/${body.remitaReference}`,
      headers: {
        publicKey: this.configService.getOrThrow('REMITA_PUBLIC_KEY'),
        'Content-Type': 'application/json',
        TXN_HASH: TXN_HASH,
      },
    };
        const dbTransaction = await this.sequelize.transaction();
    try {
      const { data } = await axios(config);
      const responseData = data['responseData'][0];
      if (
        responseData['message'] == 'Approved' &&
        responseData['paymentState'] == 'SUCCESSFUL'
      ) {

        const { userId, reference, amount } = body;
        try {    
          const transaction = await this.paymentModel.findOne({
            where: {
              pay_ref: reference,
            },
          });
          if (!transaction) throw new NotFoundException('transaction not found');          
          if (transaction.paymentPurpose === SystemPaymentPurpose.PLATFORM_SUBSCRIPTION) {
            await this.platformSubscriptionService.createSubscription({ type: SubscriptionType.PREMIUM, userId, dbTransaction })

            await this.userTransactionService.createUserTransaction(
              {
                amount,
                paymentMethod: transaction.paymentMethod,
                type: TransactionType.WITHDRAWAL,
                paymentProvider: PaymentProvider.REMITA,
                paymentPurpose: transaction.paymentPurpose,
                status: TransactionStatus.COMPLETED,
                description: "Platform Subscription",
                 UserWalletId:transaction.walletId
              }, dbTransaction,
            );

            await this.userWalletModel.increment(
              {
                ActualSpend: amount,
              },
              { where: { UserId: transaction.CreatedById }, transaction: dbTransaction },
            );
          }
          if (transaction.paymentPurpose === SystemPaymentPurpose.FUND_WALLET) {
            await this.userWalletModel.increment(
              {
                balance: amount,
                totalCredit: amount
              },
              { where: { UserId: transaction.CreatedById }, transaction: dbTransaction },
            );

            await this.userTransactionService.createUserTransaction(
              {
                amount: amount,
                paymentMethod: transaction.paymentMethod,
                type: TransactionType.DEPOSIT,
                paymentProvider: PaymentProvider.REMITA,
                paymentPurpose: transaction.paymentPurpose,
                status: TransactionStatus.COMPLETED,
                description: "Fund Vault",
                UserWalletId:transaction.walletId
              }, dbTransaction,

            );
          }
          //for project wallet transaction
          if (
            transaction.paymentPurpose === SystemPaymentPurpose.FUND_PROJECT_WALLET
          ) {
            await this.projectWalletModel.increment(
              {
                balance: amount,
                totalCredit: amount
              },
              {
                where: { id: transaction.ProjectWalletId },
                transaction: dbTransaction,
              },
            );

            await this.userWalletModel.increment(
              {
                totalCredit: amount,
              },
              
              { where: { UserId: transaction.CreatedById }, transaction: dbTransaction },
              
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
          }

          // do for order
          if (transaction.paymentPurpose === SystemPaymentPurpose.FUND_ORDER) {
            await this.contractModel.update(
              {
                status: ContractStatus.ACCEPTED,
                paymentStatus: ContractPaymentStatus.CONFIRMED,
              },
              {
                where: { ProjectId: transaction.custom_data.projectId },
                transaction: dbTransaction,
              },
            );

            await this.orderModel.update(
              {
                status: OrderStatus.PAID,
              },
              {
                where: { id: transaction.custom_data.orderId },
                transaction: dbTransaction,
                returning: true,
              },
            );

            const commission = await this.commissionModel.findOne({
              where: {
                active: true,
              },
            });

            const commision = (commission.percentageNumber / 100) * amount;
            const order = await this.orderModel.findOne({
              where: { id: transaction.custom_data.orderId },
            });

            if (!order) throw new NotFoundException('order does not exist');
            const contract = await this.contractModel.findOne({
              where: { ProjectId: order.ProjectId },
            });

            if (!contract) throw new NotFoundException('contract does not exist');

            await this.escrowModel.create(
              {
                orderId: transaction.custom_data.orderId,
                contractId: contract.id,
                projectId: transaction.custom_data.projectId,
                rfqRequestId: order.RfqRequestId,
                initialPrice: amount,
                commisionPercentage: commission.percentageNumber,
                commisionValue: commision,
                finalAmount: amount - commision,
                status: EscrowStatus.PENDING,
              },
              { transaction: dbTransaction },
            );

            await this.projectModel.update(
              {
                status: ProjectStatus.ACTIVE,
              },
              {
                where: { id: transaction.custom_data.projectId },
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
                amountSpent: amount,
              },
              {
                where: { id: transaction.custom_data.projectId },
                transaction: dbTransaction,
              },
            );

            await this.projectTransactionModel.create(
              {
                walletId: transaction.walletId,
                ProjectWalletId: transaction.ProjectWalletId,
                amount: amount,
                ProjectId: transaction.custom_data.projectId,
                description: 'order funded',
                userType: TransactionType.DEPOSIT,
                status: TransactionStatus.COMPLETED,
                fee: commision,
                paymentMethod: PaymentMethod.CREDIT_CARD,
                paymentProvider: PaymentProvider.CUTSTRUCT_PAY,
                paymentPurpose: SystemPaymentPurpose.FUND_ORDER,
                reference: generateReference(),
                CreatedById: userId,
              },
              { transaction: dbTransaction },
            );
            await dbTransaction.commit();
          }
          transaction.pay_status = PaymentStatus.SUCCESS
          transaction.custom_data = {...transaction.custom_data,...responseData }
          await transaction.save({transaction:dbTransaction})
          await dbTransaction.commit();
        } catch (error) { 
          throw new Error("error occurred please contact admin if you where debited")
        }
 
      } else {
        throw new BadRequestException("We could not verify Payment")
      }
  
    } catch (error) {
      dbTransaction.rollback()
      throw new BadRequestException("We could not verify Payment")
     }
  }
}