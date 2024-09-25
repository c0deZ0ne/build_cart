import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { ProjectService } from '../project/project.service';
import { User, UserType } from '../user/models/user.model';
import { InjectModel } from '@nestjs/sequelize';
import * as argon2 from 'argon2';
import * as moment from 'moment';
import { UserRole } from '../rbac/models/user-role.model';
import { Role } from '../rbac/models/role.model';
import { Op } from 'sequelize';
import { TransactionType } from '../project-wallet-transaction/models/project-transaction.model';
import {
  TransactionStatus,
  UserTransaction,
} from '../user-wallet-transaction/models/user-transaction.model';
import { Order, OrderStatus } from '../order/models';
import {
  superAdminUpdatePasswordDto,
  superAdminUpdateProfileDto,
} from './dto/super-admin-profileDto';
import { randomNumberGenerator } from 'src/util/util';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '../email/email.service';
import { UserLog } from '../user-log/models/user-log.model';
import { Commission } from '../escrow/models/commision.model';
import { UpdateCommissionDto } from './dto/super-admin-create-project-categoryDto';
import { UploadDocumentsDto } from '../vendor/dto';
import { Documents } from '../documents/models/documents.model';

@Injectable()
export class SuperAdminService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
    @InjectModel(UserLog)
    private readonly userLogModel: typeof UserLog,
    @InjectModel(Role)
    private readonly roleModel: typeof Role,
    @InjectModel(UserRole)
    private readonly userRoleModel: typeof UserRole,
    @InjectModel(UserTransaction)
    private readonly userTransaction: typeof UserTransaction,
    @InjectModel(Order)
    private readonly orderModel: typeof Order,
    @InjectModel(Commission)
    private readonly commissionModel: typeof Commission,
    @InjectModel(Documents)
    private readonly documentsModel: typeof Documents,

    private projectService: ProjectService,
    private readonly configService: ConfigService,
    private emailService: EmailService,
  ) {}

  async getDashboard() {
    const transactions = await this.userTransaction.findAll({});

    const totalPendingPayout = transactions.reduce(function (result, item) {
      if (item.status === TransactionStatus.PENDING) {
        return result + Number(item.amount);
      }
      return result;
    }, 0);
    const totalTransactionVolume = transactions.reduce(function (result, item) {
      return result + Number(item.amount);
    }, 0);

    const totalRevenue = transactions.reduce(function (result, item) {
      if (
        item.type === TransactionType.DEPOSIT ||
        item.type === TransactionType.TRANSFER
      ) {
        return result + Number(item.amount);
      }
      return result;
    }, 0);

    const projects = await this.projectService.getAllProjects();

    const activeRfqs = projects.reduce(function (result, item) {
      return result + item.Rfqs.length;
    }, 0);

    const orders = await this.orderModel.findAll({
      where: { status: OrderStatus.ONGOING },
    });

    const users = await this.userModel.findAll({
      where: {
        userType: {
          [Op.or]: UserType.BUILDER,
          [Op.or]: [UserType.SUPPLIER],
          [Op.or]: [UserType.FUND_MANAGER],
        },
      },
    });

    let builder = 0;
    let supplier = 0;
    let fundManager = 0;
    let totalSignups = 0;

    users.map((user) => {
      if (user.userType === UserType.BUILDER) {
        builder += 1;
      }
      if (user.userType === UserType.FUND_MANAGER) {
        fundManager += 1;
      }
      if (user.userType === UserType.SUPPLIER) {
        supplier += 1;
      }
      if (user.CreatedById === null) {
        totalSignups += 1;
      }
    });

    return {
      totalPendingPayout: totalPendingPayout ? totalPendingPayout : 0,
      totalTransactionVolume: totalTransactionVolume
        ? totalTransactionVolume
        : 0,
      totalRevenue: totalRevenue ? totalRevenue : 0,
      activeprojects: projects.length,
      activeRfqs,
      activeOrders: orders.length,
      totalCustomers: users.length,
      totalSignups,
      customers: {
        builder,
        supplier,
        fundManager,
      },
    };
  }

  async getProcurementManagers(id: string) {
    return await this.userRoleModel.findAll({
      where: {
        RoleId: id,
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: Role,
          as: 'role',
        },
      ],
    });
  }

  async getProfile(id: string) {
    return await this.userModel.findOne({
      where: {
        id,
      },
      attributes: { exclude: ['password'] },
    });
  }

  async getRoles() {
    return await this.roleModel.findAll();
  }

  async updateProfile(userId: string, data: superAdminUpdateProfileDto) {
    const user = await this.userModel.findOne({
      where: { id: userId },
    });

    if (!user) throw new NotFoundException('user does not exist');
    const updatedData = await this.userModel.update(
      { ...data },
      { where: { id: userId }, returning: true },
    );
    const [affectedCount, affectedRows] = updatedData;
    return affectedRows[0];
  }

  async updatePassword(userId: string, data: superAdminUpdatePasswordDto) {
    const { oldPassword, newPassword } = data;
    const user = await this.userModel.findOne({
      where: { id: userId },
    });

    if (!user) throw new NotFoundException('user does not exist');

    if (!(await argon2.verify(user.password, oldPassword))) {
      throw new NotAcceptableException('Old Password is not correct');
    }
    const updatedData = await this.userModel.update(
      { password: newPassword },
      { where: { id: userId }, returning: true },
    );
    const [affectedCount, affectedRows] = updatedData;
    return affectedRows[0];
  }

  async request2faOtp(email: string) {
    const user = await this.userModel.findOne({
      where: { email },
    });

    if (!user) throw new NotFoundException('user does not exist');

    const emailOtp = randomNumberGenerator(6);

    await this.userModel.update(
      {
        emailOtp,
        emailOtpExpiry: moment()
          .add(this.configService.get('OTP_EXPIRY_IN_SEC') ?? 3600, 's')
          .toDate(),
      },
      { where: { email } },
    );

    await this.emailService.send2FAMail({
      name: user.name,
      email: user.email,
      otp: emailOtp,
    });

    return {};
  }

  async set2faProfile(userId: string, otp: number) {
    const user = await this.userModel.findOne({
      where: { id: userId },
    });

    if (!user) throw new NotFoundException('user does not exist');
    if (user.emailOtp !== otp) {
      throw new BadRequestException('invalid otp');
    }
    if (moment(user.resetPasswordOtpExpiry).isBefore(moment())) {
      throw new BadRequestException('Otp expired');
    }
    const updatedData = await this.userModel.update(
      { twoFactorAuthEnabled: true },
      { where: { id: userId }, returning: true },
    );
    const [affectedCount, affectedRows] = updatedData;
    return affectedRows[0];
  }

  async getUserLogs() {
    return await this.userLogModel.findAll({
      include: [{ model: User, attributes: { exclude: ['password'] } }],
    });
  }

  async getAUserLog(logId: string) {
    return await this.userLogModel.findOne({
      where: { id: logId },
      include: [{ model: User, attributes: { exclude: ['password'] } }],
    });
  }

  async getUserLogsByUserId(userId: string) {
    return await this.userLogModel.findAll({
      where: { teamMemberId: userId },
      include: [{ model: User, attributes: { exclude: ['password'] } }],
    });
  }
  async addCommisionPercentage(percentageNumber: number) {
    return await this.commissionModel.create({
      percentageNumber,
    });
  }

  async getAllCommisionPercentage() {
    return await this.commissionModel.findAll({});
  }

  async updateCommisionPercentage(
    commissionId: string,
    data: UpdateCommissionDto,
  ) {
    const updatedData = await this.commissionModel.update(
      { ...data },
      { where: { id: commissionId }, returning: true },
    );

    const [affectedCount, affectedRows] = updatedData;
    return affectedRows[0];
  }

  async updateUserDocuments(data: UploadDocumentsDto, userId: string) {
    await this.userModel.findOrThrow({
      where: { id: userId },
    });
    return await this.documentsModel.upsert({ ...data, UserId: userId });
  }
}
