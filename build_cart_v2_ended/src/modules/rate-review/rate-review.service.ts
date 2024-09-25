import { Injectable } from '@nestjs/common';
import { RateReview } from './model/rateReview.model';
import { InjectModel } from '@nestjs/sequelize';
import { ContractService } from 'src/modules/contract/contract.service';
import { User } from 'src/modules/user/models/user.model';
import { RateReviewBuilderDto, RateReviewVendorDto } from '../builder/dto';

@Injectable()
export class RateReviewService {
  constructor(
    @InjectModel(RateReview)
    private readonly rateReviewVendorModel: typeof RateReview,
    private readonly contractService: ContractService,
  ) {}
  /**
   * Rate a vendor by either creating or updating rate review model for a contract service
   * @param rateReviewVendorDto - the vendor rate review data to be created
   * @param user  - the user(builder) rating and reviewing a vendor
   * @param contractId - ID of the contract to be rated and reviewed
   */
  async rateAndReviewVendor(
    rateReviewVendorDto: RateReviewVendorDto,
    user: User,
    contractId: string,
  ) {
    const contract = await this.contractService.getContractByIdForUser(
      contractId,
      user,
    );

    const calculatedRateScore = Math.round(
      (rateReviewVendorDto.defectControl +
        rateReviewVendorDto.onTimeDelivery +
        rateReviewVendorDto.effectiveCommunication +
        rateReviewVendorDto.specificationAccuracy) /
        4,
    );

    const rateScore = Math.min(calculatedRateScore, 5);

    await this.rateReviewVendorModel.upsert({
      onTimeDelivery: rateReviewVendorDto.onTimeDelivery,
      defectControl: rateReviewVendorDto.defectControl,
      effectiveCommunication: rateReviewVendorDto.effectiveCommunication,
      specificationAccuracy: rateReviewVendorDto.specificationAccuracy,
      vendorReview: rateReviewVendorDto.review,
      deliveryPictures: rateReviewVendorDto.deliveryPictures,
      ContractId: contract.id,
      BuilderId: contract.BuilderId,
      VendorId: contract.VendorId,
      vendorRateScore: rateScore,
    });
  }

  async getVendorRateReviews(user: User) {
    return await this.rateReviewVendorModel.findAll({
      where: { VendorId: user.VendorId },
    });
  }

  async getBuilderRateReviews(user: User) {
    return await this.rateReviewVendorModel.findAll({
      where: { BuilderId: user.BuilderId },
    });
  }

  /**
   * Rate a builder by either creating or updating rate review model for a contract service
   * @param rateReviewBuilderDto - the builder rate review data to be created
   * @param user  - the user(vendor) rating and reviewing a builder
   * @param contractId - ID of the contract to be rated and reviewed
   */
  async rateAndReviewBuilder(
    rateReviewBuilderDto: RateReviewBuilderDto,
    user: User,
    contractId: string,
  ) {
    const contract = await this.contractService.getContractByIdForUser(
      contractId,
      user,
    );

    return await this.rateReviewVendorModel.upsert({
      ContractId: contract.id,
      BuilderId: contract.BuilderId,
      VendorId: contract.VendorId,
      builderReview: rateReviewBuilderDto.review,
      builderRateScore: Math.round(rateReviewBuilderDto.rateScore),
    });
  }
}
