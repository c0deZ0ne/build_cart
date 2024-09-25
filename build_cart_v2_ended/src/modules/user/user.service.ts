import * as argon2 from 'argon2';
import * as moment from 'moment';
import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  CreationAttributes,
  Op,
  Transaction as SequelizeTransaction,
} from 'sequelize';
import { User, UserLevel, UserStatus, UserType } from './models/user.model';
import { ConfigService } from '@nestjs/config';
import {
  ExpiryUnit,
  capitalizeWords,
  genAccountNumber,
  generateJwtExpiry,
  randomNumberGenerator,
} from 'src/util/util';
import { VerifyEmailDto, ResetPasswordDto, ActivateUserDto } from './dto';
import { Vendor } from 'src/modules/vendor/models/vendor.model';
import { EmailService } from '../email/email.service';
import { UserWalletService } from '../user-wallet/user-wallet.service';
import { UserWallet } from '../user-wallet/models/user-wallet.model';
import { Role } from '../rbac/models/role.model';
import { Permission } from '../rbac/models/permission';
import { Resource } from '../rbac/models/resource.model';
import { Sequelize } from 'sequelize-typescript';
import { Team } from '../rbac/models/team.model';
import { SecurityUpdateDTO } from './dto/user-security.dto';
import { UserRole } from '../rbac/models/user-role.model';
import { UserTransaction } from '../user-wallet-transaction/models/user-transaction.model';
import { Project } from '../project/models/project.model';
import { Contract } from '../contract/models';
import { Order } from '../order/models';
import { ProjectMedia } from '../project-media/models/project-media.model';
import { RfqBargain, RfqRequestMaterial } from '../rfq/models';
import { Builder, BuilderTier } from '../builder/models/builder.model';
import { FundManager } from '../fund-manager/models/fundManager.model';
import { TwilioService } from '../twilio/twilio.service';
import { ProjectTender } from '../fund-manager/models/project-tender.model';
import { TenderBid } from '../project/models/project-tender-bids.model';
import { UpdateUserDto } from './dto/create-user.dto';
import { UserPayLoad } from '../auth/types';
import { JwtService } from '@nestjs/jwt';
import { UserLog } from '../user-log/models/user-log.model';
import { seaMailerClient } from 'seamailer-nodejs';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
    @InjectModel(UserWallet)
    private readonly userWalletModel: typeof UserWallet,
    @InjectModel(Builder)
    private readonly builderModel: typeof Builder,
    @InjectModel(UserRole)
    private readonly userRoleModel: typeof UserRole,
    @InjectModel(UserTransaction)
    private readonly userTransactionModel: typeof UserTransaction,
    @InjectModel(Project)
    private readonly projectModel: typeof Project,
    @InjectModel(Contract)
    private readonly contractModel: typeof Contract,
    @InjectModel(Order)
    private readonly orderModel: typeof Order,
    @InjectModel(ProjectMedia)
    private readonly ProjectMediaModel: typeof ProjectMedia,
    @InjectModel(RfqBargain)
    private readonly RfqBargainModel: typeof RfqBargain,
    @InjectModel(RfqRequestMaterial)
    private readonly rfqRequestMaterialModel: typeof RfqRequestMaterial,
    @InjectModel(Role)
    private readonly roleModel: typeof Role,
    private readonly configService: ConfigService,
    private readonly twilioService: TwilioService,
    private readonly userWalletService: UserWalletService,
    private readonly sequelize: Sequelize,
    private emailService: EmailService,
    private custructEmailService: EmailService,
    private readonly jwtService: JwtService,
  ) {}

  // TODO: we should create the user personals(i.e builder, vendor, fundManager) after registering the user.
  async createUser({
    userData,
    dbTransaction,
    sso_user,
    createdByAdmin,
    generatedPassword,
    role,
  }: {
    userData: CreationAttributes<User>;
    dbTransaction?: SequelizeTransaction;
    sso_user?: boolean;
    createdByAdmin?: boolean;
    generatedPassword?: string;
    role?: string;
  }) {
    const dbTransactionInternal = await this.sequelize.transaction();

    try {
      const {
        email,
        password,
        phoneNumber,
        acceptTerms,
        location,
        businessName,
        userType,
        VendorId,
        BuilderId,
        CreatedById,
        FundManagerId,
        name,
        status,
        emailVerified,
      } = userData;

      const checkData = await this.findUserByIdWithEmail(userData.email);
      if (checkData.status == UserStatus.DEACTIVATED) {
        throw new BadRequestException(
          'This account was deleted please contact support to recover your account',
        );
      } else if (checkData.status == UserStatus.ACTIVE) {
        if (!checkData.user.emailVerified) {
          throw new BadRequestException('email not verified');
        } else {
          throw new BadRequestException('Account already exist please login');
        }
      }
      let emailOtp: number;
      let emailOtpExpiry: Date;
      if (!sso_user && !createdByAdmin) {
        emailOtp = randomNumberGenerator(6);
        emailOtpExpiry = moment()
          .add(this.configService.get('OTP_EXPIRY_IN_SEC') ?? 3600, 's')
          .toDate();
      }
      const userCreated = await this.userModel.create(
        {
          email: email.toLowerCase(),
          businessName,
          name,
          phoneNumber,
          acceptTerms,
          location,
          password,
          userType,
          VendorId,
          BuilderId,
          emailOtp: emailOtp || null,
          emailOtpExpiry: emailOtpExpiry || null,
          CreatedById,
          status: sso_user || createdByAdmin ? UserStatus.ACTIVE : status,
          emailVerified: sso_user || createdByAdmin ? true : emailVerified,
          sso_user: sso_user ? true : false,
          FundManagerId,
          level: createdByAdmin ? UserLevel.BETA : UserLevel.ALPHA,
        },
        { transaction: dbTransaction ? dbTransaction : dbTransactionInternal },
      );
      const account_number = await genAccountNumber(userCreated.id);
      const userWallet = await this.userWalletService.createWallet(
        {
          UserId: userCreated?.id,
          CreatedById: userCreated?.id,
          account_number,
        },
        dbTransaction ? dbTransaction : dbTransactionInternal,
      );
      userCreated.walletId = userWallet?.id;
      await userCreated.save({
        transaction: dbTransaction ? dbTransaction : dbTransactionInternal,
      });
      if (!sso_user && !createdByAdmin) {
        try {
          await this.custructEmailService.sendVerifyEmail({
            email,
            name,
            otp: emailOtp,
          });
          const RunningEnv = this.configService.get('NODE_ENV');
          if (RunningEnv === 'production' || RunningEnv == 'prod') {
            await this.twilioService.sendOtp(userCreated.phoneNumber, emailOtp);
          }
        } catch (error) {}
      }

      if (generatedPassword) {
        await this.emailService.sendGeneratedPasswordEmail({
          email,
          name,
          password: generatedPassword,
        });
      }

      const roleName = role || 'SUPER ADMIN';

      let roleInstance = await this.roleModel.findOne({
        where: { name: roleName },
        transaction: dbTransaction ? dbTransaction : dbTransactionInternal,
      });

      if (!roleInstance) {
        roleInstance = await this.roleModel.create(
          {
            name: roleName,
            description: capitalizeWords(roleName),
          },
          {
            transaction: dbTransaction ? dbTransaction : dbTransactionInternal,
          },
        );
      }

      await userCreated.$add('role', roleInstance, {
        transaction: dbTransaction ? dbTransaction : dbTransactionInternal,
      });

      !dbTransaction ? await dbTransactionInternal.commit() : null;
      const data: Partial<User> = {};
      data.id = userCreated.id;
      data.name = userCreated.name;
      data.businessName = userCreated.businessName;
      data.email = userCreated.email;
      data.phoneNumber = userCreated.phoneNumber;

      if (sso_user && userType === UserType.BUILDER) {
      }
      return data;
    } catch (error) {
      !dbTransaction ? await dbTransactionInternal.rollback() : null;
      throw new BadRequestException(error.message);
    }
  }

  async findUser(email: string) {
    return await this.userModel.findOne({ where: { email: email } });
  }

  async findUserByID(id: string) {
    return await this.userModel.findOne({ where: { id } });
  }

  async updateUser({
    user,
    body,
  }: {
    user: User;
    body: Partial<User>;
  }): Promise<User> {
    const userData = await User.update(
      { ...body, UpdatedById: user.id, updatedAt: new Date() },
      {
        where: {
          id: body.id,
        },
        returning: true,
      },
    );
    const [, affectedRows] = userData;
    return affectedRows[0];
  }
  async updateUserStatus(userId: string, status: UserStatus) {
    const userToUpdate = await this.findUserByID(userId);

    if (!userToUpdate) {
      throw new BadRequestException('User does not exist');
    }

    const [, affectedRows] = await this.userModel.update(
      {
        status: status,
      },
      { where: { email: userToUpdate.email }, returning: true },
    );

    const data: Partial<User> = {};
    data.id = affectedRows[0].id;
    data.name = affectedRows[0].name;
    data.businessName = affectedRows[0].status;
    data.email = affectedRows[0].email;
    data.phoneNumber = affectedRows[0].phoneNumber;
    return data;
  }

  async updateUserAndRole({
    data,
    role,
    userId,
    preexistingUser,
  }: {
    data: Partial<User>;
    role: string;
    userId: string;
    preexistingUser?: boolean;
  }) {
    const dbTransaction = await this.sequelize.transaction();

    try {
      const user = await this.userModel.findByPk(userId, {
        transaction: dbTransaction,
      });

      if (!user) {
        throw new BadRequestException('User does not exist');
      }

      const [, affectedRows] = await this.userModel.update(
        {
          ...data,
          UpdatedById: user.id,
          updatedAt: new Date(),
        },
        {
          where: {
            id: userId,
          },
          returning: true,
          transaction: dbTransaction,
        },
      );

      // find or create role

      let roleInstance = await this.roleModel.findOne({
        where: { name: role },
        transaction: dbTransaction,
      });

      if (!roleInstance) {
        roleInstance = await this.roleModel.create(
          {
            name: role,
            description: capitalizeWords(role),
          },
          {
            transaction: dbTransaction,
          },
        );
      }

      const [affectedCount, affectedRows2] = await this.userRoleModel.update(
        {
          RoleId: roleInstance.id,
        },
        {
          where: {
            UserId: userId,
          },
          returning: true,
          transaction: dbTransaction,
        },
      );

      if (!affectedCount) {
        throw new BadRequestException('User role not updated');
      }

      if (preexistingUser) {
        const superAdminRole = await this.roleModel.findOne({
          where: { name: 'SUPER ADMIN' },
          transaction: dbTransaction,
        });

        await this.userRoleModel.destroy({
          where: {
            UserId: userId,
            RoleId: superAdminRole.id,
          },
          transaction: dbTransaction,
          force: true,
        });
      }

      await dbTransaction.commit();

      return affectedRows[0];
    } catch (error) {
      dbTransaction.rollback();
      throw new BadRequestException(error.message);
    }
  }

  async checkUserExistence(email: string) {
    const user = await this.getUserByEmail(email);
    if (user) {
      throw new BadRequestException('Email already exist');
    }
  }

  /**
   * Checks if a user with the given Id already exists in the database
   * @param userId The ID of the user to check for existence
   * @return {status:"DEACTIVATED or ACTIVE or PENDING", user:null or User} BadRequestException if a builder with the email already exists
   */
  async findUserByIdWithEmail(email: string) {
    const user = await User.findOne({
      where: { email: email },
      paranoid: false,
    });

    if (user) {
      if (user.deletedAt) {
        return { status: UserStatus.DEACTIVATED, user };
      } else {
        return { status: UserStatus.ACTIVE, user };
      }
    } else {
      return { status: UserStatus.PENDING, user: null };
    }
  }
  /**
   * Checks if a user with the given Id already exists in the database
   * @param userId The ID of the user to check for existence
   * @return {status:"DEACTIVATED or ACTIVE or PENDING", user:null or User} BadRequestException if a builder with the email already exists
   */
  async findUserByIdWithUserId(userId: string) {
    const user = await User.findOne({
      where: { id: userId },
      paranoid: false,
    });

    if (user) {
      if (user.deletedAt) {
        return { status: UserStatus.DEACTIVATED, user };
      } else {
        return { status: UserStatus.ACTIVE, user };
      }
    } else {
      return { status: UserStatus.PENDING, user: null };
    }
  }

  async securityUpdate({
    user,
    securityUpdateDto,
  }: {
    user: User;
    securityUpdateDto: Partial<SecurityUpdateDTO>;
  }): Promise<User> {
    try {
      await this.userModel.update(
        { ...securityUpdateDto },
        { where: { id: user.id } },
      );
      return await user.reload();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getUserByEmail(email: string) {
    return await this.userModel.findOne({
      where: { email: email },
      include: [
        {
          model: Role,
          include: [
            {
              model: Permission,
              include: [{ model: Resource, include: [{ model: Permission }] }],
            },
          ],
        },
        { model: Vendor, attributes: ['businessName', 'logo'] },
        { model: FundManager, attributes: ['businessName', 'logo'] },
        { model: Builder, attributes: ['businessName', 'logo'] },
      ],
    });
  }
  async getTestUser(email: string) {
    return await this.userModel.findOne({
      where: { email: email },
      include: [
        { model: Builder, include: [{ all: true }] },
        {
          model: ProjectTender,
          include: [{ model: TenderBid }, { model: Builder }],
        },
        { model: Vendor },
        { model: FundManager, include: [{ all: true }] },
        { model: UserWallet },
        {
          model: Team,
          through: { attributes: [] },
          attributes: ['id'],
        },
        { model: UserLog },
      ],
    });
  }

  async getUserTeams(email: string) {
    return await this.userModel.findOne({
      where: { email: email },
      attributes: ['id'],
      include: [
        {
          model: Team,
          through: { attributes: [] },
          attributes: ['id'],
        },
      ],
    });
  }

  async getUserRoles(email: string) {
    return await this.userModel.findOne({
      where: { email: email },
      attributes: ['id', 'name'],
      include: [
        {
          model: Role,
          through: { attributes: [] },
          attributes: ['id', 'name'],
        },
      ],
    });
  }

  async getUserByEmailOrThrow(email: string) {
    const user = await this.getUserByEmail(email);
    if (!user) {
      throw new BadRequestException('Email not found');
    }
    return user;
  }

  async getUserById(userId: string) {
    return await this.userModel.findByPkOrThrow(userId, {
      include: [
        { model: Builder },
        { model: Vendor },
        { model: FundManager },
        { model: UserWallet },
      ],
    });
  }

  async getUserTeam(id: string) {
    return await this.userModel.findByPkOrThrow(id, {
      attributes: ['id'],
      include: [{ model: Team, attributes: ['id', 'name'] }],
    });
  }

  async getUserWallet(email: string, search_param?: string) {
    const whereClause = {
      email: email,
      ...(search_param && {
        createdAt: {
          [Op.gte]: moment()
            .subtract(parseInt(search_param, 10), 'days')
            .toDate(),
        },
      }),
    };

    return await this.userModel.findOne({
      where: whereClause,
      include: [{ model: UserWallet }],
    });
  }

  private async createContact(user: User) {
    // Add the users to custruct bulk mailer contact lists upon registration/verification
    seaMailerClient
      .createContact({
        contacts: [
          {
            email: user.email,
            firstName: user.businessName,
          },
        ],
      })
      .then();
  }

  async verifyEmail(body: VerifyEmailDto) {
    const { email, emailOtp } = body;

    const user = await this.getUserByEmailOrThrow(email);

    if (user.emailVerified) {
      throw new BadRequestException('Email already verified');
    }
    if (emailOtp !== user.emailOtp) {
      throw new BadRequestException('Invalid otp');
    }
    if (user.emailOtpExpiry && moment(user.emailOtpExpiry).isBefore(moment())) {
      throw new BadRequestException('Otp expired');
    }

    await this.createContact(user);

    const [, affectedRows] = await this.userModel.update(
      {
        emailVerified: true,
        emailOtp: null,
        emailOtpExpiry: null,
        status: UserStatus.ACTIVE,
      },
      { where: { email }, returning: true },
    );

    const data: Partial<User> = {};
    data.id = affectedRows[0].id;
    data.name = affectedRows[0].name;
    data.businessName = affectedRows[0].businessName;
    data.email = affectedRows[0].email;
    data.phoneNumber = affectedRows[0].phoneNumber;
    return data;
  }

  async verifyEmailAndCreateBuilderAndLogin(body: VerifyEmailDto) {
    const verifiedUser = await this.verifyEmail(body);
    const { id, email } = verifiedUser;
    if (verifiedUser) {
      const createdBuilder = await this.builderModel.create({
        email: email,
        createdById: id,
        updatedById: id,
        createdAt: new Date(),
        lastLogin: new Date(),
        tier: BuilderTier.two,
      });

      const updateData = await User.update(
        {
          BuilderId: createdBuilder.id,
          Builder: createdBuilder,
          updatedAt: new Date(),
          UpdatedById: id,
        },
        {
          where: {
            id,
          },
          returning: true,
        },
      );

      const [affectedCount, affectedRows] = updateData;
      if (!affectedCount)
        throw new Error(
          'Please try again  we could not update your account userType',
        );

      const configExp: string =
        this.configService.get('JWT_EXPIRATION').replace('_', ' ') || '2 days';
      const configExpDate = configExp.split(' ');
      const expires = generateJwtExpiry(
        Number(configExpDate[0]),
        configExpDate[1] as ExpiryUnit,
      );

      const userTeams = await this.getUserTeams(verifiedUser.email);

      const payload: UserPayLoad = {
        sub: verifiedUser.id,
        status: verifiedUser.status,
        logo: verifiedUser?.Builder
          ? verifiedUser?.Builder?.logo
          : verifiedUser?.Vendor
          ? verifiedUser?.Vendor?.logo
          : verifiedUser?.FundManager?.logo || '',
        userName: verifiedUser.name || verifiedUser.businessName,
        id: verifiedUser.id,
        email: verifiedUser.email,
        userType: verifiedUser.userType,
      };

      const token = this.jwtService.sign(payload, {
        expiresIn: configExp,
      });

      if (
        verifiedUser.twoFactorAuthEnabled ||
        verifiedUser.emailNotificationEnabled
      ) {
        try {
          await this.emailService.loginNotification({
            email: verifiedUser.email,
            name: verifiedUser.name,
          });
        } catch (error) {}
      }

      return {
        token,
        expires,
        ...payload,
        teams: userTeams.teams,
        firstLogin: verifiedUser.lastLogin ? false : true,
      };
    }
  }

  async requestOtp(email: string) {
    const user = await this.getUserByEmailOrThrow(email);

    if (user.emailVerified) {
      throw new BadRequestException('Email already verified');
    }

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

    await this.emailService.resendOTPMail({
      name: user.name,
      email: user.email,
      otp: emailOtp,
    });

    return {};
  }

  async requestResetPassword(email: string) {
    const user = await this.getUserByEmailOrThrow(email);

    const resetPasswordOtp = randomNumberGenerator(6);

    await this.userModel.update(
      {
        resetPasswordOtp,
        resetPasswordOtpExpiry: moment()
          .add(this.configService.get('OTP_EXPIRY_IN_SEC') ?? 3600, 's')
          .toDate(),
      },
      { where: { email } },
    );

    await this.emailService.resetPassword(
      user.email,
      resetPasswordOtp,
      user.name,
    );

    return {};
  }

  async resetPassword(body: ResetPasswordDto) {
    const { email, resetPasswordOtp, password } = body;

    const user = await this.getUserByEmailOrThrow(email);

    if (resetPasswordOtp !== user.resetPasswordOtp) {
      throw new BadRequestException('Invalid otp');
    }
    if (
      user.resetPasswordOtpExpiry &&
      moment(user.resetPasswordOtpExpiry).isBefore(moment())
    ) {
      throw new BadRequestException('Otp expired');
    }

    await this.userModel.update(
      {
        resetPasswordOtp: null,
        resetPasswordOtpExpiry: null,
        password,
      },
      { where: { email }, individualHooks: true },
    );
  }

  async activateUser(body: ActivateUserDto) {
    const { email, emailOtp, password } = body;

    const user = await this.getUserByEmailOrThrow(email);

    if (user.status === UserStatus.ACTIVE) {
      throw new BadRequestException('User already activated');
    }

    if (emailOtp !== user.emailOtp) {
      throw new BadRequestException('Invalid otp');
    }
    if (user.emailOtpExpiry && moment(user.emailOtpExpiry).isBefore(moment())) {
      throw new BadRequestException('Otp expired');
    }

    await this.userModel.update(
      {
        emailOtp: null,
        emailOtpExpiry: null,
        emailVerified: true,
        status: UserStatus.ACTIVE,
        password,
      },
      { where: { email }, individualHooks: true },
    );
  }

  async userUpdatePassword(
    userId: string,
    oldPassword: string,
    password: string,
  ) {
    const user = await this.getUserById(userId);
    if (!(await argon2.verify(user.password, oldPassword))) {
      throw new NotAcceptableException('Old Password is not correct');
    }

    await this.updatePassword(userId, password);
  }

  async updatePassword(userId: string, password: string) {
    await this.userModel.update(
      { password },
      { where: { id: userId }, individualHooks: true },
    );
  }

  /** Update User's Profile
   * @param userId The ID of the builder to update
   * @param IUpdateUserDto  The interface of DTO containing user information to update
   * @throws NotAcceptableException if password is incorrect
   */

  async updateUserProfile(userId: string, updateUserDto: UpdateUserDto) {
    await this.userModel.update(
      { ...updateUserDto },
      { where: { id: userId } },
    );
    return { message: 'Profile updated Successfully' };
  }

  async updateLastLogin(userId: string) {
    await this.userModel.update(
      { lastLogin: new Date() },
      { where: { id: userId } },
    );
  }

  async getAllUsers() {
    return await this.userModel.findAll({
      where: { userType: { [Op.ne]: UserType.ADMIN } },
      include: [{ model: Builder }, { model: Vendor }],
    });
  }

  async getAllUsersOpen() {
    return await this.userModel.findAll({
      include: [{ model: Builder }, { model: Vendor }],
    });
  }

  async adminGetAllVendor() {
    return await this.userModel.findAll({
      where: {
        userType: { [Op.eq]: UserType.SUPPLIER },
      },
      attributes: ['id', 'name', 'status', 'createdAt', 'lastLogin'],
      include: [
        {
          model: User,
          as: 'CreatedBy',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: Vendor,
          attributes: [
            'id',
            'email',
            'logo',
            'createdAt',
            'phone',
            'contactName',
            'lastLogin',
            'country',
            'tradingName',
            'companyName',
            'address',
            'state',
            'status',
          ],
        },
      ],
    });
  }

  async adminDeactivate(userid: string) {
    await this.userModel.update(
      { status: UserStatus.DEACTIVATED },
      { where: { id: userid }, returning: true },
    );
  }

  async adminActivate(userid: string) {
    await this.userModel.update(
      {
        emailOtp: null,
        emailOtpExpiry: null,
        emailVerified: true,
        status: UserStatus.ACTIVE,
      },
      { where: { id: userid }, returning: true, individualHooks: true },
    );
  }

  async deleteUser(userId: string) {
    const dbTransaction = await this.sequelize.transaction();

    try {
      const userData = await this.userModel.findOne({ where: { id: userId } });
      if (!userData) throw new BadRequestException('user not found');
      await this.userTransactionModel.destroy({
        where: { UserWalletId: userData.walletId },
        transaction: dbTransaction,
      });

      await this.orderModel.destroy({
        where: {
          ProjectId: {
            [Op.in]: Sequelize.literal(
              `(SELECT id FROM "Projects" WHERE "CreatedById" = '${userId}')`,
            ),
          },
        },
        transaction: dbTransaction,
      });
      await this.RfqBargainModel.destroy({
        where: {
          CreatedById: userId,
        },
        transaction: dbTransaction,
      });
      await this.userModel.destroy({
        where: {
          CreatedById: userId,
        },
        transaction: dbTransaction,
      });
      await this.rfqRequestMaterialModel.destroy({
        where: {
          ProjectId: {
            [Op.in]: Sequelize.literal(
              `(SELECT id FROM "Projects" WHERE "CreatedById" = '${userId}')`,
            ),
          },
        },
        transaction: dbTransaction,
      });

      await this.contractModel.destroy({
        where: {
          ProjectId: {
            [Op.in]: Sequelize.literal(
              `(SELECT id FROM "Projects" WHERE "CreatedById" = '${userId}')`,
            ),
          },
        },
        transaction: dbTransaction,
      });

      await this.ProjectMediaModel.destroy({
        where: {
          ProjectId: {
            [Op.in]: Sequelize.literal(
              `(SELECT id FROM "Projects" WHERE "CreatedById" = '${userId}')`,
            ),
          },
        },
        transaction: dbTransaction,
      });

      await this.projectModel.destroy({
        where: { CreatedById: userData.id },
        transaction: dbTransaction,
      });

      await this.userWalletModel.destroy({
        where: { UserId: userId },
        transaction: dbTransaction,
      });

      await this.userRoleModel.destroy({
        where: { UserId: userId },
        transaction: dbTransaction,
      });

      await this.userModel.destroy({
        where: { id: userId },
        transaction: dbTransaction,
      });
      await dbTransaction.commit();
      return 'Deleted successfully';
    } catch (error) {
      dbTransaction.rollback();
      throw new BadRequestException(error.message);
    }
  }
}
