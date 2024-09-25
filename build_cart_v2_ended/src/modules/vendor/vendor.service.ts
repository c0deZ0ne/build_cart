import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Op, Transaction } from 'sequelize';
import { Vendor, VendorStatus, VendorTier } from './models/vendor.model';
import { RegisterVendorDto } from './dto/register-vendor.dto';
import { UserService } from 'src/modules/user/user.service';
import { User, UserType } from 'src/modules/user/models/user.model';
import {
  UpdateVendorCategoryDto,
  UpdateVendorDocuments,
  UpdateVendorProfileDto,
} from './dto';
import { RateReview } from 'src/modules/rate-review/model/rateReview.model';
import { DocumentsService } from '../documents/documents.service';
import { WhereOptions } from 'sequelize';
import { EmailService } from '../email/email.service';
import { ContractService } from '../contract/contract.service';
import { Contract, ContractStatus } from '../contract/models';
import {
  VerifymeCheck,
  calculatePercentageChange,
  generateStoreNumber,
} from 'src/util/util';
import { RfqQuoteService } from '../rfq/rfq-quote.service';
import { RfqCategory, RfqQuote, RfqQuoteStatus } from '../rfq/models';
import { VendorRfqCategory } from './models/vendor-rfqCategory.model';
import { VendorRfqBlacklist } from './models/vendor-rfqBlacklist';
import { RegisterVendorFromMarketDto } from './dto/register-vendor-from-market.dto';
import { TemporaryVendorService } from '../temporary-vendor/temporary-vendor.service';
import { Builder } from '../builder/models/builder.model';
import { string } from 'joi';
import { InvitationService } from '../invitation/invitation.service';
import { MyVendorService } from '../my-vendor/my-vendor.service';
import { Product } from '../product/models/product.model';

@Injectable()
export class VendorService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
    @InjectModel(Vendor)
    private readonly vendorModel: typeof Vendor,
    @InjectModel(VendorRfqCategory)
    private readonly vendorRfqCategoryModel: typeof VendorRfqCategory,
    @InjectModel(RfqQuote)
    private readonly rfqQuoteModel: typeof RfqQuote,
    @InjectModel(VendorRfqBlacklist)
    private readonly vendorRfqBlacklistModel: typeof VendorRfqBlacklist,
    private userService: UserService,
    private contractService: ContractService,
    private rfqQuoteService: RfqQuoteService,
    private documentService: DocumentsService,
    private sequelize: Sequelize,
    private emailService: EmailService,
    private temporaryVendorService: TemporaryVendorService,
    private inviteService: InvitationService,
    private myvendorService: MyVendorService,
  ) {}
  /**
   * Registers a new vendor with the provided email and password.
   *
   * @param registerVendorDto The DTO containing the email and password of the new vendor.
   * @returns The created vendor with a generated email OTP.
   * @throws BadRequestException if the provided email is already in use.
   */

  async registerVendor({
    body,
    dbTransaction,
  }: {
    body: RegisterVendorDto;
    dbTransaction?: Transaction;
  }): Promise<string> {
    if (!dbTransaction) {
      dbTransaction = await this.sequelize.transaction();
    }

    try {
      const userData = await this.userService.getUserById(body.UserId);

      if (!userData || !userData.emailVerified) {
        throw new BadRequestException(
          'There was an error in the registration process or account not verified yet. Please try again or verify your account details.',
        );
      }

      await this.checkVendorExistence(userData.email);
      let IsVerifiedFromVerifyme = false;

      if (body.businessRegNo) {
        IsVerifiedFromVerifyme = await VerifymeCheck(body.businessRegNo);
      }

      const vendorData = await this.vendorModel.create(
        {
          ...body,
          businessName: body.businessName
            ? body.businessName
            : userData.businessName,
          phone: userData.phoneNumber,
          termOfService: true,
          email: userData.email,
          ownerId: body.UserId,
          createdById: userData.id,
          updatedById: userData.id,
          status: IsVerifiedFromVerifyme
            ? VendorStatus.APPROVED
            : VendorStatus.PENDING,
          tier: IsVerifiedFromVerifyme ? VendorTier.one : VendorTier.two,
          createdAt: new Date(),
          lastLogin: new Date(),
        },
        { transaction: dbTransaction },
      );

      await this.addRfqCategoriesToVendor({
        vendorId: vendorData.id,
        rfqCategoryIds: body.categories,

        dbTransaction,
      });

      const updateData = await User.update(
        { VendorId: vendorData.id, userType: UserType.SUPPLIER },
        {
          where: {
            id: body.UserId,
          },
          transaction: dbTransaction,
          returning: true,
        },
      );

      const [affectedCount, affectedRows] = updateData;
      if (!affectedCount)
        throw new Error(
          'Please try again  we could not update your account userType',
        );
      await dbTransaction.commit();
      // return { affectedRows: affectedRows[0], vendorId: vendorData.id };
      return vendorData.id;
    } catch (error) {
      dbTransaction.rollback();
      throw new BadRequestException(error.message);
    }
  }

  async addVendorToBuilder(invitationId: string, vendorId: string) {
    const invite = await this.inviteService.getInvitationById(invitationId);
    if (invite) {
      // Check if Invitation is from a Builder
      const builderId = invite.CreatedBy?.BuilderId;
      if (builderId) {
        await this.myvendorService.addVendorToMyVendors(builderId, vendorId);
        return { message: 'Vendor Successfully added to MyVendor List' };
      }
    }
  }

  async registerVendorFromRetail(data: RegisterVendorFromMarketDto) {
    const dbTransaction = await this.sequelize.transaction();
    const temporaryVendor = await this.temporaryVendorService.getUserByEmail(
      data.email,
    );

    const { companyName, country, phone, categories } = temporaryVendor;
    const { email, password, businessName } = data;

    const parseArray = JSON.parse(categories as unknown as string);

    const newCategory = parseArray.map((item) => item);

    try {
      const createdUser = await this.userService.createUser({
        userData: {
          email,
          password,
          location: country,
          phoneNumber: phone,
          name: companyName,
        },
      });

      const userData = await this.userService.getUserById(createdUser.id);

      await this.checkVendorExistence(userData.email);
      const store_number = generateStoreNumber(8);

      const vendorData = await this.vendorModel.create(
        {
          email,
          phone,
          businessName,
          store_number,
          market_vendor: true,
          createdById: userData.id,
          updatedById: userData.id,
          status: VendorStatus.PENDING,
          tier: VendorTier.two,
          createdAt: new Date(),
          lastLogin: new Date(),
        },
        // { transaction: dbTransaction },
      );

      const categories = await RfqCategory.findAll({
        attributes: ['id'],
        where: {
          title: {
            [Op.in]: newCategory,
          },
        },
      });

      const rfqCategoryIds = categories.map((category) => category.id);

      await this.addRfqCategoriesToVendor({
        vendorId: vendorData.id,
        rfqCategoryIds,
        dbTransaction,
      });

      const updateData = await User.update(
        { VendorId: vendorData.id, userType: UserType.SUPPLIER },
        {
          where: {
            id: createdUser.id,
          },
          returning: true,
        },
      );

      const [affectedCount, affectedRows] = updateData;
      if (!affectedCount)
        throw new Error(
          'Please try again  we could not update your account userType',
        );

      await this.temporaryVendorService.deleteTemporaryVendor(data.email);
      await dbTransaction.commit();
      return affectedRows[0];
    } catch (error) {
      dbTransaction.rollback();
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Checks if a vendor with the provided email already exists.
   *
   * @param email The email to check.
   * @throws BadRequestException if a vendor with the provided email already exists.
   */
  async checkVendorExistence(email: string) {
    const vendor = await this.vendorModel.findOne({ where: { email } });
    if (vendor) {
      throw new BadRequestException('email already in use');
    }
  }

  /**
   * Check vendor legal info is true && check if document is uploaded
   *  * @param vendorId The ID of the vendor to retrieve
   *   update vendor status
   */
  async shouldVerifyKyc(VendorId: string) {
    // todo: verifyMe
    const vendor = await this.getVendorById(VendorId);

    const document = await this.documentService.retrieveDocuments(VendorId);

    if (vendor.legalInfo === true && document) {
      await this.vendorModel.update(
        {
          status: VendorStatus.APPROVED,
        },
        { where: { id: VendorId } },
      );
    }
  }

  /**
   * Return an object of KYC status of a vendor
   *  * @param vendorId The ID of the vendor to retrieve
   * * @returns {documentUploaded: boolean, legalInfo: boolean}
   *   update vendor status
   */
  async kycStatus(VendorId: string) {
    const vendor = await this.getVendorById(VendorId);

    const document = await this.documentService.retrieveDocuments(VendorId);

    return {
      documentUploaded: document ? true : false,
      legalInfo: vendor?.legalInfo ? true : false,
    };
  }

  /**
   * Get a vendor by ID
   * @param vendorId The ID of the vendor to retrieve
   * @returns A promise that resolves with the vendor object or throws an error if the vendor is not found
   */
  async getVendorById(vendorId: string) {
    const vendor = await this.vendorModel.findByPkOrThrow(vendorId, {
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
        { model: RfqCategory, attributes: ['id', 'title'] },
        {
          model: Product,
        },
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
    const categoryTitles = vendor.RfqCategories;
    const vendorStats = {
      rating: averageRating,
      categoryTitles: categoryTitles,
    };
    return {
      ...vendor.toJSON(),
      vendorStats,
    };
  }

  /**
   * Fetch all vendors
   * @returns all vendor objects
   */
  async fetchVendors(status?: VendorStatus.APPROVED) {
    const whereOptions: WhereOptions<Vendor> = {};

    if (status) whereOptions.status = status;
    return await this.vendorModel.findAll({
      where: whereOptions,
      include: [
        {
          model: RateReview,
          include: [
            {
              model: Builder,
            },
          ],
        },
        { model: RfqCategory },
      ],
    });
  }

  /**
   * Fetch vendors that have a specific category
   * @param categoryId The category to search for by rfqCategory Id
   * @returns all vendor objects that have the specified category
   */
  async fetchVendorsForCategory(categoryId: string) {
    return await this.vendorRfqCategoryModel.findAll({
      where: {
        RfqCategoryId: categoryId,
      },
      include: [{ model: Vendor }, { model: RfqCategory }],
    });
  }

  async addRfqCategoriesToVendor({
    vendorId,
    rfqCategoryIds,
    dbTransaction,
  }: {
    vendorId: string;
    rfqCategoryIds: string[];
    dbTransaction: Transaction;
  }): Promise<RfqCategory[]> {
    try {
      const rfqCategories = await RfqCategory.findAll({
        where: {
          id: {
            [Op.in]: rfqCategoryIds,
          },
        },
      });
      const validRfqCategoryIds = rfqCategories.map((category) => category.id);
      const bulkCreateData = validRfqCategoryIds.map((categoryId) => {
        return {
          VendorId: vendorId,
          createdAt: new Date(),
          RfqCategoryId: categoryId,
        };
      });

      await this.vendorRfqCategoryModel.bulkCreate(bulkCreateData, {
        transaction: dbTransaction,
        ignoreDuplicates: true,
      });

      return RfqCategory.findAll({
        where: {
          id: {
            [Op.in]: validRfqCategoryIds,
          },
        },
      });
    } catch (error) {
      throw new BadRequestException(
        'error occurred while trying to add categories Please contact support',
      );
    }
  }

  async addSingleCategory({
    categoryId,
    VendorId,
  }: {
    categoryId: string;
    VendorId: string;
  }) {
    try {
      const vendorRfqCategory = await this.vendorRfqCategoryModel.findOne({
        where: {
          VendorId: VendorId,
          RfqCategoryId: categoryId,
        },
      });
      if (vendorRfqCategory)
        throw new Error(
          'already added this category to your list of categories',
        );
      return await this.vendorRfqCategoryModel.create({
        VendorId: VendorId,
        createdAt: new Date(),
        RfqCategoryId: categoryId,
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async bulkDeleteVendorCategories({
    updateVendorCategory: updateVendorCategory,
    vendorId,
  }: {
    updateVendorCategory: UpdateVendorCategoryDto;
    vendorId: string;
  }) {
    const dbTransaction = await this.sequelize.transaction();
    try {
      await this.vendorRfqCategoryModel.destroy({
        where: {
          VendorId: vendorId,
          [Op.or]: {
            RfqCategoryId: updateVendorCategory.RfqCategories,
          },
        },
        transaction: dbTransaction,
      });

      await dbTransaction.commit();
      return await this.vendorRfqCategoryModel.findAll({
        where: {
          VendorId: vendorId,
        },
        include: [{ model: RfqCategory }],
      });
    } catch (error) {
      await dbTransaction.rollback();
      throw new BadRequestException(error.message);
    }
  }

  async removeCategoryFromUserList({
    categoryId,
    VendorId,
  }: {
    categoryId: string;
    VendorId: string;
  }) {
    try {
      const vendorRfqCategory = await this.vendorRfqCategoryModel.findOne({
        where: {
          VendorId: VendorId,
          RfqCategoryId: categoryId,
        },
      });
      if (!vendorRfqCategory)
        throw new Error(
          'Category does not exist or not in your list of categories',
        );
      await vendorRfqCategory.destroy();
      return vendorRfqCategory;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getVendorsGroupedByCategoryName() {
    const groupedVendors: Vendor[] | [] = await Vendor.findAll({
      include: [
        {
          model: RfqCategory,
        },
      ],
    });

    const categoryMap = new Map();

    for (const vendor of groupedVendors) {
      const vendorData = {
        id: vendor.id,
        companyName: vendor.businessName,
        email: vendor.email,
      };

      for (const category of vendor.RfqCategories) {
        const categoryName = category.title || 'Uncategorised';

        if (!categoryMap.has(categoryName)) {
          categoryMap.set(categoryName, {
            categoryName,
            id: category.id,
            vendors: [],
            total: 0,
          });
        }

        categoryMap.get(categoryName).vendors.push(vendorData);
        categoryMap.get(categoryName).total += 1;
      }
    }

    const outputResult = [];
    for (const [, category] of categoryMap) {
      outputResult.push({
        [category.categoryName]: category.vendors,
        total: category.total,
        id: category.id,
      });
    }

    return outputResult;
  }

  /**
   * Update a vendor's profile
   * @param vendorId The ID of the vendor to update
   * @param updateVendorDto The DTO containing the updated vendor information
   */

  async updateProfile(
    vendorId: string,
    updateVendorDto: UpdateVendorProfileDto,
  ) {
    try {
      await this.vendorModel.findByPkOrThrow(vendorId, {
        include: [{ model: User, as: 'owner' }],
      });
      await this.vendorModel.update(
        {
          ...updateVendorDto,
        },
        {
          where: { id: vendorId },
        },
      );
      await this.userModel.update(
        {
          ...updateVendorDto,
          email: undefined,
        },
        {
          where: { VendorId: vendorId },
        },
      );
      return { message: 'vendor Profile updated successfully' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Update a vendor's profile
   * @param vendorId The ID of the vendor to update
   * @param UpdateVendorDocuments The DTO containing the updated vendor information
   */
  async updateVendorDocuments(vendorId: string, data: UpdateVendorDocuments) {
    const [, affectedRows] = await this.vendorModel.update(
      { ...data },
      { where: { id: vendorId }, returning: true },
    );
    return affectedRows[0];
  }

  /**
   * Update a vendor's category
   * @param vendorId The ID of the vendor to update
   * @param updateVendorDto The DTO containing the updated vendor information
   */
  async addVendorCategory({
    vendorId,
    updateVendorCategory: updateVendorCategory,
  }: {
    vendorId: string;
    updateVendorCategory: UpdateVendorCategoryDto;
  }) {
    const dbTransaction = await this.sequelize.transaction();
    try {
      const { RfqCategories } = updateVendorCategory;
      const currentVendCategory = await this.vendorRfqCategoryModel.findAll({
        where: { VendorId: vendorId },
      });

      const newCat = RfqCategories.filter(
        (d) => !currentVendCategory.some((cat) => cat.id === d),
      );

      const catData = await this.addRfqCategoriesToVendor({
        vendorId,
        rfqCategoryIds: newCat,
        dbTransaction,
      });
      dbTransaction.commit();
      return catData;
    } catch (error) {
      dbTransaction.rollback();
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Update a vendor's profile
   * @param vendorId The ID of the vendor to update
   * @param updateVendorDto The DTO containing the updated vendor information
   */
  // async adminUpdateVendorProfile(
  //   vendorId: string,
  //   updateVendorDto: AdminUpdateVendorProfileDto,
  // ) {
  //   await this.getVendorById(vendorId);
  //   const {
  //     logo,
  //     businessSize,
  //     about,
  //     phone,
  //     businessAddress,
  //     businessRegNo,
  //     businessName,
  //   } = updateVendorDto;
  //   await this.vendorModel.update(
  //     {
  //       logo,
  //       businessSize,
  //       businessName,
  //       businessAddress,
  //       about,
  //       phone,
  //       tradingName,
  //       businessRegNo,
  //     },
  //     { where: { id: vendorId } },
  //   );
  // }

  /**
   * Get a vendor profile overview
   * @param Vendor User of get overview
   */
  async ProfileOverview(user: User) {
    const vendorProfile = await this.getVendorById(user.VendorId);
    return {
      vendorProfile,
    };
  }

  /**
   * Get a vendor profile overview
   * @param Vendor User of get overview
   */
  async dashboardOverview(user: User) {
    const contracts = (await this.contractService.getAllContractsForUser(user))
      .rows;
    let overallEarnings = 0;
    let paidOutMonthlyEarnings = 0;
    let pendingMonthlyEarnings = 0;
    let completedContracts = 0;
    let pendingContracts = 0;

    const submittedBid = await this.rfqQuoteModel.findAndCountAll({
      where: { VendorId: user.VendorId },
    });
    const bidData = submittedBid.rows.reduce(
      (acc, curr) => {
        if (curr.status == RfqQuoteStatus.REJECTED) {
          acc.rejectBids += 1;
        } else if (
          curr.status == RfqQuoteStatus.PENDING ||
          curr.status == RfqQuoteStatus.REOPENED
        ) {
          acc.PendingBids += 1;
        } else if (curr.status == RfqQuoteStatus.ACCEPTED) {
          acc.BidAccepted += 1;
        }
        return acc;
      },
      {
        BidAccepted: 0,
        PendingBids: 0,
        rejectBids: 0,
        totalBids: submittedBid.count,
      },
    );

    const currentYear = new Date().getFullYear();
    const earningTrendPerMonth = new Array(new Date().getMonth() + 1).fill(0);

    contracts
      .filter((contract) => contract.status !== ContractStatus.CANCELLED)
      .forEach((contract) => {
        const amountEarned = Number(contract.totalCost) - Number(contract.fee);
        const monthIndex = contract.createdAt.getMonth();
        if (contract.status === ContractStatus.COMPLETED) {
          overallEarnings += amountEarned;

          if (contract.createdAt.getFullYear() === currentYear) {
            earningTrendPerMonth[monthIndex] += amountEarned;
          }
        }
        if (
          contract.createdAt.getFullYear() === currentYear &&
          contract.createdAt.getMonth() === monthIndex
        ) {
          if (contract.status === ContractStatus.COMPLETED)
            paidOutMonthlyEarnings += amountEarned;
          else pendingMonthlyEarnings += amountEarned;
        }

        if (contract.status === ContractStatus.COMPLETED)
          completedContracts += 1;
        else pendingContracts += 1;
      });

    const earningPercentageChange =
      calculatePercentageChange(earningTrendPerMonth);

    const bids = await this.rfqQuoteService.getRfqQuotes(user);

    const bidOverview = new Array(12).fill(0);
    bids.forEach((bid) => {
      const monthIndex = bid.createdAt.getMonth();
      if (bid.createdAt.getFullYear() === currentYear) {
        bidOverview[monthIndex] += 1;
      }
    });

    const vendorProfile = await this.getVendorById(user.VendorId);
    return {
      vendorProfile,
      overallEarnings,
      earningPercentageChange,
      earningTrendPerMonth,
      completedContracts,
      pendingMonthlyEarnings,
      pendingContracts,
      paidOutMonthlyEarnings,
      bidOverview,
      wallet: user.wallet,
      bidData,
    };
  }
}
