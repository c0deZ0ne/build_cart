import { BadGatewayException, Injectable } from '@nestjs/common';
import { Invitation } from './models/invitation.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { EmailService } from '../email/email.service';
import { User } from '../user/models/user.model';
import {
  BuilderInvitation,
  ICreateInvitationDto,
  PlatformInvitation,
} from './dto/platformInvitation.dto';

@Injectable()
export class InvitationService {
  SponsorModel: any;
  constructor(
    @InjectModel(Invitation)
    private invitationModel: typeof Invitation,
    private emailService: EmailService,
  ) {}

  /**
   * create a new Invitation in the database
   * @param createinvitationDto DTO containing Invitation information
   * @returns invitation Details object
   */

  /**
   * create a new Invitation in the database
   * @param createinvitationDto DTO containing Invitation information
   * @returns invitation Details object
   */

  async createInvitation(createinvitationDto: CreateInvitationDto, user: User) {
    const { buyerEmail, FundManagerId, fundManagerName, buyerName } =
      createinvitationDto;
    const invitation = await this.invitationModel.create({
      buyerEmail,
      fundManagerName,
      buyerName,
      FundManagerId,
      CreatedById: user.id,
    });
    const data = {
      buyerEmail,
      fundManagerName,
      buyerName: buyerName ? buyerName : buyerEmail,
      invitationId: invitation.id,
      FundManagerId: invitation.FundManagerId,
    };
    await this.emailService.inviteNotificationEmail(data);
    return invitation;
  }

  async createProjectInvitation(
    createinvitationDto: CreateInvitationDto,
    user: User,
  ) {
    const { buyerEmail, FundManagerId, fundManagerName, buyerName } =
      createinvitationDto;
    const invitation = await this.invitationModel.create({
      buyerEmail,
      fundManagerName,
      buyerName,
      FundManagerId,
      CreatedById: user.id,
    });
    const data = {
      buyerEmail,
      fundManagerName,
      buyerName: buyerName ? buyerName : buyerEmail,
      invitationId: invitation.id,
      FundManagerId: invitation.FundManagerId,
    };
    await this.emailService.inviteNotificationEmail(data);
    return invitation;
  }

  async createInvitationForVendor(
    createVendorData: ICreateInvitationDto,
    user: User,
  ) {
    const { email } = user.Builder;
    const { toEmail, message, toName } = createVendorData;
    const invitation = await this.invitationModel.create({
      buyerEmail: email,
      buyerName: user.name,
      CreatedById: user.id,
    });
    const data = {
      toEmail,
      inviteeName: user.name,
      invitationId: invitation.id,
      message,
      toName,
    };
    await this.emailService.platformInvitationsEmailToVendor(data);
    return invitation;
  }

  async createInvitationForBuilder(
    createBuilderData: BuilderInvitation,
    user: User,
  ) {
    const { name } = user;
    const { FundManagerId } = user;
    const { toEmail, message, toName, projectId, phoneNumber } =
      createBuilderData;
    const [invitation, created] = await this.invitationModel.findOrCreate({
      where: {
        fundManagerName: name,
        FundManagerId,
        projectId,
        buyerName: user.name,
      },
      defaults: {
        CreatedById: user.id,
      },
    });
    const data = {
      toEmail,
      inviteeName: user.name,
      invitationId: invitation.id,
      message,
      toName,
      projectId,
      phoneNumber,
    };
    await this.emailService.platformInvitationsEmailToBuilder(data);
    return invitation;
  }

  /**
   *
   * @param id invitation id
   * @returns invitation Details object
   */

  getInvitationById(id: string): Promise<Invitation> {
    return this.invitationModel.findOne({
      where: { id: id },
      include: [{ all: true }],
    });
  }

  /**
   *
   * @param FundManagerId invitation fundManagerId
   * @returns Array of Invitations Details object
   */

  getInvitationByFundManagerId(FundManagerId: string): Promise<Invitation[]> {
    return this.invitationModel.findAll({
      where: { FundManagerId: FundManagerId },
    });
  }

  /**
   *
   * @param buyerEmail invitation buyerEmail
   * @returns Array of Invitations Details object
   */
  getInvitationByBuilderEmail(buyerEmail: string): Promise<Invitation[]> {
    return this.invitationModel.findAll({
      where: { buyerEmail: buyerEmail },
    });
  }

  getAllInvitations(): Promise<Invitation[]> {
    return this.invitationModel.findAll();
  }
}
