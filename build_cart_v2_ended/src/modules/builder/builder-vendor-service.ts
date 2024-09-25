import { Vendor, VendorStatus } from '../vendor/models/vendor.model';
import { InjectModel } from '@nestjs/sequelize/dist/common/sequelize.decorators';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Op, WhereOptions } from 'sequelize';
import { RateReview } from '../rate-review/model/rateReview.model';
import { Contract, ContractStatus } from '../contract/models';
import { RfqCategory } from '../rfq/models';
import { EmailService } from '../email/email.service';
import {
  ICreateInvitationDto,
  InvitationDto,
} from '../invitation/dto/platformInvitation.dto';
import { User } from '../user/models/user.model';
import { Sequelize } from 'sequelize-typescript';
import { InvitationService } from '../invitation/invitation.service';

@Injectable()
export class BuilderVendorService {
  constructor(
    @InjectModel(Vendor)
    private readonly vendorModel: typeof Vendor,
    @InjectModel(User)
    private readonly userModel: typeof User,
    private emailService: EmailService,
    private sequelize: Sequelize,
    private inviteService: InvitationService,
  ) {}

  async getAllVendors(
    status?: VendorStatus.APPROVED,
    query?: string,
  ): Promise<any> {
    const whereOptions: WhereOptions<Vendor> = {};
    if (status) whereOptions.status = status;
    if (query) {
      whereOptions[Op.or] = [
        this.sequelize.literal(`"businessName"::text ILIKE '%${query}%'`),
        this.sequelize.literal(`"businessAddress"::text ILIKE '%${query}%'`),
        this.sequelize.literal(`"VendorType"::text ILIKE '%${query}%'`),
      ];
    }
    const vendors = await this.vendorModel.findAll({
      where: whereOptions,
      include: [
        {
          model: RateReview,
          as: 'RateReviews',
          include: [
            {
              model: Contract,
            },
          ],
        },
        {
          model: RfqCategory,
          attributes: ['title', 'id'],
        },
      ],
    });

    const result = await Promise.all(
      vendors.map(async (vendor) => {
        const completedOrders = vendor.RateReviews.map(
          (rateReview) => rateReview.Contract,
        ).filter((contract) => contract?.status === ContractStatus.COMPLETED);

        const totalRating = vendor.RateReviews.reduce(
          (sum, review) => sum + review.vendorRateScore,
          0,
        );
        const averageRating =
          vendor.RateReviews.length > 0
            ? Math.min(Math.round(totalRating / vendor.RateReviews.length), 5)
            : 0;
        const categoryTitles = vendor.RfqCategories;
        return {
          id: vendor.id,
          name: vendor.businessName,
          vendorType: vendor.VendorType,
          vendorCategory: categoryTitles,
          location: vendor.businessAddress,
          rating: averageRating,
          completedProjectCount: completedOrders.length,
        };
      }),
    );

    return result;
  }

  async sendInviteToVendor(data: InvitationDto, user: User) {
    const userExists = await this.userModel.findOne({
      where: { email: data.toEmail },
    });
    if (userExists) {
      throw new BadRequestException('User Already Exists on the Platform.');
    }
    return this.createInviteForVendor(data, user);
  }

  async createInviteForVendor(data: ICreateInvitationDto, user: User) {
    return await this.inviteService.createInvitationForVendor(data, user);
  }
}
