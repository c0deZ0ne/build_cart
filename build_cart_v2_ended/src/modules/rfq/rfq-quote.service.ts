import {
  Injectable,
  BadRequestException,
  Inject,
  forwardRef,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  CreationAttributes,
  Op,
  Transaction as SequelizeTransaction,
  Transaction,
  WhereOptions,
} from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import {
  CreateRfqQuoteDto,
  RfqQuoteMaterialDto,
} from 'src/modules/vendor/dto/create-rfq-quote.dto';
import {
  RfqBargain,
  RfqBargainStatus,
  RfqCategory,
  RfqItem,
  RfqQuote,
  RfqQuoteBargainStatus,
  RfqQuoteMaterial,
  RfqQuoteStatus,
  RfqRequest,
  RfqRequestMaterial,
  RfqRequestMaterialStatus,
} from './models';
import { User } from 'src/modules/user/models/user.model';
import { ContractService } from 'src/modules/contract/contract.service';
import { Vendor } from 'src/modules/vendor/models/vendor.model';
import { Builder } from 'src/modules/builder/models/builder.model';
import { EmailService } from '../email/email.service';
import { Order, OrderStatus } from '../order/models';
import { OrderService } from '../order/order.services';
import {
  Contract,
  ContractDeliveryStatus,
  ContractStatus,
} from '../contract/models';
import { FundManager } from '../fund-manager/models/fundManager.model';
import { rfqListData } from './rfq.service';
import { CreateOrderDto } from '../order/dto/order.dto';
import {
  CreateRfqBargainDTO,
  VendorAcceptRfqOrBargainDTO,
} from '../builder/dto/create-rfqbargain.dto';
import { VendorRfqBlacklist } from '../vendor/models/vendor-rfqBlacklist';
import { DeliverySchedule } from '../order/models/order-schedule.model';
import { get } from 'http';

@Injectable()
export class RfqQuoteService {
  protected readonly logger = new Logger(RfqQuoteService.name);

  constructor(
    @InjectModel(RfqQuote)
    private readonly rfqQuoteModel: typeof RfqQuote,
    @InjectModel(RfqRequest)
    private readonly rfqRequestModel: typeof RfqRequest,
    @InjectModel(RfqQuoteMaterial)
    private readonly rfqQuoteMaterialModel: typeof RfqQuoteMaterial,
    @InjectModel(RfqBargain)
    private readonly rfqBargainModel: typeof RfqBargain,
    @InjectModel(Order)
    private readonly orderModel: typeof Order,
    @InjectModel(DeliverySchedule)
    private readonly deliverySchedule: typeof DeliverySchedule,
    @InjectModel(RfqRequestMaterial)
    private readonly rfqRequestMaterialModel: typeof RfqRequestMaterial,
    @InjectModel(Vendor)
    private vendorModel: typeof Vendor,
    private sequelize: Sequelize,
    @Inject(forwardRef(() => ContractService))
    private contractService: ContractService,
    private readonly orderService: OrderService,
    private readonly emailService: EmailService,
  ) {}

  /**
   * Creates a new RFQ quote with the specified materials.
   * @param createRfqQuoteDto The data transfer object for creating an RFQ quote.
   * @param user The user(vendor) that is creating the RFQ quote.
   * @throws BadRequestException if the RFQ request for the RFQ quote materials does not match the RFQ request for the RFQ quote.
   */
  async createQuote({
    body,
    user,
    dbTransaction,
  }: {
    body: CreateRfqQuoteDto;
    user: User;
    dbTransaction?: Transaction;
  }) {
    try {
      const totalCost = body.materials.reduce(
        (cost, material) =>
          Number(material.price) * Number(material.quantity) + Number(cost),
        0,
      );
      const checkQuoteAcceptance = await this.rfqRequestMaterialModel.findOne({
        where: { id: body.materials[0].rfqRequestMaterialId },
      });
      if (!checkQuoteAcceptance)
        throw new BadRequestException('No request material was found');
      if (checkQuoteAcceptance.status == RfqRequestMaterialStatus.ClOSED)
        throw new BadRequestException(
          'This request is no longer receiving quotes',
        );
      const rfqQuote = await this.rfqQuoteModel.create(
        {
          RfqRequestId: body.rfqRequestId,
          rfqRequestMaterialId: body.materials[0].rfqRequestMaterialId,
          VendorId: user.VendorId,
          canBargain: true,
          deliveryDate: body.deliveryDate,
          tax: body.tax,
          logisticCost: body.logisticCost,
          totalCost,
          lpo: body.lpo,
          additionalNote: body.additionalNote,
          CreatedById: user.id,
        },
        {
          transaction: dbTransaction,
        },
      );

      await this.createQuoteMaterials(rfqQuote, body.materials, dbTransaction);

      return rfqQuote;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Creates RFQ quote materials for the specified RFQ quote and materials.
   * @param rfqQuote The RFQ quote to create materials for.
   * @param rfqQuoteMaterialDto The data transfer object for creating RFQ quote materials.
   * @param dbTransaction The database transaction.
   * @throws BadRequestException if the RFQ request for the RFQ quote materials does not match the RFQ request for the RFQ quote.
   */
  async createQuoteMaterials(
    rfqQuote: RfqQuote,
    rfqQuoteMaterialDto: RfqQuoteMaterialDto[],
    dbTransaction?: SequelizeTransaction,
  ) {
    const rfqQuoteMaterials = await Promise.all(
      rfqQuoteMaterialDto.map(
        async ({ price, description, rfqRequestMaterialId, quantity }) => {
          const rfqRequestMaterial =
            await this.rfqRequestMaterialModel.findByPkOrThrow(
              rfqRequestMaterialId,
            );

          if (rfqRequestMaterial.RfqRequestId !== rfqQuote.RfqRequestId) {
            throw new BadRequestException(
              'One of the materials does not belong to this RFQ request',
            );
          }

          const rfqQuoteMaterial: CreationAttributes<RfqQuoteMaterial> = {
            price,
            description,
            createdAt: new Date(),
            quantity,
            RfqRequestMaterialId: rfqRequestMaterialId,
            RfqQuoteId: rfqQuote.id,
            RfqRequestId: rfqQuote.RfqRequestId,
            CreatedById: rfqQuote.CreatedById,
          };
          return rfqQuoteMaterial;
        },
      ),
    );

    await this.rfqQuoteMaterialModel.bulkCreate(rfqQuoteMaterials, {
      transaction: dbTransaction,
    });
  }

  /**
   * Fetches all RFQs that have been submitted
   * @param User - ID of the vendor
   * @returns the RFQ requests
   */
  async getSubmittedRfq({ user }: { user: User }, query?: string) {
    const userData = await this.vendorModel.findOne({
      order: [['createdAt', 'DESC']],
      where: { id: user.VendorId },
      include: [{ model: RfqCategory }, { model: VendorRfqBlacklist }],
    });

    const userCategoryIds =
      userData?.RfqCategories?.map((category) => category.id) || [];
    const UserBlackListedRfq = userData.RfqBlacklistRfqs?.map(
      (blacklist) => blacklist.RfqRequestId,
    );

    const whereOptions: WhereOptions<RfqRequest> = {
      id: { [Op.notIn]: UserBlackListedRfq },
    };
    if (query) {
      whereOptions[Op.or] = [
        this.sequelize.literal(`"paymentTerm"::text ILIKE '%${query}%'`),
        this.sequelize.literal(`"CreatedBy"."name"::text ILIKE '%${query}%'`),
        this.sequelize.literal(
          `"RfqRequestMaterials"."name"::text ILIKE '%${query}%'`,
        ),
      ];
    }
    const bidData = await this.rfqRequestModel.findAll({
      where: whereOptions,
      include: [
        {
          model: User,
          as: 'CreatedBy',
          attributes: ['name', 'id', 'email'],
          include: [
            { model: Builder, attributes: ['logo', 'businessAddress'] },
            { model: FundManager, attributes: ['logo', 'businessAddress'] },
          ],
        },
        {
          model: RfqQuote,
          where: { VendorId: user.VendorId, CreatedById: user.id },
          attributes: [
            'id',
            'rfqQuoteBargainStatus',
            'deliveryDate',
            'status',
            'deliveryDate',
          ],
          include: [
            { model: RfqBargain },
            {
              model: RfqRequestMaterial,
              attributes: [
                'id',
                'status',
                'RfqItemId',
                'RfqRequestId',
                'ProjectId',
                'name',
                'description',
                'quantity',
                'metric',
                'budget',
              ],
              include: [
                {
                  model: RfqCategory,
                },
                { model: RfqItem },
              ],
            },
            {
              model: Order,
              attributes: ['status', 'id', 'paidAt'],
              include: [
                {
                  model: Contract,
                  attributes: ['id', 'status', 'paymentStatus'],
                },
              ],
            },
          ],
        },
      ],
      attributes: [
        'title',
        'createdAt',
        'deliveryAddress',
        'deliveryInstructions',
        'deliveryDate',
        'paymentTerm',
        'requestType',
        'status',
        'id',
      ],
      order: [['createdAt', 'DESC']],
    });

    const filteredBidData = bidData.filter((bid) => {
      const hasMatchingCategory = bid.RfqQuotes.every((quote) =>
        userCategoryIds.includes(quote.RfqRequestMaterial.category.id),
      );
      return hasMatchingCategory;
    });

    const totalBid = filteredBidData.map((bid) => {
      const quoteCount = bid.RfqQuotes?.length;
      return {
        bid,
        quoteCount,
      };
    });

    const totalLength = totalBid.reduce(
      (total, bid) => total + bid.quoteCount,
      0,
    );
    return { totalBid, totalLength };
  }
  /**
   * Fetches all bids for a user
   * @returns the RFQ quotes
   * @param user - The user fetching the quotes
   * @param isArchived - isArchived
   */
  async getRfqQuotes(user: User, isArchived?: boolean) {
    const vendorWhereQuery = user.VendorId ? { VendorId: user.VendorId } : {};
    const buyerWhereQuery = user.BuilderId ? { BuilderId: user.BuilderId } : {};
    const isArchivedQuery = isArchived === undefined ? {} : { isArchived };
    return await this.rfqQuoteModel.findAll({
      where: { ...isArchivedQuery, ...vendorWhereQuery },
      include: [
        {
          model: RfqRequest,
          where: buyerWhereQuery,
        },
        {
          model: Vendor,
        },
        { model: RfqBargain },
        { model: RfqQuoteMaterial },
      ],
    });
  }

  /**
   * Fetches all non archived bids for a builder
   * @param user - The user fetching the quotes
   * @returns the RFQ quotes
   */
  async getCurrentRfqQuotes(user: User) {
    return this.getRfqQuotes(user, false);
  }

  /**
   * Fetches all archived bids for a builder
   * @param user - The user fetching the quotes
   * @returns the RFQ quotes
   */
  async getArchivedRfqQuotes(user: User) {
    return this.getRfqQuotes(user, true);
  }

  /**
   * Mark a RFQ as read
   * @param rfqQuoteId - ID of the quote
   * @param user - the user marking as read
   */
  async markRfqQuoteAsRead(rfqQuoteId: string, user: User) {
    const rfqQuote = await this.getRfqQuoteByIdForUser(rfqQuoteId, user);
    if (rfqQuote.isRead == true) return;
  }

  /**
   * Star a RFQ
   * @param rfqQuoteId - ID of the quote
   * @param user - the user starring the RFQ
   */
  async starRfqQuote(rfqQuoteId: string, user: User) {
    const userId = user.id;
    const rfqQuote = await this.getRfqQuoteByIdForUser(rfqQuoteId, user);

    await this.rfqQuoteModel.update(
      {
        isStarred: !rfqQuote.isStarred,
        UpdatedById: userId,
      },
      {
        where: {
          id: rfqQuoteId,
        },
      },
    );
  }

  /**
   * Archive a RFQ
   * @param rfqQuoteId - ID of the quote
   * @param user - the user archiving the RFQ
   */
  async archiveRfqQuote(rfqQuoteId: string, user: User) {
    const userId = user.id;
    const rfqQuote = await this.getRfqQuoteByIdForUser(rfqQuoteId, user);

    await this.rfqQuoteModel.update(
      {
        isArchived: !rfqQuote.isArchived,
        UpdatedById: userId,
      },
      {
        where: {
          id: rfqQuoteId,
        },
      },
    );
  }
  /**
   * unArchive a RFQ
   * @param rfqQuoteId - ID of the quote
   * @param user - the user unarchive the RFQ
   */
  async unarchiveRfqQuote(rfqQuoteId: string, user: User) {
    const userId = user.id;
    await this.getRfqQuoteByIdForUser(rfqQuoteId, user);

    await this.rfqQuoteModel.update(
      {
        isArchived: false,
        UpdatedById: userId,
      },
      {
        where: {
          id: rfqQuoteId,
        },
      },
    );
  }

  /**
   * Accepts a bid, creates a contract for the accepted bid access by vendors and buyers s
   * @param rfqQuoteId - ID of the RFQ quote
   * @param user - the user
   * @param Body - the Quote details
   * @optional dbTransaction - the sequelize transaction instance to run the process
   * @returns the created contract
   */

  async acceptBid({
    RfqQuoteId,
    dbTransaction,
    user,
    body,
  }: {
    RfqQuoteId: string;
    user: User;
    body?: CreateOrderDto;
    dbTransaction?: SequelizeTransaction;
  }): Promise<Contract | null> {
    if (!dbTransaction) {
      dbTransaction = await this.sequelize.transaction();
    }
    let totalCost = 0;
    try {
      const rfqQuote = await this.rfqQuoteModel.findOne({
        where: { id: body ? body.RfqQuoteId : RfqQuoteId },
        include: [{ all: true }],
        transaction: dbTransaction,
      });

      if (!rfqQuote) {
        throw new BadRequestException('RFQ Quote not found');
      }
      const rfqMaterialData =
        await this.rfqRequestMaterialModel.findByPkOrThrow(
          rfqQuote?.rfqRequestMaterialId,
          { transaction: dbTransaction },
        );

      if (rfqMaterialData?.status == RfqRequestMaterialStatus.ClOSED) {
        throw new BadRequestException(
          `This request is ${rfqMaterialData.status.toLocaleLowerCase()}`,
        );
      }
      const checkExist = await this.orderModel.findOne({
        where: {
          RfqQuoteId,
        },
      });
      if (checkExist) {
        throw new BadRequestException('You already accepted this bid');
      }

      if (rfqQuote.canBargain && rfqQuote.RfqQuoteBargain[0]?.price > 0) {
        totalCost = rfqQuote.RfqQuoteBargain[0].price;
      } else {
        totalCost = rfqQuote.totalCost;
      }

      const contract = await this.contractService.createContract({
        rfqQuote: rfqQuote,
        totalCost,
        dbTransaction,
      });
      const order = await this.orderModel.create(
        {
          rfqRequestMaterialId: rfqQuote.rfqRequestMaterialId,
          RfqQuoteId: rfqQuote.id,
          RfqRequestId: rfqQuote.RfqRequestId,
          ProjectId: rfqQuote.RfqRequest.ProjectId,
          createdAt: new Date(),
          CreatedById: user.id,
          VendorId: rfqQuote.VendorId,
          BuilderId: rfqQuote.RfqRequest.BuilderId,
          FundManagerId: rfqQuote.RfqRequest.FundManagerId,
          ContractId: contract.id,
        },
        { transaction: dbTransaction },
      );

      const schedule: DeliverySchedule[] =
        rfqQuote.RfqRequest.deliverySchedule.map((schedule) => {
          return {
            dueDate: schedule.dueDate,
            orderId: order.id,
            description: schedule.description,
            quantity: schedule.quantity,
            status: OrderStatus.PENDING,
            paymentTerm: rfqQuote.RfqRequest.paymentTerm,
            rfqRequestMaterialId: rfqQuote.rfqRequestMaterialId,
            VendorId: rfqQuote.VendorId,
            BuilderId: user.BuilderId,
            FundManagerId: user.FundManagerId,
            RfqRequestId: rfqQuote.RfqRequestId,
            RfqQuoteId: rfqQuote.id,
            ProjectId: rfqQuote.RfqRequest.ProjectId,
            CreatedById: user.id,
            createdAt: new Date(),
          };
        }) as DeliverySchedule[];

      await this.deliverySchedule.bulkCreate(schedule, {
        transaction: dbTransaction,
      });
      await this.rfqQuoteModel.update(
        {
          status: RfqQuoteStatus.ACCEPTED,
          UpdatedById: user.id,
          totalCost,
          rfqQuoteBargainStatus: RfqQuoteBargainStatus.ACCEPTED,
          canBargain: false,
        },
        {
          where: { id: RfqQuoteId },
          transaction: dbTransaction,
        },
      );

      await this.rfqBargainModel.update(
        {
          status: RfqBargainStatus.ACCEPTED,
          price: totalCost,
          updatedAt: new Date(),
        },
        {
          where: { RfqQuoteId: RfqQuoteId },
          transaction: dbTransaction,
        },
      );

      rfqQuote.totalCost = totalCost;

      await this.rejectOtherBids(
        contract.RfqQuoteId,
        contract.RfqRequestId,
        dbTransaction,
      );

      await this.rfqRequestMaterialModel.update(
        {
          status: RfqRequestMaterialStatus.ClOSED,
          updatedAt: new Date(),
          UpdatedById: user.id,
        },
        {
          where: {
            id: rfqQuote.rfqRequestMaterialId,
          },
          transaction: dbTransaction,
        },
      );

      rfqQuote.RfqRequest.UpdatedById = user.id;
      await rfqQuote.RfqRequest.save({ transaction: dbTransaction });

      if (user.Builder || user.FundManager) {
        await this.emailService.bidAccepted(rfqQuote);
        //:todo send express acceptance to fundManager from vendor
      } else {
        await this.emailService.acceptBargain(rfqQuote);
      }

      return contract;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async declineOrder({
    orderId,
    dbTransaction,
    user,
  }: {
    orderId: string;
    user: User;
    dbTransaction?: SequelizeTransaction;
  }) {
    if (!dbTransaction) {
      dbTransaction = await this.sequelize.transaction();
    }
    try {
      const orderData = await this.orderService.getOrderById(orderId);

      if (!orderData)
        throw new BadRequestException(
          'order already deleted or does not exist',
        );

      orderData.status = OrderStatus.ONGOING;
      await orderData.save({ transaction: dbTransaction });
      const contract = await this.contractService.getContractById(
        orderData.ContractId,
      );
      contract.status = ContractStatus.ACCEPTED;
      contract.deliveryStatus = ContractDeliveryStatus.DISPATCHED;
      await contract.save({ transaction: dbTransaction });

      await Promise.all(
        orderData.deliverySchedules?.map(async (schedule) => {
          schedule.status = OrderStatus.ONGOING;
          await schedule.save({ transaction: dbTransaction });
        }),
      );
      await this.emailService.sendOrderRejectNoticeEmailToVendor(contract);

      return orderData;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async createBargain({
    user,
    bargain,
  }: {
    user: User;
    bargain: CreateRfqBargainDTO;
  }) {
    try {
      const checkCanBargain = await this.rfqQuoteModel.findByPkOrThrow(
        bargain.RfqQuoteId,
        { include: [{ all: true }] },
      );
      if (!checkCanBargain.canBargain) {
        throw new BadRequestException('vendor disallowed bargaining');
      }
      if (
        checkCanBargain?.RfqRequestMaterial?.status ==
        RfqRequestMaterialStatus.ClOSED
      )
        throw new BadRequestException(
          'this request is no longer accepting quotes',
        );
      // Find or create the current bargain
      const [currentBargain, created] = await this.rfqBargainModel.findOrCreate(
        {
          where: {
            RfqQuoteId: checkCanBargain.id,
          },
          defaults: {
            ProjectId: bargain.ProjectId,
            deliveryDate: bargain.deliveryDate,
            price: bargain.price,
            CreatedById: user.id,
            createdAt: new Date(),
          },
          include: [
            {
              model: RfqQuote,
              include: [
                {
                  model: Vendor,
                },
                {
                  model: RfqRequest,
                  include: [
                    {
                      model: Builder,
                      include: [{ model: User, as: 'owner' }],
                    },
                  ],
                },
              ],
            },
          ],
        },
      );
      currentBargain.price = bargain.price;
      currentBargain.updatedAt = new Date();
      await currentBargain.save();
      await currentBargain.reload();

      await this.emailService.sendBuilderBargainNoticeEmailToVendor(
        currentBargain,
      );
      return currentBargain;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async allowBidBargain({ id, user }: { id: string; user: User }) {
    try {
      const checkCanBargain = await this.rfqQuoteModel.findByPkOrThrow(id);
      if (checkCanBargain.canBargain) {
        throw new BadRequestException(
          'already enabled bargaining on the quote',
        );
      } else {
        checkCanBargain.canBargain = true;
        checkCanBargain.UpdatedById = user.id;
        checkCanBargain.updatedAt = new Date();
        return await checkCanBargain.save();
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async disableBidBargain({ id, user }: { id: string; user: User }) {
    try {
      const checkCanBargain = await this.rfqQuoteModel.findByPkOrThrow(id);
      if (!checkCanBargain.canBargain) {
        throw new BadRequestException(
          'already disabled bargaining on the quote',
        );
      } else {
        checkCanBargain.canBargain = false;
        checkCanBargain.UpdatedById = user.id;
        checkCanBargain.updatedAt = new Date();
        return await checkCanBargain.save();
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async acceptBargain({
    rfqQuoteId,
    user,
  }: {
    rfqQuoteId: string;
    user: User;
  }) {
    const dbTransaction = await this.sequelize.transaction();
    try {
      const rfqData = await this.rfqQuoteModel.findByPkOrThrow(rfqQuoteId, {
        include: {
          model: RfqBargain,
          include: [{ model: RfqQuote, include: [{ model: Vendor }] }],
        },
      });

      if (rfqData.RfqQuoteBargain.length < 1) {
        throw new BadRequestException('No bargain on this bid');
      } else if (
        rfqData.RfqQuoteBargain[0].RfqQuote.Vendor.id !== user.Vendor.id
      ) {
        throw new BadRequestException(`This bid doesn't belong to you`);
      } else {
        await this.acceptBid({ RfqQuoteId: rfqQuoteId, user, dbTransaction });
        dbTransaction.commit();
      }
    } catch (error) {
      dbTransaction.rollback();
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Rejects other bids
   * @param rfqQuote - the RFQ quote id that was accepted
   * @param rfqRequestId - the RFQ request id
   * @param dbTransaction The database transaction.
   */
  async rejectOtherBids(
    rfqQuoteId: string,
    rfqRequestId: string,
    dbTransaction: SequelizeTransaction,
  ) {
    const rfqQuoteData = await this.rfqQuoteModel.findOne({
      where: { id: rfqQuoteId },
    });
    await this.rfqQuoteModel.update(
      {
        status: RfqQuoteStatus.REJECTED,
      },
      {
        where: {
          id: { [Op.ne]: rfqQuoteId },
          RfqRequestId: rfqRequestId,
          rfqRequestMaterialId: rfqQuoteData.rfqRequestMaterialId,
          status: RfqQuoteStatus.PENDING,
        },
        transaction: dbTransaction,
      },
    ); // todo: send email
  }

  /**
   * Cancel a bid
   * @param rfqQuoteId - the bid to cancel
   * @param dbTransaction The database transaction.
   */
  async cancelBid(rfqQuoteId: string, dbTransaction?: SequelizeTransaction) {
    await this.rfqQuoteModel.update(
      {
        status: RfqQuoteStatus.CANCELLED,
      },
      {
        where: {
          id: rfqQuoteId,
        },
        transaction: dbTransaction,
      },
    );
  }

  /**
   * Fetch a bid by id for user
   * @param rfqQuoteId - the id of the bid to be fetched
   * @param user - the user fetching the bid
   * @returns the fetched bid
   */
  async getRfqQuoteByIdForUser(rfqQuoteId: string, user: User) {
    const quoteWhereOptions = user.VendorId ? { VendorId: user.VendorId } : {};
    const requestWhereOptions = user.BuilderId
      ? { BuilderId: user.BuilderId }
      : user.FundManagerId
      ? { FundManagerId: user.FundManagerId }
      : {};
    return await this.rfqQuoteModel.findOrThrow({
      where: { id: rfqQuoteId, ...quoteWhereOptions },
      include: [
        { model: Vendor },
        {
          model: RfqBargain,
          include: [{ model: RfqQuote, include: [{ model: Vendor }] }],
        },
        { model: RfqQuoteMaterial, include: [{ model: RfqRequestMaterial }] },
        { model: RfqRequest, where: requestWhereOptions },
      ],
    });
  }

  /**
   * Creates a new RFQ quote with the specified materials.
   * @param createRfqQuoteDto The data transfer object for creating or fecthing an RFQ quote.
   * @param user The user(vendor) that is creating the RFQ quote.
   * @throws BadRequestException if the RFQ request for the RFQ quote materials does not match the RFQ request for the RFQ quote.
   */
  async createOrGetQuote({
    body,
    user,
    dbTransaction,
  }: {
    body: CreateRfqQuoteDto;
    user: User;
    dbTransaction?: Transaction;
  }) {
    try {
      const rfqQuoteExists = await this.rfqQuoteModel.findOne({
        where: {
          VendorId: user.VendorId,
          RfqRequestId: body.rfqRequestId,
          rfqRequestMaterialId: body.materials[0].rfqRequestMaterialId,
        },
        include: [{ all: true }],
      });
      if (!rfqQuoteExists) {
        const totalCost = body.materials.reduce(
          (cost, material) =>
            Number(material.price) * Number(material.quantity) + Number(cost),
          0,
        );
        const checkQuoteAcceptance = await this.rfqRequestMaterialModel.findOne(
          {
            where: { id: body.materials[0].rfqRequestMaterialId },
          },
        );
        if (!checkQuoteAcceptance)
          throw new BadRequestException('No request material was found');
        if (checkQuoteAcceptance.status == RfqRequestMaterialStatus.ClOSED)
          throw new BadRequestException(
            'This request is no longer receiving quotes',
          );

        const rfqQuote = await this.rfqQuoteModel.create(
          {
            RfqRequestId: body.rfqRequestId,
            rfqRequestMaterialId: body.materials[0].rfqRequestMaterialId,
            VendorId: user.VendorId,
            canBargain: body.canBargain,
            deliveryDate: body.deliveryDate,
            tax: body.tax,
            logisticCost: body.logisticCost,
            totalCost,
            lpo: body.lpo,
            additionalNote: body.additionalNote,
            CreatedById: user.id,
            rfqQuoteBargainStatus: RfqQuoteBargainStatus.PENDING,
          },
          {
            transaction: dbTransaction,
          },
        );

        await this.createQuoteMaterials(
          rfqQuote,
          body.materials,
          dbTransaction,
        );

        return rfqQuote;
      }

      return rfqQuoteExists;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async createVendorBargain({
    user,
    body,
  }: {
    user: User;
    body: VendorAcceptRfqOrBargainDTO;
  }) {
    try {
      const getQuote = await this.createOrGetQuote({ body, user });

      if (!getQuote.canBargain) {
        throw new BadRequestException('vendor disallowed bargaining');
      }
      if (getQuote.rfqQuoteBargainStatus === RfqQuoteBargainStatus.ACCEPTED) {
        throw new BadRequestException(
          'vendor has already accepted this rfqQuoteBargain',
        );
      }

      if (
        getQuote?.RfqRequestMaterial?.status == RfqRequestMaterialStatus.ClOSED
      )
        throw new BadRequestException(
          'this request is no longer accepting quotes',
        );
      // Find or create the current bargain
      const [currentBargain, created] = await this.rfqBargainModel.findOrCreate(
        {
          where: {
            RfqQuoteId: getQuote.id,
          },
          defaults: {
            ProjectId: body.ProjectId,
            deliveryDate: body.deliveryDate,
            price: body.materials[0].price,
            CreatedById: user.id,
            createdAt: new Date(),
          },
          include: [
            {
              model: RfqQuote,
              include: [
                {
                  model: Vendor,
                },
                {
                  model: RfqRequest,
                  include: [
                    {
                      model: Builder,
                      include: [{ model: User, as: 'owner' }],
                    },
                  ],
                },
              ],
            },
          ],
        },
      );
      currentBargain.price = body.materials[0].price;
      currentBargain.updatedAt = new Date();
      await currentBargain.save();
      await currentBargain.reload();

      await this.emailService.sendVendorBidNoticeEmailToBuilder(currentBargain);
      return currentBargain;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
