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
