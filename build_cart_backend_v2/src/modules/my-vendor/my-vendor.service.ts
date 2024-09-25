import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Vendor } from 'src/modules/vendor/models/vendor.model';
import { MyVendor } from './models/myVendor.model';
import { WhereOptions } from 'sequelize/types/model';
import { Op } from 'sequelize';
import { RateReview } from '../rate-review/model/rateReview.model';
import { Contract, ContractStatus } from '../contract/models/contract.model';
import { RfqCategory } from '../rfq/models/rfqCategory.model';
import { Product } from '../product/models/product.model';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class MyVendorService {
  constructor(
    @InjectModel(MyVendor)
    private readonly myVendorModel: typeof MyVendor,
    private sequelize: Sequelize,
  ) {}

  /**
   * Adds a vendor to the current builder's list of my vendors.
   * @param builderId The ID of the current builder.
   * @param vendorId The ID of the vendor to add to my vendors.
   * @throws if vendor already added to list.
   */
  async addVendorToMyVendors(
    builderId: string,
    vendorId: string,
  ): Promise<void> {
    const myVendor = await this.myVendorModel.findOne({
      where: {
        BuilderId: builderId,
        VendorId: vendorId,
      },
    });

    if (!myVendor) {
      await this.myVendorModel.create({
        BuilderId: builderId,
        VendorId: vendorId,
      });
    }
  }

  /**
   * Retrieves all vendors that belong to the current builder's list of my vendors.
   * @param builderId The ID of the current builder.
   * @returns A list of vendors that belong to my vendors.
   */
  async getMyVendors(builderId: string, query?: string): Promise<any> {
    const whereOptions: WhereOptions<MyVendor> = { BuilderId: builderId };
    if (query) {
      whereOptions[Op.or] = [
        this.sequelize.literal(
          `"Vendor"."businessName"::text ILIKE '%${query}%'`,
        ),
        this.sequelize.literal(
          `"Vendor"."businessAddress"::text ILIKE '%${query}%'`,
        ),
        this.sequelize.literal(
          `"Vendor"."VendorType"::text ILIKE '%${query}%'`,
        ),
      ];
    }
    const myVendors = await this.myVendorModel.findAll({
      where: whereOptions,
      include: [
        {
          model: Vendor,
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
        },
      ],
    });

    const result = await Promise.all(
      myVendors.map(async (myvendor) => {
        const completedOrders = myvendor.Vendor.RateReviews.map(
          (rateReview) => rateReview.Contract,
        ).filter((contract) => contract?.status === ContractStatus.COMPLETED);

        const totalRating = myvendor.Vendor.RateReviews.reduce(
          (sum, review) => sum + review.vendorRateScore,
          0,
        );
        const averageRating =
          myvendor.Vendor.RateReviews.length > 0
            ? Math.min(
                Math.round(totalRating / myvendor.Vendor.RateReviews.length),
                5,
              )
            : 0;
        const categoryTitles = myvendor.Vendor.RfqCategories;
        return {
          id: myvendor.Vendor.id,
          name: myvendor.Vendor.businessName,
          vendorType: myvendor.Vendor.VendorType,
          vendorCategory: categoryTitles,
          location: myvendor.Vendor.businessAddress,
          rating: averageRating,
          completedProjectCount: completedOrders.length,
        };
      }),
    );

    return result;
  }

  async getMyVendorById(builderId: string, vendorId: string) {
    try {
      const myVendor = await this.myVendorModel.findOne({
        where: {
          BuilderId: builderId,
          VendorId: vendorId,
        },
        include: [
          {
            model: Vendor,
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
              {
                model: Product,
              },
            ],
          },
        ],
      });

      if (!myVendor) {
        return null;
      }

      const totalRating = myVendor.Vendor.RateReviews.reduce(
        (sum, review) => sum + review.vendorRateScore,
        0,
      );
      const averageRating =
        myVendor.Vendor.RateReviews.length > 0
          ? Math.min(
              Math.round(totalRating / myVendor.Vendor.RateReviews.length),
              5,
            )
          : 0;
      const categoryTitles = myVendor.Vendor.RfqCategories;
      const vendorStats = {
        rating: averageRating,
        categoryTitles: categoryTitles,
      };
      return { myVendor, vendorStats };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
