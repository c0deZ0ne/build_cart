import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from '../product/models/product.model';
import { ProductMetric } from '../product/models/metric.model';
import { ProductCategory } from '../product/models/category.model';
import { Vendor } from '../vendor/models/vendor.model';
import { Sequelize } from 'sequelize-typescript';
import { RfqCategory } from '../rfq/models';
import { IdVerificationStatus, User } from '../user/models/user.model';
import { businessInfo, docs, recoveryType, verificationType } from './types';
import { WhereOptions } from 'sequelize';
import { FundManager } from '../fund-manager/models/fundManager.model';
import { Builder } from '../builder/models/builder.model';
import { UpdateEmailDto } from './dto/security-update.dto';

@Injectable()
export class SupportAdminRecoveryService {
  constructor(
    @InjectModel(Vendor)
    private readonly vendorModel: typeof Vendor,
    @InjectModel(User)
    private readonly userModel: typeof User,
    private readonly sequelize: Sequelize,
  ) { }


  async getAllAccountRecoveryRequest({ user }: { user?: User }) {
    const pendingUsers = await this.userModel.findAll({ where: { recovery_request: true } })
    const data: recoveryType[] = []
    return pendingUsers.reduce((curr, acc) => {
      const file: recoveryType = {
        customerName: acc.businessName || acc.name,
        customerType: acc.userType,
        phoneNumber: acc.phoneNumber,
        signupDate: acc.createdAt,
        IdVerificationStatus: acc.IdVerificationStatus,
        userId: acc.id,
        logo: acc?.Builder?.logo || acc?.Vendor?.logo || "",
        recovery_request_type: acc.recovery_request_type
      }
      curr.push(file)
      return curr
    }, data)
  }

  async updateUserEmail({ body, user, customerId }: { body: UpdateEmailDto, user: User, customerId: string }) {
    try {
      const userData = await this.userModel.findByPkOrThrow(customerId)
      if(userData.email==body.email)throw new Error("Please provide email different from your previous email")
      const isExist = await this.userModel.findOne({ where: { email: body.email } })
      if (isExist) throw new Error("please provide different email")
      userData.email = body.email
      userData.recovery_request = false
      user.recovery_request_type = ''
      await userData.save()
      return userData.reload()
    } catch (error) {
      throw new BadRequestException(error.message)
    }

  }
}
