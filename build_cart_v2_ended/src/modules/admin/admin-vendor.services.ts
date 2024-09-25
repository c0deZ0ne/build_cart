import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { VerifymeCheck } from 'src/util/util';
import { Builder } from '../builder/models/builder.model';
import { EmailService } from '../email/email.service';

import { User, UserStatus, UserType } from '../user/models/user.model';
import { UserService } from '../user/user.service';
import { Sequelize } from 'sequelize-typescript';
import { Op, Transaction } from 'sequelize';
import { randomUUID } from 'crypto';
import { AdminRegisterVendorDto } from './dto/admin-create-vendor.dto';
import {
  Vendor,
  VendorStatus,
  VendorTier,
} from '../vendor/models/vendor.model';
import { AdminUpdateVendorProfileDto, RegisterVendorDto } from '../vendor/dto';

@Injectable()
export class AdminVendorService {
  constructor(
    @InjectModel(Vendor)
    private readonly vendorModel: typeof Vendor,
    @InjectModel(User)
    private readonly userModel: typeof User,

    private readonly sequelize: Sequelize,
    private userService: UserService,
    private emailService: EmailService,
  ) {}

  /**
   * Registers a new Builder with the provided email and password.
   *
   * @param AdminCreateBuilderDto The DTO containing the email and password of the new Builder.
   * @returns The created Builder with a generated email OTP.
   * @throws BadRequestException if the provided email is already in use.
   */
  // async AdminRegisterVendor({
  //   body,
  //   dbTransaction,
  //   user,
  // }: {
  //   body: RegisterVendorDto;
  //   user: User;
  //   dbTransaction?: Transaction;
  // }): Promise<Partial<User>> {
  //   if (!dbTransaction) {
  //     dbTransaction = await this.sequelize.transaction();
  //   }

  //   try {
  //     const checkExistingUser = await this.userModel.findOne({
  //       where: { email: body.b },
  //     });
  //     if (checkExistingUser)
  //       throw new BadRequestException('user already exist with this email ');

  //     const vendorExist = await this.vendorModel.findOne({
  //       where: { businessName: body.businessName },
  //     });
  //     if (vendorExist) throw new BadRequestException('Vendor already exist');
  //     let IsVerifiedFromVerifyme = false;

  //     if (body.RC_Number) {
  //       IsVerifiedFromVerifyme = await VerifymeCheck(body.RC_Number);
  //     }
  //     const vendorData = await this.vendorModel.create(
  //       {
  //         ...body,
  //         email: body.contactEmail,
  //         createdById: user.id,
  //         status: IsVerifiedFromVerifyme
  //           ? VendorStatus.APPROVED
  //           : VendorStatus.APPROVED,
  //         tier: IsVerifiedFromVerifyme ? VendorTier.one : VendorTier.two,
  //         createdAt: new Date(),
  //         lastLogin: new Date(),
  //       },
  //       { transaction: dbTransaction },
  //     );

  //     const password = randomUUID().substring(10);
  //     const newUserData = await this.userService.createUser({
  //       user: {
  //         ...body,
  //         name: body.businessName,
  //         email: body.contactEmail,
  //         phoneNumber: body.contactPhone,
  //         userType: UserType.SUPPLIER,
  //         status: UserStatus.ACTIVE,
  //         VendorId: vendorData.id,
  //         CreatedById: user.id,
  //         password,
  //       },
  //       createdByAdmin: true,
  //       dbTransaction,
  //     });
  //     dbTransaction.commit();
  //     return newUserData;
  //   } catch (error) {
  //     dbTransaction.rollback();
  //     throw new BadRequestException(error.message);
  //   }
  // }

  async adminGetAllVendors() {
    return await this.userModel.findAll({
      where: {
        userType: { [Op.eq]: UserType.SUPPLIER },
      },
      attributes: [
        'id',
        'name',
        'createdAt',
        'lastLogin',
        'status',
        'location',
      ],
      include: [
        {
          model: User,
          as: 'CreatedBy',
          attributes: ['name', 'email', 'id', 'status', 'location'],
        },
        {
          model: Vendor,
          include: [{ all: true }],
        },
      ],
    });
  }

  async adminDeactivate(userId: string) {
    return await this.userService.adminDeactivate(userId);
  }

  async adminActivate(userId: string) {
    return await this.userService.adminActivate(userId);
  }

  /**
   * Update a vendor's profile
   * @param vendorId The ID of the vendor to update
   * @param updateVendorDto The DTO containing the updated vendor information
   */
  async adminUpdateVendorProfile(
    vendorId: string,
    updateVendorDto: AdminUpdateVendorProfileDto,
  ) {
    const {
      logo,
      businessSize,
      businessAddress,
      about,
      businessName,
      businessRegNo,
      vendorType,
    } = updateVendorDto;
    const updatedData = await this.vendorModel.update(
      {
        logo,
        businessSize,
        businessAddress,
        businessRegNo,
        about,
        businessName,
        VendorType: vendorType,
      },

      { where: { id: vendorId }, returning: true },
    );
    const [affectedCount, affectedRows] = updatedData;
    return affectedRows[0];
  }
  /**
   * get  a vendor's profile details
   * @param vendorId The ID of the vendor to update
   */
  async adminGetVendorProfile(vendorId: string) {
    return await this.vendorModel.findByPkOrThrow(vendorId, {
      include: [{ all: true }],
    });
  }
}
