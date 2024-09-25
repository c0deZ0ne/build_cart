import { InjectModel } from '@nestjs/sequelize';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import {
  Payment,
} from './models/payment.model';
import { User } from '../user/models/user.model';
import { Attributes, Op, Transaction as SequelizeTransaction } from 'sequelize';
import { MetaData, PaymentStatus, SystemPaymentPurpose } from './types';
import { generateReference } from 'src/util/util';
import { SystemPaymentDto } from './dto/paymentDto';
import { Sequelize } from 'sequelize-typescript';
import { Order } from '../order/models';
import { ProjectWallet } from '../project-wallet/models/project-wallet.model';
import { Project } from '../project/models/project.model';
import { UserWallet } from '../user-wallet/models/user-wallet.model';
import { Builder } from '../builder/models/builder.model';
import { Contract } from '../contract/models';
import { RfqRequest } from '../rfq/models';
@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment)
    readonly paymentModel: typeof Payment,
    @InjectModel(Project)
    readonly projectModel: typeof Project,
    @InjectModel(Order)
    readonly orderModel: typeof Order,
    @InjectModel(ProjectWallet)
    readonly projectWalletModel: typeof ProjectWallet,
    @InjectModel(UserWallet)
    readonly userWalletModel: typeof UserWallet,
    private sequelize: Sequelize,

  ) { }

  async creeatPayment({ user, initialDetails }: { user: User, initialDetails: SystemPaymentDto }) {
    const { amount, projectId, paymentPurpose, orderId, vaultId, paymentMethod, paymentProvider } = initialDetails
    const dbTransaction = await this.sequelize.transaction();
    try {
      const reference = generateReference();
      const paymentData: Partial<Attributes<Payment>> = {
        pay_amount: amount,
        pay_status: PaymentStatus.PENDING,
        paymentPurpose,
        paymentMethod,
        paymentProvider,
        pay_ref: reference,
        pay_amount_collected: 0,
        pay_amount_outstanding: amount,
        CreatedById: user.id,
        ProjectId:projectId
      }
      const metadata: MetaData = {
        projectId,
        paymentPurpose,
        orderId,
      }

      if (paymentPurpose === SystemPaymentPurpose.FUND_ORDER) {
        if (!orderId) throw new NotFoundException('order does not exist');
        const order = await this.orderModel.findOne({
          where: {
            id: orderId,
            [Op.or]: [
              { BuilderId: user.BuilderId },
              { FundManagerId: user.FundManagerId },
            ],

          },
          include: [{ model: Contract },{model:RfqRequest}]
        });
        if (!order) throw new NotFoundException('order does not exist');
        paymentData.OrderId = order.id
        paymentData.pay_amount = order.RfqRequest.totalBudget 
      }

      if (paymentPurpose === SystemPaymentPurpose.FUND_PROJECT_WALLET) {
        if (!projectId) throw new NotFoundException('Project does not exist');
        const project = await this.projectModel.findOne({
          where: {
            id: projectId,
            ownerId: user.id,
          },
          include: [{ model: ProjectWallet }],
        });

        const builderProject = await this.projectModel.findOne({
          where: { id: projectId },
          include: [
            {
              model: Builder,
              where: {
                ownerId: user.id,
              },
            },
          ],
        });

        if (!builderProject && !project)
          throw new NotFoundException(
            'sorry you are not a member of this project',
          );

        paymentData.ProjectWalletId = project.walletId
      }

      if (vaultId) {
        if (user.walletId !== vaultId) throw new NotFoundException(
          'Please wallet details mismatch',
        )
        paymentData.walletId = user.walletId
      }


      paymentData.custom_data = metadata
      const pendingPaymentDetails = await this.paymentModel.create(paymentData,
        { transaction: dbTransaction })
      dbTransaction.commit()
      const data = {
        userId: user.id,
        reference,
        email: user.email,
        amount: pendingPaymentDetails.pay_amount,
        metadata,
      };
      return data
    } catch (error) {
      dbTransaction.rollback()
      throw new BadRequestException(error.message)
    }

  }

}

