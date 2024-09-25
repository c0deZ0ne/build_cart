import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/sequelize';
import { User, UserStatus, UserType } from 'src/modules/user/models/user.model';
import {
  BusinessSize,
  Vendor,
  VendorStatus,
} from 'src/modules/vendor/models/vendor.model';
import {
  V1User,
  V1Company,
  V1Individual,
  V1Team,
  V1RfqProject,
  V1Ticket,
  V1RfqNameOption,
  V1RfqCategory,
  V1RfqRequest,
  V1RfqMaterial,
  V1RfqMeasurementNameOption,
  V1RfqQuote,
  V1RfqQuoteMaterial,
  V1Contract,
  V1Documents,
  V1Bank,
} from './model';
import { CreationAttributes, Op } from 'sequelize';
import { randomNumberGenerator } from 'src/util/util';
import {
  Project,
  ProjectStatus,
} from 'src/modules/project/models/project.model';
import { Ticket, TicketStatus } from 'src/modules/ticket/models/ticket.model';
import {
  RfqItem,
  RfqQuote,
  RfqQuoteMaterial,
  RfqQuoteStatus,
  RfqRequest,
  RfqRequestMaterial,
  RfqRequestStatus,
  RfqRequestType,
} from 'src/modules/rfq/models';
import {
  Contract,
  ContractPaymentStatus,
  ContractStatus,
} from 'src/modules/contract/models';
import { Documents } from '../documents/models/documents.model';
import { Bank } from '../bank/models/bank.model';
import { Builder } from '../builder/models/builder.model';

@Injectable()
export class MigrationService {
  protected readonly logger = new Logger(MigrationService.name);
  constructor(
    @InjectModel(User)
    private readonly UserModel: typeof User,
    @InjectModel(Vendor)
    private readonly VendorModel: typeof Vendor,
    @InjectModel(Builder)
    private readonly BuilderModel: typeof Builder,
    @InjectModel(V1User, 'v1')
    private readonly V1UserModel: typeof V1User,
    @InjectModel(V1Company, 'v1')
    private readonly V1CompanyModel: typeof V1Company,
    @InjectModel(V1Individual, 'v1')
    private readonly V1IndividualModel: typeof V1Individual,
    @InjectModel(V1Team, 'v1')
    private readonly V1TeamModel: typeof V1Team,
    @InjectModel(V1Documents, 'v1')
    private readonly V1DocumentsModel: typeof V1Documents,
    @InjectModel(Documents)
    private readonly DocumentsModel: typeof Documents,
    @InjectModel(V1RfqProject, 'v1')
    private readonly V1RfqProjectModel: typeof V1RfqProject,
    @InjectModel(Project)
    private readonly ProjectModel: typeof Project,
    @InjectModel(V1Ticket, 'v1')
    private readonly V1TicketModel: typeof V1Ticket,
    @InjectModel(Ticket)
    private readonly TicketModel: typeof Ticket,
    @InjectModel(V1RfqNameOption, 'v1')
    private readonly V1RfqNameOptionModel: typeof V1RfqNameOption,
    @InjectModel(RfqItem)
    private readonly RfqItemModel: typeof RfqItem,
    @InjectModel(V1RfqCategory, 'v1')
    private readonly V1RfqCategoryModel: typeof V1RfqCategory,
    @InjectModel(RfqRequest)
    private readonly RfqRequestModel: typeof RfqRequest,
    @InjectModel(V1RfqRequest, 'v1')
    private readonly V1RfqRequestModel: typeof V1RfqRequest,
    @InjectModel(RfqRequestMaterial)
    private readonly RfqRequestMaterialModel: typeof RfqRequestMaterial,
    @InjectModel(V1RfqMaterial, 'v1')
    private readonly V1RfqMaterialModel: typeof V1RfqMaterial,
    @InjectModel(V1RfqMeasurementNameOption, 'v1')
    private readonly v1RfqMeasurementNameOptionModel: typeof V1RfqMeasurementNameOption,
    @InjectModel(V1RfqQuote, 'v1')
    private readonly V1RfqQuoteModel: typeof V1RfqQuote,
    @InjectModel(RfqQuote)
    private readonly RfqQuoteModel: typeof RfqQuote,
    @InjectModel(V1RfqQuoteMaterial, 'v1')
    private readonly V1RfqQuoteMaterialModel: typeof V1RfqQuoteMaterial,
    @InjectModel(RfqQuoteMaterial)
    private readonly RfqQuoteMaterialModel: typeof RfqQuoteMaterial,
    @InjectModel(V1Contract, 'v1')
    private readonly V1ContractModel: typeof V1Contract,
    @InjectModel(Contract)
    private readonly ContractModel: typeof Contract,
    @InjectModel(V1Bank, 'v1')
    private readonly V1BankModel: typeof V1Bank,
    @InjectModel(Bank)
    private readonly BankModel: typeof Bank,
    private readonly configService: ConfigService,
  ) {}

  // async migrate() {
  //   try {
  //     this.logger.log('MIGRATION STARTING...');
  //     await this.migrateVendors();
  //     await this.migrateBuilders();
  //     await this.migrateUsers();
  //     await this.migrateBanks();
  //     await this.migrateDocuments();
  //     await this.migrateTickets();
  //     await this.migrateProjects();
  //     await this.migrateRfqItems();
  //     await this.migrateRfqRequests();
  //     await this.migrateRfqQuotes();
  //     await this.migrateContracts();
  //     this.logger.log('MIGRATION COMPLETE!!!');
  //   } catch (error) {
  //     this.logger.error('MIGRATION FAILED!!!', error);
  //   }
  // }

  // async migrateVendors() {
  //   const v1Vendors = await this.V1UserModel.findAll({
  //     where: { user_type: 'vendor', NewId: null },
  //     include: [{ model: V1Company, required: true }],
  //   });

  //   let migrated = 0;

  //   for (const v1Vendor of v1Vendors) {
  //     try {
  //       const VendorToCreate: CreationAttributes<Vendor> = {
  //         about: v1Vendor.Company.about_us,
  //         address: v1Vendor.Company.address,
  //         companyName: v1Vendor.Company.name,
  //         contactEmail: v1Vendor.Company.primary_contact_email,
  //         contactName: v1Vendor.Company.primary_contact_name,
  //         contactPhone: v1Vendor.Company.primary_contact_phone,
  //         email: v1Vendor.email,
  //         logo: v1Vendor.Company.logo,
  //         phone: v1Vendor.Company.phone,
  //         racialEquity: v1Vendor.Company.racial_equity,
  //         status: v1Vendor.Company.kyc_status
  //           ? VendorStatus.APPROVED
  //           : VendorStatus.PENDING,
  //         taxCompliance: v1Vendor.Company.tax_compliance,
  //         tradingName: v1Vendor.Company.trading_name,
  //         termOfService: v1Vendor.Company.term_of_service,
  //         createdAt: v1Vendor.Company.created_at,
  //         updatedAt: v1Vendor.Company.updated_at,
  //         migratedAt: new Date(),
  //       };

  //       const createdVendor = await this.VendorModel.create(VendorToCreate);
  //       await this.V1CompanyModel.update(
  //         { NewId: createdVendor.id },
  //         { where: { id: v1Vendor.company } },
  //       );
  //       migrated += 1;
  //     } catch (error) {
  //       this.logger.error(error);
  //       this.logger.log(v1Vendor.id);
  //     }
  //   }
  //   this.logger.log(`migrated ${migrated} vendors`);
  // }

  async migrateBuilders() {
    const v1Builders = await this.V1UserModel.findAll({
      where: { user_mode: ['company', 'individual'], NewId: null },
      include: [{ model: V1Company }, { model: V1Individual }],
    });

    let migrated = 0;

    for (const v1Builder of v1Builders) {
      try {
        if (v1Builder.user_mode === 'individual' && v1Builder.Individual) {
          const BuilderToCreate: CreationAttributes<Builder> = {
            isIndividual: true,
            email: v1Builder.email,
            logo: v1Builder.Individual.logo,
            createdAt: v1Builder.Individual.created_at,
            updatedAt: v1Builder.Individual.updated_at,
            migratedAt: new Date(),
          };

          const createdBuilder = await this.BuilderModel.create(
            BuilderToCreate,
          );
          await this.V1IndividualModel.update(
            { NewId: createdBuilder.id },
            { where: { id: v1Builder.individual } },
          );
          migrated += 1;
        } else if (v1Builder.user_mode === 'company' && v1Builder.Company) {
          const BuilderToCreate: CreationAttributes<Builder> = {
            isIndividual: false,
            about: v1Builder.Company.about_us,
            email: v1Builder.Company.company_email,
            logo: v1Builder.Company.logo,
            createdAt: v1Builder.Company.created_at,
            updatedAt: v1Builder.Company.updated_at,
            migratedAt: new Date(),
          };

          const createdBuilder = await this.BuilderModel.create(
            BuilderToCreate,
          );
          await this.V1CompanyModel.update(
            { NewId: createdBuilder.id },
            { where: { id: v1Builder.company } },
          );
          migrated += 1;
        }
      } catch (error) {
        this.logger.error(error);
        this.logger.log(v1Builder.id);
      }
    }
    this.logger.log(`migrated ${migrated} buyers`);
  }

  async migrateUsers() {
    const v1Teams = await this.V1TeamModel.findAll({
      where: { role: 'staff', NewId: null },
    });

    let migrated = 0;

    for (const v1Team of v1Teams) {
      try {
        const userToCreate: CreationAttributes<User> = {
          email: v1Team.email,
          name: v1Team.name,
          password: randomNumberGenerator(10).toString(),
          status: UserStatus.ACTIVE,
          userType: UserType.ADMIN,
          createdAt: v1Team.created_at,
          updatedAt: v1Team.updated_at,
          migratedAt: new Date(),
        };

        const createdUser = await this.UserModel.create(userToCreate);
        await this.V1TeamModel.update(
          { NewId: createdUser.id },
          { where: { id: v1Team.id } },
        );
        await this.V1UserModel.update(
          { NewId: createdUser.id },
          { where: { email: v1Team.email } },
        );
        migrated += 1;
      } catch (error) {
        this.logger.error(error.message);
        this.logger.log(v1Team.id);
      }
    }
    this.logger.log(`migrated ${migrated} admins`);
    migrated = 0;

    const v1Users = await this.V1UserModel.findAll({
      where: {
        [Op.or]: [
          { individual: { [Op.ne]: null } },
          { company: { [Op.ne]: null } },
        ],
        email: {
          [Op.notIn]: v1Teams.map((v1Team) => v1Team.email),
        },
        user_mode: ['company', 'individual', 'vendor'],
        NewId: null,
      },
      include: [{ model: V1Company }, { model: V1Individual }],
    });

    for (const v1User of v1Users.filter(
      (user) => user.Individual?.NewId || user.Company?.NewId,
    )) {
      try {
        const vendorOrBuilderId =
          v1User.Individual?.NewId || v1User.Company?.NewId;
        const userToCreate: CreationAttributes<User> = {
          userType:
            v1User.user_mode === 'vendor'
              ? UserType.SUPPLIER
              : UserType.BUILDER,
          VendorId: v1User.user_mode === 'vendor' ? vendorOrBuilderId : null,
          BuilderId: v1User.user_mode !== 'vendor' ? vendorOrBuilderId : null,
          email: v1User.email,
          emailVerified: v1User.confirmed,
          lastLogin: v1User.last_login,
          name: v1User.username,
          password: v1User.password,
          status:
            v1User.status === 'active'
              ? UserStatus.ACTIVE
              : UserStatus.DEACTIVATED,
          createdAt: v1User.created_at,
          updatedAt: v1User.updated_at,
          migratedAt: new Date(),
        };

        const createdUser = await this.UserModel.create(userToCreate);
        await this.V1UserModel.update(
          { NewId: createdUser.id },
          { where: { id: v1User.id } },
        );
        migrated += 1;
      } catch (error) {
        this.logger.log(v1User.id);
        throw error;
      }
    }
    this.logger.log(`migrated ${migrated} users`);
  }

  async getUserFromV1(v1UserId: number) {
    const v1User = await this.V1UserModel.findByPk(v1UserId);
    return await this.UserModel.findByPkOrThrow(v1User?.NewId);
  }

  async getVendorId(v1UserId: number) {
    return (await this.getUserFromV1(v1UserId)).VendorId;
  }

  async getBuilderId(v1UserId: number) {
    return (await this.getUserFromV1(v1UserId)).BuilderId;
  }

  getBusinessSize(businessSize: string) {
    if (!businessSize) return null;
    if (businessSize.toLowerCase().includes('small')) return BusinessSize.SMALL;
    if (businessSize.toLowerCase().includes('medium'))
      return BusinessSize.MEDIUM;
    if (businessSize.toLowerCase().includes('micro')) return BusinessSize.MICRO;
    if (businessSize.toLowerCase().includes('large')) return BusinessSize.MICRO;
    return null;
  }

  async migrateBanks() {
    const v1Banks = await this.V1BankModel.findAll({
      where: { user: { [Op.ne]: null }, NewId: null },
    });

    const errors = [];
    for (const v1Bank of v1Banks) {
      try {
        const vendorId = await this.getVendorId(v1Bank.user);
        if (!vendorId) continue;

        const bankToCreate: CreationAttributes<Bank> = {
          VendorId: vendorId,
          accountName: v1Bank.acoount_name,
          accountNumber: v1Bank.acccount_number,
          bankCode: v1Bank.bank_name,
          bankSlug: v1Bank.bank_name,
          bankName: v1Bank.bank_name,
          createdAt: v1Bank.created_at,
          updatedAt: v1Bank.updated_at,
          migratedAt: new Date(),
        };

        const createdBank = await this.BankModel.create(bankToCreate);
        await this.V1BankModel.update(
          { NewId: createdBank.id },
          { where: { id: v1Bank.id } },
        );
      } catch (error) {
        errors.push({
          message: error.message,
          id: v1Bank.id,
          userId: v1Bank.user,
        });
      }
    }
    if (errors.length)
      this.logger.error({
        message: 'error occurred in migrating some banks',
        rawData: JSON.stringify(errors),
      });
  }

  async migrateDocuments() {
    const v1Documentss = await this.V1DocumentsModel.findAll({
      where: { user_id: { [Op.ne]: null }, NewId: null },
    });

    const errors = [];
    for (const v1Documents of v1Documentss) {
      try {
        const vendorId = await this.getVendorId(v1Documents.user_id);
        if (!vendorId) continue;

        const documentsToCreate: CreationAttributes<Documents> = {
          businessCertificate: v1Documents.business_certificate,
          confirmationOfAddress: v1Documents.confirmation_of_address,
          insuranceCertificate: v1Documents.insurance_certificate,
          proofOfIdentity: v1Documents.proof_of_identity,
          VendorId: vendorId,
          createdAt: v1Documents.created_at,
          updatedAt: v1Documents.updated_at,
          migratedAt: new Date(),
        };

        const createdDocuments = await this.DocumentsModel.create(
          documentsToCreate,
        );
        await this.V1DocumentsModel.update(
          { NewId: createdDocuments.id },
          { where: { id: v1Documents.id } },
        );
      } catch (error) {
        errors.push({
          message: error.message,
          id: v1Documents.id,
          userId: v1Documents.user_id,
        });
      }
    }
    if (errors.length)
      this.logger.error({
        message: 'error occurred in migrating some documents',
        rawData: JSON.stringify(errors),
      });
  }

  async migrateTickets() {
    const v1Tickets = await this.V1TicketModel.findAll({
      where: { user_id: { [Op.ne]: null }, NewId: null },
    });

    const errors = [];
    for (const v1Ticket of v1Tickets) {
      try {
        const user = await this.getUserFromV1(v1Ticket.user_id);

        const ticketToCreate: CreationAttributes<Ticket> = {
          BuilderId: user.BuilderId,
          VendorId: user.VendorId,
          UserId: user.id,
          message: v1Ticket.message,
          subject: v1Ticket.subject,
          status: TicketStatus.OPEN,
          createdAt: v1Ticket.created_at,
          updatedAt: v1Ticket.updated_at,
          migratedAt: new Date(),
        };

        const createdTicket = await this.TicketModel.create(ticketToCreate);
        await this.V1TicketModel.update(
          { NewId: createdTicket.id },
          { where: { id: v1Ticket.id } },
        );
      } catch (error) {
        errors.push({
          message: error.message,
          id: v1Ticket.id,
          userId: v1Ticket.user_id,
        });
      }
    }
    if (errors.length)
      this.logger.error({
        message: 'error occurred in migrating some tickets',
        rawData: JSON.stringify(errors),
      });
  }

  async migrateProjects() {
    const v1Projects = await this.V1RfqProjectModel.findAll({
      where: { user_id: { [Op.ne]: null }, NewId: null },
    });

    const errors = [];
    for (const v1Project of v1Projects) {
      try {
        const builderId = await this.getBuilderId(v1Project.user_id);
        if (!builderId) continue;

        const projectToCreate: CreationAttributes<Project> = {
          // BuilderId: builderId,
          status: v1Project.active
            ? ProjectStatus.ACTIVE
            : ProjectStatus.ARCHIVE,
          title: v1Project.title,
          createdAt: v1Project.created_at,
          updatedAt: v1Project.updated_at,
          migratedAt: new Date(),
        };

        const createdProject = await this.ProjectModel.create(projectToCreate);
        await this.V1RfqProjectModel.update(
          { NewId: createdProject.id },
          { where: { id: v1Project.id } },
        );
      } catch (error) {
        errors.push({
          message: error.message,
          id: v1Project.id,
          userId: v1Project.user_id,
        });
      }
    }
    if (errors.length)
      this.logger.error({
        message: 'error occurred in migrating some projects',
        rawData: JSON.stringify(errors),
      });
  }

  async migrateRfqItems() {
    const v1NameOptions = await this.V1RfqNameOptionModel.findAll({
      where: { NewId: null },
    });

    for (const v1NameOption of v1NameOptions) {
      const itemToCreate: CreationAttributes<RfqItem> = {
        carbonCount: +v1NameOption.Carbon_Count_kg,
        metric: v1NameOption.metric,
        name: v1NameOption.title,
        product: v1NameOption.PRODUCT,
        specification: v1NameOption.SPECIFICATION,
        createdAt: v1NameOption.created_at,
        updatedAt: v1NameOption.updated_at,
        migratedAt: new Date(),
      };

      const createdItem = await this.RfqItemModel.create(itemToCreate);
      await this.V1RfqNameOptionModel.update(
        { NewId: createdItem.id },
        { where: { id: v1NameOption.id } },
      );
    }
    this.logger.log(`migrated rfq items`);
  }

  async migrateRfqRequests() {
    const v1Requests = await this.V1RfqRequestModel.findAll({
      where: { NewId: null },
    });

    for (const v1Request of v1Requests) {
      const v1Project = await this.V1RfqProjectModel.findByPk(
        v1Request.rfq_project_id,
      );
      if (!v1Project || !v1Project.user_id || !v1Project.NewId) continue;

      const user = await this.getUserFromV1(v1Project.user_id);

      const requestToCreate: CreationAttributes<RfqRequest> = {
        budgetVisibility: !!v1Request.budget_visibility,
        BuilderId: user.BuilderId,
        CreatedById: user.id,
        deliveryAddress: v1Request.delivery_address,
        deliveryDate: v1Request.delivery_date,
        deliveryInstructions: v1Request.delivery_instructions,
        lpo: v1Request.LPO,
        ProjectId: v1Project.NewId,
        requestType:
          v1Request.request_type === 'invitation'
            ? RfqRequestType.INVITATION
            : RfqRequestType.PUBLIC,
        status:
          v1Request.status === 'accepted'
            ? RfqRequestStatus.ACCEPTED
            : RfqRequestStatus.PENDING,
        tax: v1Request.task,
        taxPercentage: v1Request.tax_percentage,
        title: v1Request.title,
        totalBudget: v1Request.budget || 0,
        createdAt: v1Request.created_at,
        updatedAt: v1Request.updated_at,
        migratedAt: new Date(),
      };

      const createdRequest = await this.RfqRequestModel.create(requestToCreate);
      await this.V1RfqRequestModel.update(
        { NewId: createdRequest.id },
        { where: { id: v1Request.id } },
      );

      const totalBudget = await this.migrateRfqRequestMaterials(
        v1Request.id,
        createdRequest,
      );
      await this.RfqRequestModel.update(
        { totalBudget },
        { where: { id: createdRequest.id } },
      );
    }
    this.logger.log(`migrated rfq requests and materials`);
  }

  async migrateRfqRequestMaterials(
    v1RfqRequestId: number,
    rfqRequest: RfqRequest,
  ) {
    const v1Materials = await this.V1RfqMaterialModel.findAll({
      where: { rfq_request_id: v1RfqRequestId },
    });
    let totalBudget = 0;

    for (const v1Material of v1Materials) {
      const measurement = (
        await this.v1RfqMeasurementNameOptionModel.findByPk(
          v1Material.rfq_measurement_id,
        )
      )?.title;
      const rfqItem = await this.V1RfqNameOptionModel.findByPk(
        v1Material.rfq_name_id,
      );
      const materialToCreate: CreationAttributes<RfqRequestMaterial> = {
        budget: v1Material.budget || 0,
        CreatedById: rfqRequest.CreatedById,
        description: v1Material.description,
        metric: measurement,
        name: rfqItem?.title,
        quantity: v1Material.quantity,
        RfqItemId: rfqItem?.NewId,
        RfqRequestId: rfqRequest.id,
        createdAt: v1Material.created_at,
        updatedAt: v1Material.updated_at,
      };

      const createdRequestMaterial = await this.RfqRequestMaterialModel.create(
        materialToCreate,
      );
      await this.V1RfqMaterialModel.update(
        { NewId: createdRequestMaterial.id },
        { where: { id: v1Material.id } },
      );
      totalBudget +=
        Number(v1Material.budget || 0) * Number(v1Material.quantity);
    }
    return totalBudget;
  }

  async migrateRfqQuotes() {
    const v1Quotes = await this.V1RfqQuoteModel.findAll({
      where: { NewId: null },
    });

    for (const v1Quote of v1Quotes) {
      const v1RfqRequest = await this.V1RfqRequestModel.findByPk(
        v1Quote.rfq_request_id,
      );
      if (!v1RfqRequest || !v1RfqRequest.NewId) continue;

      const v1Vendor = await this.V1CompanyModel.findOne({
        include: [{ model: V1User, required: true }],
        where: { id: v1Quote.company_id, NewId: { [Op.ne]: null } },
      });
      if (!v1Vendor) continue;

      const quoteToCreate: CreationAttributes<RfqQuote> = {
        CreatedById: v1Vendor.user.NewId,
        deliveryDate: v1Quote.delivery_date,
        lpo: v1Quote.vendor_lpo,
        logisticCost: v1Quote.livevend_logistic_cost || 0,
        RfqRequestId: v1RfqRequest.NewId,
        tax: Number(v1Quote.tax),
        totalCost: v1Quote.total_cost,
        status:
          v1Quote.vendor_status === 'accepted'
            ? RfqQuoteStatus.ACCEPTED
            : v1Quote.status === 'accepted'
            ? RfqQuoteStatus.CANCELLED
            : RfqQuoteStatus.PENDING,
        VendorId: v1Vendor.NewId,
        createdAt: v1Quote.created_at,
        updatedAt: v1Quote.updated_at,
        migratedAt: new Date(),
      };

      const createdQuote = await this.RfqQuoteModel.create(quoteToCreate);
      await this.V1RfqQuoteModel.update(
        { NewId: createdQuote.id },
        { where: { id: v1Quote.id } },
      );

      const totalCost = await this.migrateRfqQuoteMaterials(
        v1Quote.id,
        createdQuote,
      );
      await this.RfqQuoteModel.update(
        { totalCost },
        { where: { id: createdQuote.id } },
      );
    }
    this.logger.log(`migrated bids and bid materials`);
  }

  async migrateRfqQuoteMaterials(v1RfqQuoteId: number, rfqQuote: RfqQuote) {
    const v1QuoteMaterials = await this.V1RfqQuoteMaterialModel.findAll({
      where: { rfq_qoute_id: v1RfqQuoteId },
    });
    let totalCost = 0;

    for (const v1QuoteMaterial of v1QuoteMaterials) {
      const v1RfqRequestMaterial = await this.V1RfqMaterialModel.findByPk(
        v1QuoteMaterial.rfq_material_id,
      );
      if (!v1RfqRequestMaterial || !v1RfqRequestMaterial.NewId) continue;

      const quoteMaterialToCreate: CreationAttributes<RfqQuoteMaterial> = {
        CreatedById: rfqQuote.CreatedById,
        description: '',
        discount: 0,
        price: v1QuoteMaterial.price_per_unit || 0,
        quantity: v1RfqRequestMaterial.quantity,
        RfqQuoteId: rfqQuote.id,
        RfqRequestId: rfqQuote.RfqRequestId,
        RfqRequestMaterialId: v1RfqRequestMaterial.NewId,
        createdAt: v1QuoteMaterial.created_at,
        updatedAt: v1QuoteMaterial.updated_at,
      };

      const createdQuoteMaterial = await this.RfqQuoteMaterialModel.create(
        quoteMaterialToCreate,
      );
      await this.V1RfqQuoteMaterialModel.update(
        { NewId: createdQuoteMaterial.id },
        { where: { id: v1QuoteMaterial.id } },
      );
      totalCost +=
        Number(v1QuoteMaterial.price_per_unit) *
        Number(v1RfqRequestMaterial.quantity);
    }
    return totalCost;
  }

  async migrateContracts() {
    const v1Contracts = await this.V1ContractModel.findAll({
      where: { NewId: null },
    });

    const errors = [];
    let migrated = 0;
    for (const v1Contract of v1Contracts) {
      try {
        const v1RfqRequest = await this.V1RfqRequestModel.findByPk(
          v1Contract.rfq_request_id,
        );
        const v1RfqQuote = await this.V1RfqQuoteModel.findByPk(
          v1Contract.rfq_qoute_id,
        );
        const rfqQuote = await this.RfqQuoteModel.findByPk(v1RfqQuote.NewId);
        const rfqRequest = await this.RfqRequestModel.findByPk(
          v1RfqRequest.NewId,
        );
        if (!rfqQuote || !rfqRequest) continue;

        const totalCost = Number(rfqQuote.totalCost);
        const fee = parseFloat(
          (totalCost * (this.configService.get('PERCENT_FEE') || 0.15)).toFixed(
            2,
          ),
        );

        const contractToCreate: CreationAttributes<Contract> = {
          acceptedAt: v1Contract.created_at,
          BuilderId: rfqRequest.BuilderId,
          completedAt:
            v1Contract.status === 'completed' ? v1Contract.updated_at : null,
          createdAt: v1Contract.created_at,
          deliveredAt:
            v1Contract.delivery_status === 'delivered'
              ? v1Contract.updated_at
              : null,
          deliveryStatus: v1Contract.delivery_status?.toUpperCase() as any,
          disbursedAt:
            v1Contract.status === 'completed' ? v1Contract.updated_at : null,
          dispatchedAt:
            v1Contract.delivery_status === 'delivered'
              ? v1Contract.updated_at
              : null,
          fee,
          isDisbursed: v1Contract.status === 'completed' ? true : false,
          paidAt:
            v1Contract.status === 'completed' ? v1Contract.updated_at : null,
          paymentStatus:
            v1Contract.status === 'completed'
              ? ContractPaymentStatus.CONFIRMED
              : ContractPaymentStatus.PENDING,
          RfqQuoteId: v1RfqQuote.NewId,
          RfqRequestId: v1RfqRequest.NewId,
          status:
            v1Contract.status === 'completed'
              ? ContractStatus.COMPLETED
              : ContractStatus.PENDING,
          totalCost,
          VendorId: rfqQuote.VendorId,
          updatedAt: v1Contract.updated_at,
          migratedAt: new Date(),
        };

        const createdContract = await this.ContractModel.create(
          contractToCreate,
        );
        await this.V1ContractModel.update(
          { NewId: createdContract.id },
          { where: { id: v1Contract.id } },
        );
        migrated += 1;
      } catch (error) {
        errors.push({
          message: error.message,
          id: v1Contract.id,
          clientId: v1Contract.client_id,
        });
      }
    }
    if (errors.length)
      this.logger.error({
        message: 'error occurred in migrating some contracts',
        rawData: JSON.stringify(errors),
      });

    this.logger.log(`migrated ${migrated} contracts`);
  }

  async migratePasswords() {
    const v1Users = await this.V1UserModel.findAll({
      where: { NewId: { [Op.ne]: null } },
    });
    for (const v1User of v1Users) {
      await this.UserModel.update(
        { password: v1User.password },
        { where: { id: v1User.NewId } },
      );
    }
  }
}
