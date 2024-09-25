import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  CreationAttributes,
  Op,
  Transaction as SequelizeTransaction,
  WhereOptions,
} from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import {
  RfqCategory,
  RfqItem,
  RfqRequest,
  RfqRequestMaterial,
  RfqRequestType,
  RfqRequestInvitation,
  VendorRfqRequest,
  RfqRequestStatus,
  RfqQuote,
  RfqQuoteMaterial,
  RfqBargain,
  RfqRequestMaterialStatus,
} from './models';

import { User } from 'src/modules/user/models/user.model';
import { ProjectService } from 'src/modules/project/project.service';
import { MyVendorService } from 'src/modules/my-vendor/my-vendor.service';
import {
  Project,
  ProjectStatus,
} from 'src/modules/project/models/project.model';
import { Builder } from 'src/modules/builder/models/builder.model';
import { Vendor } from '../vendor/models/vendor.model';
import { EmailService } from '../email/email.service';
import { Order } from '../order/models';
import { OrderService } from '../order/order.services';
import { BidsResponseData, CreateOrderDto } from '../order/dto/order.dto';
import { UserService } from '../user/user.service';
import { FundManager } from '../fund-manager/models/fundManager.model';
import { CreateVendorRfqBlacklistDto } from '../vendor/dto/create-rdfBlacklist.dto';
import { VendorRfqBlacklist } from '../vendor/models/vendor-rfqBlacklist';
import {
  CreateRfqRequestDto,
  RfqRequestDeliveryScheduleDto,
  RfqRequestMaterialDto,
} from '../builder/dto';
import { UserUploadMaterial } from '../material-schedule-upload/models/material.model';
import { DeliverySchedule } from '../order/models/order-schedule.model';
import { MaterialSchedule } from '../material-schedule-upload/models/material-schedule.model';
import { Contract, ContractStatus } from '../contract/models';
import { RateReview } from '../rate-review/model/rateReview.model';

const modelsForRfq = [
  {
    model: Project,
  },
  {
    model: RfqQuote,
  },
  {
    model: Builder,
  },
  {
    model: RfqRequestMaterial,
  },
];
export type rfqListData = {
  id?: string;
  status?: string;
  paymentTerm?: string;
  owner_name: string;
  ownerId: string;
  deliveryAddress: string;
  deliveryDate: Date;
  createdAt: Date;
  logo: string;
  rfqQuotes?: RfqQuote[];
  materialRequest?: RfqRequestMaterial[];
};

@Injectable()
export class RfqService {
  protected readonly logger = new Logger(RfqService.name);
  constructor(
    @InjectModel(RfqRequest)
    private readonly rfqRequestModel: typeof RfqRequest,
    @InjectModel(RfqRequestMaterial)
    private readonly rfqRequestMaterialModel: typeof RfqRequestMaterial,
    @InjectModel(UserUploadMaterial)
    private readonly userUploadMaterial: typeof UserUploadMaterial,
    @InjectModel(RfqCategory)
    private readonly rfqCategoryModel: typeof RfqCategory,
    @InjectModel(RfqItem)
    private readonly rfqItemModel: typeof RfqItem,
    @InjectModel(RfqRequestInvitation)
    private readonly rfqRequestInvitationModel: typeof RfqRequestInvitation,
    @InjectModel(VendorRfqRequest)
    private vendorRfqRequestModel: typeof VendorRfqRequest,
    @InjectModel(Vendor)
    private vendorModel: typeof Vendor,
    @InjectModel(RateReview)
    private readonly rateReviewModel: typeof RateReview,
    @InjectModel(Contract)
    private readonly contractModel: typeof Contract,
    @InjectModel(RfqQuote)
    private readonly rfqQuoteModel: typeof RfqQuote,
    @InjectModel(Project)
    private readonly projectModel: typeof Project,
    private sequelize: Sequelize,
    private readonly projectService: ProjectService,
    private readonly myVendorService: MyVendorService,
  ) {}

  /**
   * Fetches all active RFQ categories.
   * @returns {Promise<RfqCategory[]>} - The RFQ categories.
   */
  async fetchCategories(): Promise<RfqCategory[]> {
    return await this.rfqCategoryModel.findAll({
      where: { isActive: true },
      order: [['title', 'ASC']],
    });
  }

  /**
   * Fetches all RFQ items.
   * @returns {Promise<RfqItem[]>} - The RFQ items.
   */
  async fetchItems(): Promise<RfqItem[]> {
    return await this.rfqItemModel.findAll({
      include: [{ all: true }],
      order: [['name', 'ASC']],
    });
  }

  /**
   * Creates RFQ request and materials for the request.
   * @param {CreateRfqRequestDto} createRfqRequestDto - The RFQ request to be created.
   * @param {User} user - The user (builder) creating the RFQ.
   * @returns {Promise<RfqRequest>} - The created RFQ request.
   * @throws {Error} - Throws an error if the item is not found.
   */
  async createRequest(
    createRfqRequestDto: CreateRfqRequestDto,
    user: User,
  ): Promise<RfqRequest> {
    const projectData = await this.projectService.getProjectOrThrow(
      createRfqRequestDto.projectId,
    );

    const dbTransaction = await this.sequelize.transaction();
    try {
      const totalBudget = createRfqRequestDto.materials.reduce(
        (budget, material) =>
          budget + Number(material.budget) * Number(material.quantity),
        0,
      );

      const totalAmount = createRfqRequestDto.materials.reduce(
        (amount, material) => amount + Number(material.quantity),
        0,
      );

      if (createRfqRequestDto.deliverySchedule.length === 0) {
        createRfqRequestDto.deliverySchedule = [
          {
            dueDate: createRfqRequestDto.deliveryDate,
            description: createRfqRequestDto.deliveryInstructions,
            quantity: totalAmount,
          },
        ];
      }
      const rfqRequest = await this.rfqRequestModel.create(
        {
          title: createRfqRequestDto.title,
          budgetVisibility: createRfqRequestDto.budgetVisibility,
          totalBudget,
          deliveryAddress: createRfqRequestDto.deliveryAddress,
          deliveryDate: createRfqRequestDto.deliveryDate,
          deliveryInstructions: createRfqRequestDto.deliveryInstructions,
          requestType: createRfqRequestDto.requestType,
          paymentTerm: createRfqRequestDto.paymentTerns,
          tax: createRfqRequestDto.tax,
          taxPercentage: createRfqRequestDto.taxPercentage,
          lpo: createRfqRequestDto.lpo,
          ProjectId: createRfqRequestDto.projectId,
          BuilderId: user.BuilderId,
          deliverySchedule: createRfqRequestDto.deliverySchedule,
          FundManagerId: user.FundManagerId,
          CreatedById: user.id,
          deliveryContactNumber: createRfqRequestDto.deliveryContactNumber,
        },

        { transaction: dbTransaction },
      );

      await this.projectModel.increment(
        {
          budgetAmount: totalBudget,
        },
        {
          where: { id: createRfqRequestDto.projectId },
          transaction: dbTransaction,
        },
      );

      if (createRfqRequestDto.requestType === RfqRequestType.INVITATION) {
        await this.createInvitationRequest(rfqRequest.id, user.BuilderId);
      }

      await this.createRequestMaterials(
        rfqRequest,

        createRfqRequestDto.materials,
        dbTransaction,
      );

      projectData.status = ProjectStatus.ACTIVE;
      await projectData.save({ transaction: dbTransaction });
      await dbTransaction.commit();
      return rfqRequest;
    } catch (error) {
      await dbTransaction.rollback();
      throw error;
    }
  }

  /**
   * Creates invitation requests for an RFQ request to the vendors of a builder.
   * @param {string} rfqRequestId - The ID of the RFQ request.
   * @param {string} builderId - The ID of the builder.
   * @param {SequelizeTransaction} [dbTransaction] - The database transaction.
   * @returns {Promise<void>} - Resolves if successful.
   */
  async createInvitationRequest(
    rfqRequestId: string,
    builderId: string,
    dbTransaction?: SequelizeTransaction,
  ): Promise<unknown> {
    const myVendors = await this.myVendorService.getMyVendors(builderId);
    const rfqRequestInvitationToCreate = myVendors.map(({ id }) => {
      return { VendorId: id, RfqRequestId: rfqRequestId };
    });

    return await this.rfqRequestInvitationModel.bulkCreate(
      rfqRequestInvitationToCreate,
      {
        transaction: dbTransaction,
      },
    );
  }

  /**
   * Creates RFQ request materials for a request.
   * @param {RfqRequest} rfqRequest - The created RFQ request.
   * @param {RfqRequestMaterialDto[]} rfqRequestMaterialDto - The RFQ request materials to be created.
   * @param {SequelizeTransaction} [dbTransaction] - The database transaction.
   * @returns {Promise<unknown>} - Resolves if successful.
   * @throws {Error} - Throws an error if the item is not found.
   */
  async createRequestMaterials(
    rfqRequest: RfqRequest,
    rfqRequestMaterialDto: RfqRequestMaterialDto[],
    dbTransaction?: SequelizeTransaction,
  ): Promise<unknown> {
    const rfqCategoryIds = rfqRequestMaterialDto.map(
      (item) => item.rfqCategoryId,
    );

    const categoryExistsPromises = rfqCategoryIds.map((categoryId) =>
      this.checkRfqCategoryExists(categoryId),
    );

    if (
      !(await Promise.all(categoryExistsPromises)).every((exists) => exists)
    ) {
      throw new BadRequestException('RfqCategory not found');
    }
    const rfqRequestMaterials = await Promise.all(
      rfqRequestMaterialDto.map(
        async ({
          budget,
          description,
          quantity,
          itemName,
          specification,
          metric,
          rfqCategoryId,
        }) => {
          const lowercasedName = itemName.toLocaleLowerCase();

          const userDefinedMat = await this.userUploadMaterial.findOne({
            where: {
              name: Sequelize.fn('LOWER', Sequelize.col('name')),
              [Op.and]: Sequelize.where(
                Sequelize.fn('LOWER', Sequelize.col('name')),
                { [Op.in]: [lowercasedName] },
              ),
            },
          });

          const rfqItem = await this.checkSystemRfqItemList({
            itemName,
          });

          const rfqRequestMaterial: CreationAttributes<RfqRequestMaterial> = {
            budget,
            description,
            specification,
            ProjectId: rfqRequest.ProjectId,
            quantity,
            metric: rfqItem[0]?.metric || metric || null,
            rfqCategoryId,
            name: itemName,
            UserUploadMaterialId: userDefinedMat?.id || null,
            RfqRequestId: rfqRequest?.id,
            CreatedById: rfqRequest.CreatedById,
          };
          return rfqRequestMaterial;
        },
      ),
    );

    return await this.rfqRequestMaterialModel.bulkCreate(rfqRequestMaterials, {
      transaction: dbTransaction,
    });
  }

  /**
   * Checks RfqItem properties.
   * @param {{ rfqItemId: string }} params - The parameters including rfqItemId.
   * @returns {Promise<RfqItem>} - The found rfqItem.
   * @throws {Error} - Throws an error if the item properties don't match.
   */
  async checkRfqItem({ rfqItemId }: { rfqItemId: string }): Promise<RfqItem> {
    const rfqItem = await this.rfqItemModel.findByPkOrThrow(rfqItemId);
    return rfqItem;
  }

  async checkRfqCategoryExists(
    rfqCategoryId: string,
  ): Promise<RfqCategory | null> {
    const rfqcategory = await this.rfqCategoryModel.findOne({
      where: { id: rfqCategoryId },
    });
    if (!rfqcategory) {
      return null;
    }
    return rfqcategory;
  }

  /**
   * Checks RfqItem properties by name in a case-insensitive manner.
   * @param {{ name: string }} params - The parameters including name.
   * @returns {Promise<RfqItem[]>} - The found rfqItems.
   * @throws {Error} - Throws an error if the item properties don't match.
   */
  async checkSystemRfqItemList({
    itemName,
  }: {
    itemName: string;
  }): Promise<RfqItem[] | []> {
    const lowercasedName = itemName.toLowerCase();

    const rfqItems = await this.rfqItemModel.findAll({
      where: {
        name: Sequelize.fn('LOWER', Sequelize.col('name')),
        [Op.and]: Sequelize.where(
          Sequelize.fn('LOWER', Sequelize.col('name')),
          { [Op.in]: [lowercasedName] },
        ),
      },
    });

    return rfqItems;
  }

  /**
   * Archives or unarchive an RFQ request.
   * @param {string} rfqRequestId - The ID of the RFQ request to archive/unarchive.
   * @param {User} user - The user archiving/unarchive the RFQ.
   * @returns {Promise<unknown>} - Resolves if successful.
   * @throws {ForbiddenException} - Throws if the user doesn't own the RFQ request.
   */
  async archiveRequest(rfqRequestId: string, user: User): Promise<unknown> {
    const rfqRequest = await this.rfqRequestModel.findByPkOrThrow(rfqRequestId);
    if (rfqRequest.BuilderId !== user.BuilderId) {
      throw new ForbiddenException(`This RFQ request does not belong to you`);
    }

    return await this.rfqRequestModel.update(
      { isArchived: !rfqRequest.isArchived, UpdatedById: user.id },
      { where: { id: rfqRequestId } },
    );
  }

  /**
   * Updates the status of an RFQ request to unarchive.
   * @param rfqRequestId - the ID of the RFQ request to archive
   * @param user - the user archiving the RFQ
   * @throws
   */
  async unarchiveRequest(rfqRequestId: string, user: User) {
    const rfqRequest = await this.rfqRequestModel.findByPkOrThrow(rfqRequestId);
    if (rfqRequest.BuilderId !== user.BuilderId) {
      throw new ForbiddenException(`This RFQ request does not belong to you`);
    }

    await this.rfqRequestModel.update(
      { isArchived: false, UpdatedById: user.id },
      { where: { id: rfqRequestId } },
    );
  }

  /**
   * Fetches all RFQ requests.
   * @returns {Promise<{ count: number; rows: RfqRequest[] }>} - The RFQ requests.
   */
  async getAllRfq(): Promise<{ count: number; rows: RfqRequest[] }> {
    return await this.rfqRequestModel.findAndCountAll({
      include: [
        {
          model: Project,
        },
        {
          model: RfqQuote,
        },
        {
          model: Builder,
        },
        { model: RfqCategory },
        { model: RfqRequestMaterial },
      ],

      order: [['createdAt', 'DESC']],
    });
  }

  /**
   * Fetches all RFQ requests for a builder.
   * @param {string} builderId - The ID of the builder.
   * @param {boolean} isArchived - Whether to include archived requests.
   * @returns {Promise<{ count: number; rows: RfqRequest[] }>} - The RFQ requests.
   */
  async getRfqForBuilder(
    builderId: string,
    isArchived: boolean,
  ): Promise<{ count: number; rows: RfqRequest[] }> {
    return await this.rfqRequestModel.findAndCountAll({
      where: {
        BuilderId: builderId,
        isArchived,
      },
      include: [
        {
          model: Project,
        },
        {
          model: RfqQuote,
          include: [{ model: RfqBargain }],
        },
        {
          model: RfqRequestMaterial,
          include: [
            {
              model: RfqItem,
              include: [{ model: RfqCategory }],
            },
          ],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
  }
  /**
   * Fetches all RFQ requests for a builder.
   * @param {string} builderId - The ID of the builder.
   * @param {boolean} isArchived - Whether to include archived requests.
   * @returns {Promise<{ count: number; rows: RfqRequest[] }>} - The RFQ requests.
   */
  async getProjectRfq({
    user,
    ProjectId,
    search,
  }: {
    user: User;
    ProjectId: string;
    search?: string;
  }) {
    const whereOptions: WhereOptions<RfqRequest> = {
      ProjectId,
    };
    if (search) {
      whereOptions[Op.or] = [{ title: { [Op.iLike]: `%${search}%` } }];
    }

    const result = await this.rfqRequestModel.findAll({
      where: whereOptions,
      include: [
        { model: RfqQuote, include: [{ model: RfqBargain }] },
        {
          model: RfqRequestMaterial,
          include: [{ model: RfqCategory }],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    return result;
  }

  /**
   * Fetches all non archived RFQ requests for a builder
   * @param builderId - the ID of the builder
   * @returns the RFQ requests
   */
  async getNonArchivedRfqForBuilder(builderId: string) {
    return await this.getRfqForBuilder(builderId, false);
  }

  /**
   * Fetches all archived RFQ requests for a builder
   * @param builderId - the ID of the builder
   * @returns the RFQ requests
   */
  async getArchivedRfqForBuilder(builderId: string) {
    return await this.getRfqForBuilder(builderId, true);
  }

  /**
   * Fetches all non archived RFQ requests for a project
   * @param projectId - the ID of the project
   * @param builderId - the ID of the builder
   * @returns {Promise<{ count: number; rows: RfqRequest[] }>} - The RFQ requests.
   */
  async getRequestsForProject({
    projectId,
    builderId,
    fundManagerId,
  }: {
    projectId: string;
    builderId?: string;
    fundManagerId?: string;
  }): Promise<RfqRequest[]> {
    const whereClause: Record<string, any> = {
      ProjectId: projectId,
    };

    if (builderId !== undefined) {
      whereClause.BuilderId = builderId;
    }

    if (fundManagerId !== undefined) {
      whereClause.FundManagerId = fundManagerId;
    }
    return await this.rfqRequestModel.findAll({
      where: {
        ...whereClause,
        isArchived: false,
      },
      include: [
        {
          model: RfqQuote,
          include: [
            {
              model: RfqQuoteMaterial,
              include: [{ model: RfqQuote, include: [{ model: RfqBargain }] }],
            },
          ],
        },
        {
          model: RfqRequestMaterial,
          include: [
            {
              model: RfqItem,
              include: [{ model: RfqCategory }],
            },
          ],
        },
      ],
      order: [['createdAt', 'DESC']],
    });
  }

  /**
   * Fetches all public non-archived RFQ requests according to logged-in vendor categories.
   * @param {object} params - The parameters object.
   * @param {User} params.user - The logged-in user.
   * @returns {Promise<rfqListData[]>} - The RFQ requests.
   */

  async getNonBiddedMaterialRequestsForSupplier(
    { user }: { user: User },
    query?: string,
  ): Promise<RfqRequest[]> {
    const vendorQuotes = await this.rfqQuoteModel.findAll({
      where: { VendorId: user.VendorId },
      include: [{ model: RfqRequest }],
    });
    const quotesRfqIds = vendorQuotes.map((quote) => quote.RfqRequest.id);
    const userData = await this.vendorModel.findOne({
      where: { id: user.VendorId },
      include: [{ model: RfqCategory }, { model: VendorRfqBlacklist }],
    });

    const userCategoryIds =
      userData?.RfqCategories?.map((category) => category.id) || [];
    const UserBlackListedRfq = userData.RfqBlacklistRfqs.map(
      (blacklist) => blacklist.RfqRequestId,
    );

    const excludedRfqIds = [...quotesRfqIds, ...UserBlackListedRfq];
    const whereOptions: WhereOptions<RfqRequest> = {
      id: { [Op.notIn]: excludedRfqIds },
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
      order: [['createdAt', 'DESC']],
      where: whereOptions,
      include: [
        {
          model: User,
          as: 'CreatedBy',
          attributes: ['name', 'id', 'email', 'phoneNumber'],
          include: [
            { model: Builder, attributes: ['logo', 'businessAddress'] },
            { model: FundManager, attributes: ['logo', 'businessAddress'] },
          ],
        },
        { model: Project },
        {
          model: RfqRequestMaterial,
          as: 'RfqRequestMaterials',
          where: {
            status: {
              [Op.ne]: RfqRequestMaterialStatus.ClOSED,
            },
          },
          include: [
            {
              model: RfqCategory,
              where: {
                id: {
                  [Op.in]: userCategoryIds,
                },
              },
            },
            {
              model: RfqItem,
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
        'deliverySchedule',
        'id',
      ],
    });
    return bidData;
  }

  async addDeliveryScheduleToRequest(
    rfqRequestId: string,
    data: RfqRequestDeliveryScheduleDto,
  ) {
    const rfqRequest = await this.rfqRequestModel.findOne({
      where: { id: rfqRequestId },
    });

    rfqRequest.deliverySchedule = data.deliverySchedule;
    await rfqRequest.save();
    return rfqRequest;
  }

  /**
   * Fetches all invited non archived RFQ requests for a vendor
   * @param vendorId - the ID of the vendor
   * @returns the RFQ requests
   */
  async getInvitedNonArchivedRequests(vendorId: string): Promise<RfqRequest[]> {
    return (
      await this.rfqRequestInvitationModel.findAll({
        where: { VendorId: vendorId },
        include: [
          {
            model: RfqRequest,
            where: { isArchived: false },
            include: modelsForRfq,
          },
        ],
        order: [['createdAt', 'DESC']],
      })
    ).map(({ RfqRequest }) => RfqRequest);
  }

  /**
   * Fetches the details and all materials for a RFQ request
   * @param requestId - the ID of the RFQ request
   * @returns the RFQ request materials
   */
  async getRequestDetails(requestId: string) {
    return await this.rfqRequestModel.findByPkOrThrow(requestId, {
      include: [
        {
          model: RfqRequestMaterial,
        },
        ...modelsForRfq,
      ],
    });
  }

  /**
   * Fetches the details and all materials for a specific RFQ request.
   * @param {object} params - The parameters object.
   * @param {string} params.rfqRequestId - The ID of the RFQ request.
   * @param {string} [params.BuilderId] - The ID of the builder (optional).
   * @param {string} [params.FundManagerId] - The ID of the fundManager (optional).
   * @returns {Promise<RfqRequest>} - The RFQ request details.
   */
  async getBidsForRequest({
    rfqRequestId,
    search,
    BuilderId,
    FundManagerId,
    ProjectId,
  }: {
    rfqRequestId: string;
    search?: string;
    BuilderId?: string;
    FundManagerId?: string;
    ProjectId?: string;
  }): Promise<BidsResponseData> {
    const whereOptions: WhereOptions<RfqRequest> = {
      id: rfqRequestId,
    };

    const subOption: WhereOptions<Vendor> = {};
    if (search) {
      subOption[Op.or] = [{ businessName: { [Op.iLike]: `%${search}%` } }];
    }

    if (BuilderId !== undefined) {
      whereOptions.BuilderId = BuilderId;
    }

    if (ProjectId !== undefined) {
      whereOptions.ProjectId = ProjectId;
    }

    if (FundManagerId !== undefined) {
      whereOptions.FundManagerId = FundManagerId;
    }

    const result = await this.rfqRequestModel.findOrThrow({
      where: whereOptions,
      attributes: [
        'id',
        'title',
        'status',
        'totalBudget',
        'paymentTerm',
        'deliveryDate',
        'deliveryAddress',
        'deliveryInstructions',
        'deliveryContactNumber',
        'createdAt',
        'ProjectId',
        'BuilderId',
        'FundManagerId',
        'deliverySchedule',
      ],
      include: [
        {
          model: RfqRequestMaterial,

          include: [{ model: RfqCategory }],
        },
        {
          model: Builder,
          attributes: ['email', 'businessName', 'businessAddress'],
          include: [
            {
              model: Project,
              as: 'CompanyProjects',
              attributes: [
                'ProjectType',
                'id',
                'image',
                'description',
                'fileName',
                'startDate',
                'endDate',
              ],
              through: { attributes: [] },
            },
            {
              model: User,
              as: 'owner',
              attributes: [
                'email',
                'id',
                'name',
                'location',
                'businessName',
                'phoneNumber',
              ],
            },
          ],
        },
        {
          model: Order,
          include: [{ model: DeliverySchedule }, { model: Contract }],
        },
        {
          model: Project,
          attributes: ['id', 'ProjectType'],
        },
        {
          model: RfqQuote,
          include: [
            {
              model: Vendor,
              where: subOption,
              attributes: [
                'id',
                'logo',
                'businessName',
                'businessAddress',
                'email',
                'phone',
                'status',
                'VendorType',
              ],
              include: [
                {
                  model: User,
                  as: 'createdBy',
                  attributes: ['location', 'email', 'businessName'],
                },
              ],
            },

            { model: RfqRequestMaterial },
          ],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    const vendorIds = result.RfqQuotes.map((quote) => quote.VendorId);
    const rateVendors = await this.rateReviewModel.findAll({
      where: { VendorId: { [Op.in]: vendorIds } },
    });
    const vendorOrders = await this.contractModel.findAll({
      where: { VendorId: { [Op.in]: vendorIds } },
    });

    const resultWithPendingCount = {
      ...result.toJSON(),
      Builder: {
        ...result.Builder.toJSON(),
        builderCompletedProjectsCount: result.Builder.CompanyProjects?.filter(
          (project) => project.status === ProjectStatus.COMPLETED,
        ).length,
      },
      orders: result.orders.map((order) => {
        const pendingCount = order.deliverySchedules.filter(
          (schedule) => schedule.status !== 'COMPLETED',
        ).length;
        return {
          ...order.toJSON(),
          pendingCount: pendingCount,
        };
      }),
      RfqQuotes: result.RfqQuotes.map((quote) => {
        const rateVendorData = rateVendors.filter(
          (rateVendor) => rateVendor.VendorId === quote.VendorId,
        );
        const ratevendorScore = rateVendorData.map(
          (rateVendor) => rateVendor.vendorRateScore,
        );

        const ordersVendorData = vendorOrders.filter(
          (orderVendor) => orderVendor.VendorId === quote.VendorId,
        );
        const vendorCompletedOrdersCount = ordersVendorData.filter(
          (orderVendor) => orderVendor.status === ContractStatus.COMPLETED,
        ).length;

        const averageVendorScore =
          ratevendorScore.reduce((acc, score) => acc + score, 0) /
          rateVendorData.length;
        return {
          RfqQuote: {
            ...quote.toJSON(),
            Vendor: {
              ...quote.Vendor.toJSON(),
              vendorRateScore: isNaN(averageVendorScore)
                ? 0
                : Math.round(averageVendorScore),
              vendorCompletedOrdersCount,
            },
          },
        };
      }),
    };
    return resultWithPendingCount;
  }

  /**
   * Fetches details and bids for a specific RFQ request material.
   * @param {object} params - The parameters object.
   * @param {string} params.rfqRequestIdMaterialId - The ID of the RFQ request material.
   * @param {string} [params.BuilderId] - The ID of the builder (optional).
   * @param {string} [params.FundManagerId] - The ID of the fundManager (optional).
   * @returns {Promise<RfqRequestMaterial>} - The RFQ request material details with associated bids.
   */
  async getBidsForMaterial({
    rfqRequestIdMaterialId,
  }: {
    rfqRequestIdMaterialId: string;
    BuilderId?: string;
    search?: string;
    FundManagerId?: string;
  }) {
    const whereClause: Record<string, any> = {
      id: rfqRequestIdMaterialId,
    };
    return await this.rfqRequestMaterialModel.findOrThrow({
      where: whereClause,
      include: [
        { model: RfqCategory },
        {
          model: RfqQuote,
          include: [{ model: RfqBargain }],
        },
      ],

      order: [['createdAt', 'DESC']],
    });
  }

  /**
   * Saves an RFQ request for a vendor
   * @param rfqRequest - the RFQ request ID to be saved
   * @param vendorId - the vendor's ID
   */
  async saveRfqRequestForVendor(rfqRequestId: string, vendorId: string) {
    const req = await this.vendorRfqRequestModel.findOne({
      where: { RfqRequestId: rfqRequestId, VendorId: vendorId },
      include: [RfqRequest],
    });
    if (!req) {
      await this.vendorRfqRequestModel.create({
        RfqRequestId: rfqRequestId,
        VendorId: vendorId,
      });
      const createdRfqRequest = await this.rfqRequestModel.findOne({
        where: { id: rfqRequestId },
        include: modelsForRfq,
      });
      createdRfqRequest.isSaved = true;
      return await createdRfqRequest.save();
    }
    req.RfqRequest.isSaved = !req.RfqRequest.isSaved;
    return {
      rfq: await req.RfqRequest.save(),
      message: req.RfqRequest.isSaved
        ? 'You have Successfully saved rfq!'
        : 'You have Successfully unsaved rfq!',
    };
  }

  /**
   * Fetches all saved RFQs for a vendor
   * @param vendorId - ID of the vendor
   * @returns the RFQ requests
   */
  async getSavedRfqForVendor(vendorId: string): Promise<RfqRequest[]> {
    return (
      await this.vendorRfqRequestModel.findAll({
        where: { VendorId: vendorId },
        include: [
          {
            model: RfqRequest,
            where: { isArchived: false, isSaved: true },
            include: modelsForRfq,
          },
        ],
        order: [['createdAt', 'ASC']],
      })
    ).map(({ RfqRequest }) => RfqRequest);
  }

  /**
   * Closes an RFQ request, updating its status to CLOSED.
   * @param {string} rfqRequestId - The ID of the RFQ request to close.
   * @param {User} user - The user performing the action.
   * @param {SequelizeTransaction} dbTransaction - The database transaction.
   * @throws {BadRequestException} If the RFQ request is already closed.
   */
  async closeRfqRequest(
    rfqRequestId: string,
    user: User,
    dbTransaction: SequelizeTransaction,
  ) {
    const rfqRequest = await this.rfqRequestModel.findByPkOrThrow(rfqRequestId);
    if (rfqRequest.status === RfqRequestStatus.CLOSED) {
      throw new BadRequestException(`This RFQ request has already been closed`);
    }
    await this.rfqRequestModel.update(
      {
        status: RfqRequestStatus.CLOSED,
        UpdatedById: user.id,
      },
      {
        where: { id: rfqRequestId },
        transaction: dbTransaction,
      },
    );
  }

  /**
   * Fetch a rfqRequest transaction by builder id and status
   * @param {User} user - The user performing the action.
   */
  async findRfqRequestByStatus(user: User) {
    const rfqRequest = await this.rfqRequestModel.findAll({
      where: {
        status: RfqRequestStatus.ACCEPTED || RfqRequestStatus.OPEN,
        BuilderId: user.BuilderId,
      },
    });
    return rfqRequest;
  }
}
