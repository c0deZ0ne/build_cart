import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../user/models/user.model';
import { InjectModel } from '@nestjs/sequelize';
import { FundManager } from '../fund-manager/models/fundManager.model';
import { EmailService } from '../email/email.service';
import { Op, WhereOptions } from 'sequelize';
import { RfqCategory, RfqItem, RfqRequestMaterial } from '../rfq/models';
import { UpdateVendorCategoryDto, UploadDocumentsDto } from '../vendor/dto';
import { Documents } from '../documents/models/documents.model';
import { Vendor } from '../vendor/models/vendor.model';
import { Product } from '../product/models/product.model';
import { RateReview } from '../rate-review/model/rateReview.model';
import { superAdminInviteVendorDto } from './dto/super-admin-invite-vendorDto';
import { Invitation } from '../invitation/models/invitation.model';
import { VendorService } from '../vendor/vendor.service';
import { UserLog } from '../user-log/models/user-log.model';
import { Order, OrderStatus } from '../order/models';
import { Builder } from '../builder/models/builder.model';
import { Contract } from '../contract/models';
import { UserWallet } from '../user-wallet/models/user-wallet.model';
import {
  TransactionStatus,
  TransactionType,
  UserTransaction,
} from '../user-wallet-transaction/models/user-transaction.model';

@Injectable()
export class SuperAdminVendorService {
  constructor(
    @InjectModel(Invitation)
    private readonly invitationModel: typeof Invitation,
    @InjectModel(Vendor)
    private readonly vendorModel: typeof Vendor,
    @InjectModel(Documents)
    private readonly documentsModel: typeof Documents,
    @InjectModel(UserLog)
    private readonly userLogModel: typeof UserLog,

    private readonly emailServices: EmailService,
    private vendorService: VendorService,
  ) {}

  async getVendors(query?: string) {
    const whereOptions: WhereOptions<FundManager> = {};
    if (query) {
      whereOptions[Op.or] = [{ businessName: { [Op.iLike]: `%${query}%` } }];
    }
    const vendors = await this.vendorModel.findAll({
      where: whereOptions,
      include: [
        { model: Product },
        { model: User, as: 'owner', attributes: { exclude: ['password'] } },
        { model: RfqCategory },
        { model: RateReview },
        { model: Product },
        { model: Order, where: { status: OrderStatus.COMPLETED } },
      ],
    });

    return vendors;
  }

  async getVendorById(vendorId: string) {
    const vendor = await this.vendorModel.findOne({
      where: { id: vendorId },
      include: [
        { model: Product },
        {
          model: User,
          as: 'owner',
          attributes: { exclude: ['password'] },
          include: [
            {
              model: UserWallet,
              include: [
                {
                  model: UserTransaction,
                },
              ],
            },
          ],
        },
        { model: RfqCategory },
        { model: RateReview },
        { model: Product },
        {
          model: Order,
          include: [
            { model: Builder },
            { model: Contract },
            { model: RfqRequestMaterial, include: [{ model: RfqItem }] },
          ],
        },
      ],
    });

    if (!vendor) throw new NotFoundException('vendor does not exist');
    let ongoingDelivery = 0;
    let lifetimeEarnings = 0;
    let vaultBalance = 0;
    vendor.orders.map((order) => {
      if (order.status === OrderStatus.ONGOING) {
        ongoingDelivery += Number(order.Contract.totalCost);
      }
    });
    if (vendor.owner.wallet) {
      vaultBalance = vendor.owner.wallet
        ? Number(vendor.owner.wallet.balance)
        : 0;
      vendor.owner.wallet.transactions.map((transaction) => {
        if (
          transaction.type === TransactionType.WITHDRAWAL &&
          transaction.status === TransactionStatus.COMPLETED
        ) {
          lifetimeEarnings += transaction.amount;
        }
      });
    }

    return { lifetimeEarnings, ongoingDelivery, vaultBalance, vendor };
  }

  async updateVendorDocuments(data: UploadDocumentsDto, vendorId: string) {
    return await this.documentsModel.upsert({ ...data, VendorId: vendorId });
  }

  async inviteVendor(body: superAdminInviteVendorDto, user: User) {
    const invitation = await this.invitationModel.create({
      buyerEmail: body.email,
      buyerName: body.name,
      CreatedById: user.id,
    });

    const data = {
      toName: body.name,
      toEmail: body.email,
      phoneNumber: body.phone,
      invitationId: invitation.id,
      inviteeName: user.name,
      message: 'We are glad to have you',
    };
    await this.userLogModel.create({
      teamMemberId: user.id,
      activityTitle: 'New fvendor invited.',
      activityDescription: `Vendor account created on behalf of ${body.name}.`,
    });
    await this.emailServices.platformInvitationsEmailToVendor(data);
    return invitation;
  }

  async assignProcurementManagersToVendor(
    vendorId: string,
    procurementManagerId: string,
  ) {
    const vendor = await this.vendorModel.findOne({
      where: { id: vendorId },
    });

    if (!vendor) throw new NotFoundException('builder does not exist');

    const updatedBuilder = await this.vendorModel.update(
      { procurementManagerId },
      { where: { id: vendorId }, returning: true },
    );

    const [affectedRows] = updatedBuilder;
    return affectedRows[0];
  }

  async addVendorCategory({
    vendorId,
    updateVendorCategory: updateVendorCategory,
  }: {
    vendorId: string;
    updateVendorCategory: UpdateVendorCategoryDto;
  }) {
    return await this.vendorService.addVendorCategory({
      vendorId,
      updateVendorCategory,
    });
  }
}
