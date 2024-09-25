import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Dispute, DisputeStatus } from './models/dispute.model';
import { User } from 'src/modules/user/models/user.model';
import { ContractService } from 'src/modules/contract/contract.service';
import { Contract, ContractStatus } from 'src/modules/contract/models';
import { Builder } from 'src/modules/builder/models/builder.model';
import { Vendor } from 'src/modules/vendor/models/vendor.model';
import { RfqRequest } from '../rfq/models';
import { Sequelize } from 'sequelize-typescript';
import { CreateDisputeDto } from '../builder/dto';
import { Project } from '../project/models/project.model';
import { Op } from 'sequelize';

@Injectable()
export class DisputeService {
  constructor(
    @InjectModel(Dispute)
    private readonly disputeModel: typeof Dispute,
    private readonly contractService: ContractService,
    private readonly sequelize: Sequelize,
  ) {}

  async getAllDisputes(includeModels = false) {
    return await this.disputeModel.findAll({
      include: includeModels
        ? [{ model: Contract }, { model: Vendor }, { model: Builder }]
        : [],
    });
  }

  async getOngoingDisputes(fundManagerId: string) {
    return await this.disputeModel.findAll({
      where: { status: DisputeStatus.PENDING },
      include: [
        {
          model: Contract,
          where: { FundManagerId: fundManagerId },
        },
        { model: Vendor },
        { model: Builder },
      ],
    });
  }

  async getDisputesResolutions(fundManagerId: string) {
    return await this.disputeModel.findAll({
      where: {
        status: { [Op.in]: [DisputeStatus.PENDING, DisputeStatus.RESOLVED] },
      },
      include: [
        {
          model: Contract,
          where: { FundManagerId: fundManagerId },
        },
        { model: Vendor },
        { model: Builder },
      ],
    });
  }

  async getResolvedDisputes(fundManagerId: string) {
    return await this.disputeModel.findAll({
      where: { status: DisputeStatus.RESOLVED },
      include: [
        {
          model: Contract,
          where: { FundManagerId: fundManagerId },
        },
        ,
        { model: Vendor },
        { model: Builder },
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

  async getDisputeById(disputeId: string, includeModels = false) {
    return await this.disputeModel.findByPkOrThrow(disputeId, {
      include: includeModels
        ? [{ model: Contract }, { model: Vendor }, { model: Builder }]
        : [],
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
    } catch (error) {
      await dbTransaction.rollback();
      throw new BadRequestException(
        'we could not resolve the dispute at this time ',
      );
    }
  }

  async refund(disputeId: string, user: User) {
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
      { where: { id: disputeId } },
    );

    await this.contractService.cancelContract(dispute.ContractId, user);
  }
}
