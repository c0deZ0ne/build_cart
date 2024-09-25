import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserService } from '../user/user.service';
import { CreateTemporaryVendorDto } from './dto/create-temporary-vendor.dto';
import { TemporaryVendor } from './model/temporary-vendor.model';
import { Vendor } from '../vendor/models/vendor.model';
import { generateStoreNumber } from 'src/util/util';

@Injectable()
export class TemporaryVendorService {
  constructor(
    @InjectModel(TemporaryVendor)
    private readonly temporaryVendorModel: typeof TemporaryVendor,
    @InjectModel(Vendor)
    private readonly vendorModel: typeof Vendor,
    private readonly userService: UserService,
  ) {}

  async createTemporaryVendor(body: CreateTemporaryVendorDto) {
    const user = await this.userService.getUserByEmail(body.email);
    if (user && user.BuilderId) {
      return {
        ...user,
        status: 'error',
        message: 'Existing Builder',
      };
    }
    // // if user exists and is a vendor
    if (user && user.VendorId) {
      const vendor = await this.vendorModel.findOne({
        where: {
          id: user.VendorId,
        },
      });

      if (!vendor.store_number) {
        await this.vendorModel.update(
          {
            store_number: generateStoreNumber(8),
          },
          {
            where: {
              id: user.VendorId,
            },
          },
        );
        return {
          ...vendor,
          status: 'error',
          message: 'Existing Vendor',
        };
      } else {
        return {
          ...vendor,
          status: 'error',
          message: 'Existing Vendor',
        };
      }
    }

    const temporaryVendor = await this.checkIfVendorExists(body.email);
    if (temporaryVendor) {
      return {
        ...temporaryVendor,
        status: 'error',
        message: 'Temporary Vendor Exists',
      };
    }
    return await this.temporaryVendorModel.create({
      ...body,
    });
  }

  async checkIfVendorExists(email: string) {
    const user = await this.temporaryVendorModel.findOne({
      where: {
        email,
      },
    });

    if (user) {
      return user;
    }
    return null;
  }

  async getUserByEmail(email: string) {
    const vendor = await this.temporaryVendorModel.findOne({
      where: {
        email,
      },
    });

    if (!vendor) {
      throw new BadRequestException('No temporary vendor found');
    }
    return vendor;
  }

  async deleteTemporaryVendor(email: string) {
    return await this.temporaryVendorModel.destroy({
      where: {
        email,
      },
    });
  }
}
