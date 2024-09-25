import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { VerifymeCheck } from 'src/util/util';
import {
  Builder,
  BuilderTier,
  CreditStatus,
} from '../builder/models/builder.model';
import { EmailService } from '../email/email.service';
import { User, UserType } from '../user/models/user.model';
import { UserService } from '../user/user.service';
import { Sequelize } from 'sequelize-typescript';
import { Op, Transaction } from 'sequelize';
import { randomUUID } from 'crypto';
import { AdminUpdateBuilderProfileDto } from '../builder/dto';
import { AdminCreateBuilderDto } from './dto/admin-create-buyer.dto';

@Injectable()
export class AdminBuilderService {
  constructor(
    @InjectModel(Builder)
    private readonly builderModel: typeof Builder,
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
  async AdminRegisterBuilder({
    body,
    dbTransaction,
    user,
  }: {
    body: AdminCreateBuilderDto;
    dbTransaction?: Transaction;
    user?: User;
  }) {
    if (!dbTransaction) {
      dbTransaction = await this.sequelize.transaction();
    }
    const checkExistingUser = await this.userModel.findOne({
      where: { email: body.email },
    });
    await this.checkBuilderExistence(body.email);
    if (checkExistingUser)
      throw new BadRequestException('user already exist with this email ');

    try {
      const password = randomUUID().substring(10);
      const newUserData = await this.userService.createUser({
        userData: {
          ...body,
          CreatedById: user.id,
          password,
        },
        createdByAdmin: true,
        dbTransaction,
      });
      let IsVerifiedFromVerifyme = false;
      if (body.RC_Number) {
        IsVerifiedFromVerifyme = await VerifymeCheck(body.RC_Number);
      }
      const buyerData = await this.builderModel.create(
        {
          ...body,
          isBusinessVerified: IsVerifiedFromVerifyme,
          email: newUserData.email,
          createdById: newUserData.id,
          updatedById: newUserData.id,
          tier: !body.isIndividual
            ? IsVerifiedFromVerifyme
              ? BuilderTier.one
              : BuilderTier.two
            : BuilderTier.two,
          createdAt: new Date(),
          lastLogin: new Date(),
        },
        { transaction: dbTransaction },
      );

      newUserData.BuilderId = buyerData.id;
      newUserData.Builder = buyerData;
      newUserData.userType = UserType.BUILDER;
      newUserData.updatedAt = new Date();
      newUserData.UpdatedById = user.id;
      const updateData = await User.update(
        {
          BuilderId: buyerData.id,
          Builder: buyerData,
          userType: UserType.BUILDER,
          updatedAt: new Date(),
          UpdatedById: user.id,
        },
        {
          where: {
            id: newUserData.id,
          },
          transaction: dbTransaction,
          returning: true,
        },
      );

      const [affectedCount, affectedRows] = updateData;
      if (!affectedCount)
        throw new Error(
          'Please try again  we could not update your account userType',
        );
      await dbTransaction.commit();
      return affectedRows[0];
    } catch (error) {
      dbTransaction.rollback();
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Checks if a builder with the given email already exists in the database
   * @param email The email to check for existence
   * @throws BadRequestException if a builder with the email already exists
   */
  async checkBuilderExistence(email: string) {
    const builder = await this.builderModel.findOne({ where: { email } });
    if (builder) {
      throw new BadRequestException('email already in use');
    }
  }

  /**
   * Retrieves a builder with the given ID
   * @param builderId The ID of the builder to retrieve
   * @returns The retrieved builder
   * @throws NotFoundException if builder not found
   */
  async getBuilderById(builderId: string) {
    return await this.userModel.findOne({
      where: { BuilderId: builderId },
      include: [{ all: true }],
    });
  }

  /** Update Builder Profile
   * @param buyerID The ID of the builder to update
   * @param updateBuilderProfileDto DTO containing builder information to update
   * @throws NotFoundException if builder not found
   */
  async adminUpdateProfile(
    builderId: string,
    updateBuilderDto: AdminUpdateBuilderProfileDto,
  ) {
    await this.getBuilderById(builderId);
    const { logo, businessAddress, about } = updateBuilderDto;
    await this.builderModel.update(
      { logo, businessAddress, about },
      { where: { id: builderId } },
    );
  }

  /**
   * Retrieves all builder
   * @returns The retrieved all builder
   */
  async getAllBuilder() {
    return await this.builderModel.findAll({});
  }

  async enableCredit({ builderId }: { builderId: string; admin: User }) {
    try {
      const buyerData = await this.builderModel.findOne({
        where: {
          id: builderId,
        },
      });
      if (!buyerData) throw new BadRequestException('builder data not found');
      if (buyerData.creditStatus == CreditStatus.APPROVED)
        throw new BadRequestException('credit status already approved ');
      buyerData.creditStatus = CreditStatus.APPROVED;
      await buyerData.save();
      return await buyerData.reload();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async disableCredit({ builderId }: { builderId: string; admin: User }) {
    try {
      const buyerData = await this.builderModel.findOne({
        where: {
          id: builderId,
        },
      });
      if (!buyerData) throw new BadRequestException('builder data not found');
      if (buyerData.creditStatus == CreditStatus.DISABLED)
        throw new BadRequestException('credit status already disabled ');
      buyerData.creditStatus = CreditStatus.DISABLED;
      await buyerData.save();
      return await buyerData.reload();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async adminGetAllBuilders() {
    return await this.userModel.findAll({
      where: {
        userType: { [Op.eq]: UserType.BUILDER },
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
          model: Builder,
          attributes: [
            'id',
            'creditStatus',
            'state',
            'country',
            'location',
            'name',
            'email',
            'logo',
            'createdAt',
            'phone',
            'address',
            'lastLogin',
          ],
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
}
