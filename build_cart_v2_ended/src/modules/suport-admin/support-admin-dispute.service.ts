import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/modules/user/models/user.model';
import { ContractService } from 'src/modules/contract/contract.service';
import { Contract, ContractStatus } from 'src/modules/contract/models';
import { Builder } from 'src/modules/builder/models/builder.model';
import { Vendor } from 'src/modules/vendor/models/vendor.model';
import { RfqQuote, RfqRequest, RfqRequestMaterial } from '../rfq/models';
import { Sequelize } from 'sequelize-typescript';
import { CreateDisputeDto } from '../builder/dto';
import { Dispute, DisputeStatus } from '../dispute/models/dispute.model';
import { Order, OrderStatus } from '../order/models';
import { Op } from 'sequelize';
import { RateReview } from '../rate-review/model/rateReview.model';
import { Project, ProjectStatus } from '../project/models/project.model';
import { Escrow, EscrowStatus } from '../escrow/models/escrow.model';
import { UserWallet } from '../user-wallet/models/user-wallet.model';

@Injectable()
export class SupportAdminDisputeService {
  constructor(
    @InjectModel(Vendor)
    private readonly vendorModel: typeof Vendor,
    @InjectModel(Builder)
    private readonly builderModel: typeof Builder,
    @InjectModel(Dispute)
    private readonly disputeModel: typeof Dispute,
    @InjectModel(Escrow)
    private readonly escrowModel: typeof Escrow,
    @InjectModel(UserWallet)
    private readonly userWalletModel: typeof UserWallet,
    private readonly contractService: ContractService,
    private readonly sequelize: Sequelize,
  ) {}

  async getAllDisputes() {
    return await this.disputeModel.findAll({
      include: [
        { model: Contract, include: [{ model: Order }] },
        { model: Vendor },
        { model: Builder },
      ],
    });
  }

  async getDisputes(type: string) {
    return await this.disputeModel.findAll({
      where: {
        status:
          type === 'ongoing'
            ? DisputeStatus.PENDING
            : { [Op.not]: DisputeStatus.PENDING },
      },
      include: [
        {
          model: Contract,
          include: [
            { model: Order, attributes: ['id', 'status'] },
            {
              model: RfqQuote,
              attributes: ['id', 'status', 'deliveryDate'],
              include: [
                {
                  model: RfqRequestMaterial,
                  attributes: ['id', 'name', 'quantity', 'metric'],
                },
              ],
            },
          ],
        },
        {
          model: Vendor,
          attributes: ['id', 'businessName', 'email', 'phone', 'VendorType'],
        },
        { model: Builder, attributes: ['id', 'businessName', 'email'] },
      ],
    });
  }

  async getRefunds() {
    return await this.disputeModel.findAll({
      where: { status: DisputeStatus.REFUNDED },
      include: [
        { model: Contract, include: [{ model: RfqRequest }] },
        { model: Vendor },
        { model: Builder },
      ],
    });
  }
  async getVendorBusinessInfo(vendorId: string) {
    const vendor = await this.vendorModel.findByPkOrThrow(vendorId, {
      include: [
        { model: Order, where: { status: OrderStatus.COMPLETED } },
        { model: RateReview },
      ],
    });

    const totalRating = vendor.RateReviews.reduce(
      (sum, review) => sum + review.vendorRateScore,
      0,
    );
    const averageRating =
      vendor.RateReviews.length > 0
        ? Math.min(Math.round(totalRating / vendor.RateReviews.length), 5)
        : 0;

    return { vendor, averageRating };
  }
  async getBuilderBusinessInfo(builderId: string) {
    const builder = await this.builderModel.findByPkOrThrow(builderId, {
      include: [
        {
          model: Project,
          as: 'CompanyProjects',
        },
        { model: RateReview },
      ],
    });

    const { CompanyProjects, RateReviews } = builder;

    const totalRating = RateReviews.reduce(
      (sum, review) => sum + review.vendorRateScore,
      0,
    );
    const averageRating =
      RateReviews.length > 0
        ? Math.min(Math.round(totalRating / builder.RateReviews.length), 5)
        : 0;
    let completedProjects = 0;
    CompanyProjects.map((project) => {
      if (project.status === ProjectStatus.COMPLETED) {
        completedProjects += 1;
      }
    });

    return { builder, averageRating, completedProjects };
  }

  async getDisputeById(disputeId: string) {
    return await this.disputeModel.findByPkOrThrow(disputeId, {
      include: [
        { model: Contract },
        { model: Vendor },
        { model: Builder },
        { model: User },
      ],
    });
  }

  async createDispute(
    { message, reason, proofs }: CreateDisputeDto,
    contractId: string,
    user: User,
  ) {
    const contract = await this.contractService.getContractByIdForUser(
      contractId,
      user,
      false,
    );

    if (contract.status !== ContractStatus.ACCEPTED) {
      throw new BadRequestException(
        `Cannot create dispute because contract is ${contract.status.toLowerCase()}`,
      );
    }

    if (
      await this.disputeModel.findOne({ where: { ContractId: contractId } })
    ) {
      throw new BadRequestException(`Dispute on this contract already exist`);
    }
    await this.disputeModel.create({
      VendorId: contract.VendorId,
      BuilderId: contract.BuilderId,
      ContractId: contract.id,
      CreatedById: user.id,
      message,
      reason,
      proofs,
    });
  }

  async resolveDispute(disputeId: string, user: User) {
    const dbTransaction = await this.sequelize.transaction();
    try {
      const dispute = await this.getDisputeById(disputeId);

      if (dispute.status === DisputeStatus.RESOLVED) {
        throw new BadRequestException(`This dispute is already resolved`);
      }

      if (dispute.status !== DisputeStatus.PENDING) {
        throw new BadRequestException(`This dispute no longer pending`);
      }

      await this.disputeModel.update(
        {
          status: DisputeStatus.RESOLVED,
          resolvedAt: new Date(),
        },
        { where: { id: disputeId } },
      );

      await this.contractService.confirmContract({
        contractId: dispute.ContractId,
        dbTransaction,
        user,
      });
      dbTransaction.commit();
      return dispute;
    } catch (error) {
      await dbTransaction.rollback();
      throw new BadRequestException(
        'we could not resolve the dispute at this time ',
      );
    }
  }

  async refund(disputeId: string, user: User) {
    const dbTransaction = await this.sequelize.transaction();
    try {
      const dispute = await this.getDisputeById(disputeId);
      if (dispute.status === DisputeStatus.REFUNDED) {
        throw new BadRequestException(`This dispute is already refunded`);
      }

      if (dispute.status !== DisputeStatus.PENDING) {
        throw new BadRequestException(`This dispute no longer pending`);
      }
      await this.disputeModel.update(
        {
          status: DisputeStatus.REFUNDED,
          refundedAt: new Date(),
        },
        { where: { id: disputeId }, transaction: dbTransaction },
      );

      await this.escrowModel.update(
        {
          status: EscrowStatus.CANCELLED,
        },
        {
          where: { contractId: dispute.ContractId },
          transaction: dbTransaction,
        },
      );

      await this.userWalletModel.increment(
        {
          balance: dispute.Contract.totalCost,
        },
        { where: { UserId: dispute.CreatedById }, transaction: dbTransaction },
      );

      await this.contractService.cancelContract(dispute.ContractId, user);
      dbTransaction.commit();
      return dispute;
    } catch (error) {
      await dbTransaction.rollback();
      throw new BadRequestException(
        'we could not resolve the dispute at this time ',
      );
    }
  }
}
