import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  CreationAttributes,
  Transaction as SequelizeTransaction,
} from 'sequelize';

import { ProjectWallet } from './models/project-wallet.model';
import {
  
  TransactionStatus,
  TransactionType,
} from '../user-wallet-transaction/models/user-transaction.model';
import { ProjectWalletTransactionService } from '../project-wallet-transaction/project-transaction.service';
import { User } from '../user/models/user.model';
import { UserWalletService } from '../user-wallet/user-wallet.service';
import { FundProjectWalletDto } from '../fund-manager/dto/fundproject.dto';
import { SharedProject } from '../shared-project/models/shared-project.model';
import { Project, ProjectStatus } from '../project/models/project.model';
import { ContractService } from '../contract/contract.service';
import { Sequelize } from 'sequelize-typescript';
import {
  Contract,
  ContractPaymentStatus,
  ContractStatus,
} from '../contract/models';
import { MyFundManagerService } from '../my-fundManager/my-fundManager.service';
import {
  ProjectTransaction,
} from '../project-wallet-transaction/models/project-transaction.model';
import { Order, OrderStatus } from '../order/models';
import { generateReference } from 'src/util/util';
import { Commission } from '../escrow/models/commision.model';
import { Escrow, EscrowStatus } from '../escrow/models/escrow.model';
import { Builder } from '../builder/models/builder.model';
import { PaymentMethod, PaymentProvider, SystemPaymentPurpose } from '../payment/types';

@Injectable()
export class ProjectWalletService {
  constructor(
    @InjectModel(ProjectWallet)
    private readonly projectWallet: typeof ProjectWallet,
    @InjectModel(Project)
    private readonly projectModel: typeof Project,

    @InjectModel(Escrow)
    private readonly escrowModel: typeof Escrow,
    @InjectModel(Commission)
    private readonly commissionModel: typeof Commission,
    @InjectModel(ProjectWallet)
    private readonly projectWalletModel: typeof ProjectWallet,
    @InjectModel(ProjectTransaction)
    private readonly projectTransactionModel: typeof ProjectTransaction,
    @InjectModel(Order)
    private readonly orderModel: typeof Order,
    @InjectModel(Contract)
    private readonly contractModel: typeof Contract,

    private readonly userWalletService: UserWalletService,
    private readonly projectWalletTransactionService: ProjectWalletTransactionService,
    @Inject(forwardRef(() => ContractService))
    private readonly contractService: ContractService,
    private readonly myFundManagerService: MyFundManagerService,
    private readonly sequelise: Sequelize,
  ) {}

  async createWallet(
    projectWallet: CreationAttributes<ProjectWallet>,
    dbTransaction?: SequelizeTransaction,
  ): Promise<ProjectWallet> {
    const wallet = await this.projectWallet.create(projectWallet, {
      transaction: dbTransaction,
    });
    return wallet;
  }

  async getProjectWalletByWalletId(walletId?: string): Promise<ProjectWallet> {
    const Projectwallet = await this.projectWallet.findOne({
      where: { id: walletId },
      include: [
        {
          model: Project,
          include: [{ all: true }],
        },
      ],
    });
    return Projectwallet;
  }

  async fundProjectWallet(
    data: FundProjectWalletDto,
    user: User,
  ): Promise<ProjectWallet> {
    const dbTransaction = await this.sequelise.transaction();

    const projectwallet = await this.getProjectWalletByWalletId(
      data.projectWalletId,
    );
    const getSharedProject = await SharedProject.findOne({
      where: {
        ProjectId: data.ProjectId,
        status: 'ACCEPTED',
      },
    });
    try {
      if (!projectwallet.Project) {
        throw new BadRequestException('Wallet not found');
      }
      if (!getSharedProject)
        throw new BadRequestException(
          'Please share the projects before funding',
        );
      if (!getSharedProject && projectwallet.Project.CreatedById !== user.id) {
        throw new BadRequestException(
          "You can't fund this project as it may be pending or rejected",
        );
      }

      const userWallet =
        await this.userWalletService.transferFundFromUserWallet({
          amount: data?.amount,
          ProjectId: data.ProjectId,
          dbTransaction,
          description: data.description,
          paymentPurpose: data.paymentPurpose,
          user,
        });
      if (!userWallet)
        throw new BadRequestException('Could not withdraw from user wallet');
      const curr = Number(projectwallet?.balance);
      const total = curr + Number(data.amount);
      projectwallet.balance = total;
      const ProjecttotalCredited = Number(projectwallet?.totalCredit);
      const projectTotalCredited = ProjecttotalCredited + Number(data.amount);
      projectwallet.totalCredit = projectTotalCredited;

      await projectwallet.save({ transaction: dbTransaction });
      await this.projectWalletTransactionService.createProjectTransaction(
        {
          amount: data?.amount,
          userType: TransactionType.DEPOSIT,
          ProjectId: data.ProjectId,
          status: TransactionStatus[`${data.transactionStatus}`],
          paymentMethod: PaymentMethod[`${data.paymentMethod}`],
          description: data.description,
          createdAt: new Date(),
          updatedAt: new Date(),
          CreatedById: user?.id,
          walletId: user?.walletId,
          ProjectWalletId: projectwallet?.id,
        },
        dbTransaction,
      );
      await this.myFundManagerService.mySponsorProjectTransactionUpdate(
        TransactionType.DEPOSIT,
        data.amount,
        getSharedProject,
        dbTransaction,
      );
      await dbTransaction.commit();
      return projectwallet;
    } catch (error) {
      await dbTransaction.rollback();
      throw new BadRequestException(error.message);
    }
  }

  async payforRfqContractByBuilderWithSponsorFundsOnWallet(
    contractId: string,
    user: User,
  ) {
    const contractData = await this.contractService.getContractById(contractId);
    if (contractData.paymentStatus != ContractPaymentStatus.PENDING)
      throw new BadRequestException(
        'Payment already Payed or undergoing verification',
      );

    const dbTransaction = await this.sequelise.transaction();
    try {
      const projectOwner = await this.projectModel.findOne({
        where: { ownerId: user.id },
      });

      const builderProject = await this.projectModel.findOne({
        where: { id: contractData.ProjectId },
        include: [
          {
            model: Builder,
            where: {
              ownerId: user.id,
            },
          },
        ],
      });

      if (!builderProject && !projectOwner)
        throw new NotFoundException(
          'sorry you are not a member of this project',
        );

      const projectWallet = await this.projectWalletModel.findOne({
        where: {
          ProjectId: contractData.ProjectId,
        },
        include: [{ model: Project }],
      });

      if (!projectWallet)
        throw new NotFoundException('project wallet does not exist');

      if (projectWallet.balance < contractData.totalCost)
        throw new ConflictException(
          'insufficient funds, kindly contact project owner to fund project wallet',
        );

      const order = await this.orderModel.findOne({
        where: {
          ContractId: contractData.id,
        },
      });
      const commission = await this.commissionModel.findOne({
        where: {
          active: true,
        },
      });

      const commision =
        (commission.percentageNumber / 100) * contractData.totalCost;

      await this.escrowModel.create(
        {
          orderId: order.id,
          contractId: contractData.id,
          projectId: projectWallet.id,
          rfqRequestId: order.RfqRequestId,
          initialPrice: contractData.totalCost,
          commisionPercentage: commission.percentageNumber,
          commisionValue: commision,
          finalAmount: contractData.totalCost - commision,
          status: EscrowStatus.PENDING,
        },
        { transaction: dbTransaction },
      );

      await this.projectWalletModel.decrement(
        {
          balance: contractData.totalCost,
        },
        { where: { id: projectWallet.id }, transaction: dbTransaction },
      );

      await this.contractModel.update(
        {
          status: ContractStatus.ACCEPTED,
          paymentStatus: ContractPaymentStatus.PROCESSING,
        },
        { where: { id: contractId }, transaction: dbTransaction },
      );

      const updatedOrder = await this.orderModel.update(
        {
          status: OrderStatus.PAID,
        },
        {
          where: { ContractId: contractData.id },
          returning: true,
          transaction: dbTransaction,
        },
      );

      await this.projectModel.update(
        {
          status: ProjectStatus.ACTIVE,
        },
        {
          where: { id: projectWallet.ProjectId },
          transaction: dbTransaction,
        },
      );

      await this.projectModel.increment(
        {
          amountSpent: contractData.totalCost,
        },
        {
          where: { id: projectWallet.ProjectId },
          transaction: dbTransaction,
        },
      );

      await this.projectTransactionModel.create(
        {
          walletId: user.walletId,
          ProjectWalletId: projectWallet.id,
          amount: contractData.totalCost,
          ProjectId: projectWallet.ProjectId,
          description: projectWallet.Project.description,
          userType: TransactionType.TRANSFER,
          status: TransactionStatus.COMPLETED,
          fee: 0,
          paymentMethod: PaymentMethod.CUTSTRUCT_PAY,
          paymentProvider: PaymentProvider.CUTSTRUCT_PAY,
          paymentPurpose: SystemPaymentPurpose.FUND_ORDER,
          reference: generateReference(),
          CreatedById: user.id,
        },
        { transaction: dbTransaction },
      );
      await dbTransaction.commit();
      const [affectedCount, affectedRows] = updatedOrder;
      return affectedRows[0];
    } catch (error) {
      await dbTransaction.rollback();
      throw new BadRequestException(
        `Failed to pay for RFQ Contract: ${error.message}`,
      );
    }
  }
}
