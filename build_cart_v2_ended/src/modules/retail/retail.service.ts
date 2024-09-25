import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { generateTransactionNumber } from 'src/util/util';
import { EmailService } from '../email/email.service';
import { LabourHackService } from '../labour-hack/labour-hack.service';
import { ProductService } from '../product/services/product.service';
import { CreateRetailTransactionDto } from './dto/create-retail-transaction.dto';
import { CreateRetailUserDto } from './dto/create-retail-user.dto';
import { RetailTransaction } from './models/retail-transaction.model';
import { RetailUser } from './models/retail.model';
import { VendorProductService } from '../vendor-product/services/vendor-product.service';
import { BuilderService } from '../builder/builder.service';
import { UserService } from '../user/user.service';
import { ProductSpecificationProduct } from '../product/models/productSpecification.model';
import { ProductSpecification } from '../product/models/specification.model';
import { Product } from '../product/models/product.model';

@Injectable()
export class RetailService {
  constructor(
    @InjectModel(RetailUser)
    private readonly retailUserModel: typeof RetailUser,
    @InjectModel(RetailTransaction)
    private readonly retailTransactionModel: typeof RetailTransaction,
    private emailService: EmailService,
    private labourHackService: LabourHackService,
    private productService: ProductService,
    private vendorProductService: VendorProductService,
    private builderService: BuilderService,
    private userService: UserService,
  ) {}

  async createUser(
    createRetailUserDto: CreateRetailUserDto,
    sendNewUserMail = true,
  ) {
    try {
      const retailUser = await this.checkRetailUserExistence(
        createRetailUserDto.email.toLocaleLowerCase(),
      );

      if (retailUser) {
        const check = retailUser.enquiry
          .split(',')
          .includes(createRetailUserDto.enquiry);

        if (check) {
          if (sendNewUserMail) {
            await this.emailService.sendEnquiryEmail(createRetailUserDto);
          }
          return retailUser;
        }

        const [, [updatedRecord]] = await this.retailUserModel.update(
          {
            enquiry: createRetailUserDto.enquiry
              ? `${retailUser.enquiry}, ${createRetailUserDto.enquiry}`
              : retailUser.enquiry,
          },
          {
            where: {
              email: createRetailUserDto.email,
            },
            returning: true,
          },
        );

        if (sendNewUserMail) {
          await this.emailService.sendEnquiryEmail(createRetailUserDto);
        }

        return updatedRecord;
      }

      if (!createRetailUserDto.enquiry) {
        createRetailUserDto.enquiry = `none`;
      }

      const createdRetailUser = await this.retailUserModel.create(
        createRetailUserDto,
      );

      if (sendNewUserMail) {
        await this.emailService.sendEnquiryEmail(createRetailUserDto);
      }

      return createdRetailUser;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async createTransaction(
    createRetailTransactionDto: CreateRetailTransactionDto,
  ) {
    const { products, retail_user_details, services } =
      createRetailTransactionDto;
    const { email } = retail_user_details;

    products.forEach(async (product) => {
      if (product.productSpecificationProductID) {
        await this.productService.getProductByProductSpecification(
          product.productSpecificationProductID,
        );
      }
      if (product.vendorProductSpecificationProductID) {
        await this.vendorProductService.getVendorProductByProductSpecification(
          product.vendorProductSpecificationProductID,
        );
      }
    });

    services.forEach((service) => {
      if (service.labourHackID) {
        this.labourHackService.getLabourHackById(service.labourHackID);
      }
    });
    // // check if labour hack id is valid

    try {
      const user = await this.userService.getUserByEmail(email);
      const builder = await this.builderService.findBuilderByEmail(email);

      if (!builder) {
        throw new BadRequestException('Restricted operation to builders only');
      }

      const user_orders = await this.getUserOrders(builder.id);

      const uniqueOrders = new Set(
        user_orders.map((item) => item.transaction_no),
      );

      const transaction_no = generateTransactionNumber();

      const serviceData = services.map((service) => {
        return {
          ...service,
          transaction_no,
          builderID: builder.id,
          // delivery_date: 'None',
          delivery_address: retail_user_details.delivery_address,
        };
      });

      const productData = products.map((product) => {
        return {
          ...product,
          transaction_no,
          builderID: builder.id,
          // delivery_date: 'None',
          delivery_address: retail_user_details.delivery_address,
        };
      });

      const transactionBody = [...productData, ...serviceData];
      const transaction = await this.retailTransactionModel.bulkCreate(
        transactionBody,
      );

      await this.emailService.sendUserRetailTransactionEmail(
        retail_user_details,
        products,
        services,
      );

      await this.emailService.sendAdminRetailTransactionEmail(
        {
          email: builder.email,
          name: user.name,
          phone: user.phoneNumber,
          delivery_address: retail_user_details.delivery_address,
        },
        products,
        services,
        uniqueOrders.size,
      );

      return transaction;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async checkRetailUserExistence(email: string) {
    const buyer = await this.retailUserModel.findOne({ where: { email } });
    if (buyer) {
      return buyer;
    } else {
      return null;
    }
  }

  async getAllUsers() {
    return this.retailUserModel.findAll();
  }

  async getUserById(id: string) {
    return this.retailUserModel.findByPk(id);
  }

  async getUserByFilter(filter: string) {
    return this.retailUserModel.findAll({
      where: {
        name: {
          [Op.iLike]: '%' + filter + '%',
        },
      },
    });
  }

  async getUserOrders(id: string) {
    try {
      const orders = this.retailTransactionModel.findAll({
        where: {
          builderID: id,
        },
      });

      return orders;
    } catch (error) {}
  }

  async getAllTransactions(builderId: string, status?: string) {
    if (status && !['PENDING', 'COMPLETE', 'FAILED'].includes(status)) {
      throw new BadRequestException('Invalid status');
    }

    const transactions = await this.retailTransactionModel.findAll({
      where: {
        builderID: builderId,
        status: status ? status : { [Op.not]: null },
      },
      include: [
        {
          model: ProductSpecificationProduct,
          as: 'productSpecificationProduct',
          include: [
            {
              model: ProductSpecification,
              as: 'specification',
            },
            {
              model: Product,
              as: 'product',
            },
          ],
        },
      ],
    });

    return transactions;
  }
}
