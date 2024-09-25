import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Op, Transaction } from 'sequelize';
import { Vendor } from './models/vendor.model';
import { UserService } from 'src/modules/user/user.service';
import { User } from 'src/modules/user/models/user.model';

import { DocumentsService } from '../documents/documents.service';
import { TwilioService } from '../twilio/twilio.service';
import { EmailService } from '../email/email.service';
import { ContractService } from '../contract/contract.service';
import { RfqQuoteService } from '../rfq/rfq-quote.service';
import {
  RfqCategory,
  RfqQuoteBargainStatus,
  RfqRequestMaterial,
} from '../rfq/models';
import { VendorRfqCategory } from './models/vendor-rfqCategory.model';
import { VendorRfqBlacklist } from './models/vendor-rfqBlacklist';
import { CreateVendorRfqBlacklistDto } from './dto/create-rdfBlacklist.dto';
import { CreateRfqQuoteDto } from './dto';
import { VendorAcceptRfqOrBargainDTO } from '../builder/dto/create-rfqbargain.dto';

@Injectable()
export class VendorRfqService {
  constructor(
    @InjectModel(VendorRfqCategory)
    private readonly vendorRfqCategoryModel: typeof VendorRfqCategory,
    @InjectModel(VendorRfqBlacklist)
    private readonly vendorRfqBlacklistModel: typeof VendorRfqBlacklist,
    @InjectModel(RfqRequestMaterial)
    private readonly rfqRequestMaterial: typeof RfqRequestMaterial,
    private userService: UserService,
    private contractService: ContractService,
    private rfqQuoteService: RfqQuoteService,
    private readonly twillioService: TwilioService,
    private documentService: DocumentsService,
    private sequelize: Sequelize,
    private emailService: EmailService,
  ) {}

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

  // async getVendorsGroupedByCategoryName() {
  //   const groupedVendors: Vendor[] | [] = await Vendor.findAll({
  //     include: [
  //       {
  //         model: RfqCategory,
  //       },
  //     ],
  //   });

  //   const categoryMap = new Map();

  //   for (const vendor of groupedVendors) {
  //     const vendorData = {
  //       id: vendor.id,
  //       companyName: Vendor.businessName,
  //       email: vendor.email,
  //     };

  //     for (const category of vendor.RfqCategories) {
  //       const categoryName = category.title || 'Uncategorized';

  //       if (!categoryMap.has(categoryName)) {
  //         categoryMap.set(categoryName, {
  //           categoryName,
  //           id: category.id,
  //           vendors: [],
  //           total: 0,
  //         });
  //       }

  //       categoryMap.get(categoryName).vendors.push(vendorData);
  //       categoryMap.get(categoryName).total += 1;
  //     }
  //   }

  //   const outputResult = [];
  //   for (const [, category] of categoryMap) {
  //     outputResult.push({
  //       [category.categoryName]: category.vendors,
  //       total: category.total,
  //       id: category.id,
  //     });
  //   }

  //   return outputResult;
  // }

  async createRfqBlacklist({
    createDto,
    user,
  }: {
    createDto: CreateVendorRfqBlacklistDto;
    user: User;
  }): Promise<VendorRfqBlacklist> {
    try {
      const exitClosed = await this.vendorRfqBlacklistModel.findOne({
        where: {
          RfqRequestId: createDto.RfqRequestId,
          VendorId: user.VendorId,
        },
      });
      if (exitClosed)
        throw new BadRequestException('already blacklisted this RFQ');
      return await this.vendorRfqBlacklistModel.create({
        ...createDto,
        createdAt: new Date(),
        CreatedById: user.id,
        VendorId: user.VendorId,
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async acceptMaterialRequest({
    user,
    rfqMaterialRequestId,
    dbTransaction,
  }: {
    user: User;
    rfqMaterialRequestId: string;
    dbTransaction?: Transaction;
  }) {
    if (!dbTransaction) {
      dbTransaction = await this.sequelize.transaction();
    }
    try {
      const matBudgetData = await this.rfqRequestMaterial.findOrThrow({
        where: { id: rfqMaterialRequestId },
        include: [{ all: true }],
      });
      const newQuoteData = await this.rfqQuoteService.createQuote({
        body: {
          materials: [
            {
              rfqRequestMaterialId: rfqMaterialRequestId,
              price:
                Number(matBudgetData.budget) / Number(matBudgetData.quantity),
              quantity: Number(matBudgetData.quantity),
              description: 'express acceptance',
            },
          ],
          rfqRequestId: matBudgetData?.RfqRequestId,

          canBargain: false,
          deliveryDate: matBudgetData.RfqRequest.deliveryDate,
          tax: matBudgetData.RfqRequest.tax ? 10 : 0,
          logisticCost: 0,
        },
        user,
        dbTransaction,
      });

      await this.rfqQuoteService.acceptBid({
        RfqQuoteId: newQuoteData?.id,
        dbTransaction,
        user,
        body: {
          ...newQuoteData,
          ...matBudgetData,
          RfqQuoteId: newQuoteData.id,
          ProjectId: matBudgetData?.RfqRequest?.ProjectId,
        },
      });

      await dbTransaction.commit();
      return newQuoteData;
    } catch (error) {
      await dbTransaction.rollback();
      throw new BadRequestException(error.message);
    }
  }

  async getMaterialRequest(rfqMaterialRequestId: string) {
    try {
      return await this.rfqRequestMaterial.findOrThrow({
        where: { id: rfqMaterialRequestId },
        include: [{ all: true }],
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async vendorCreateQuote({
    user,
    body,
  }: {
    user: User;
    body: CreateRfqQuoteDto;
  }) {
    const dbTransaction = await this.sequelize.transaction();
    try {
      const newQuote = await this.rfqQuoteService.createQuote({
        body,
        user,
        dbTransaction,
      });
      dbTransaction.commit();
      return newQuote;
    } catch (error) {
      dbTransaction.rollback();
      throw new BadRequestException(error.message);
    }
  }
}
