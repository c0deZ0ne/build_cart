import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { Contract } from '../contract/models';
import {
  BuilderInvitation,
  FundmanagerPlatformInvitation,
  ISendPlatformInvitation,
  PlatformInvitation,
} from '../invitation/dto/platformInvitation.dto';
import {
  ProductDto,
  ServiceDto,
  UserDetailsDto,
} from '../retail/dto/create-retail-transaction.dto';
import { CreateRetailUserDto } from '../retail/dto/create-retail-user.dto';
import { RfqBargain, RfqQuote } from '../rfq/models';
import { User } from '../user/models/user.model';
import { ContractAcceptedByVendorDto } from './dto/ContractAcceptedByVendor.dto';
import { ApproveDto } from './dto/adminPaymentApproveRequest.dto';
import { ConfirmationOfMaterialDto } from './dto/confirmationOfMaterial.dto';
import { ContactAndSupportDto } from './dto/contactAndSupport.dto';
import { DeliveryConfirmationDto } from './dto/deliveryConfirmation.dto';
import { InvitationNotificationDto } from './dto/email.invitation.dto';
import { LoginConfirmationDto } from './dto/loginConfirmation.dto';
import { MaterialsDispatchedDto } from './dto/materialsDispatched.dto';
import { NewBidResponseDto } from './dto/newBidResponse.dto';
import { NewContractNotificationDto } from './dto/newContractNotification.dto';
import {
  OTPVerificationDto,
  SendGeneratedPasswordDto,
} from './dto/otpVerification.dto';
import { FailedVerificationDto } from './dto/payment-verification-failed.dto';
import { PaymentReceivedDto } from './dto/paymentReceived.dto';
import { TenderBid } from '../project/models/project-tender-bids.model';
import { seaMailerClient } from 'seamailer-nodejs';
import Handlebars from 'handlebars';
import * as path from 'node:path';
import * as fs from 'fs'
import { UserTransaction } from '../user-wallet-transaction/models/user-transaction.model';

const templateDir = path.join(__dirname, 'templates');

const DEFAULTMESSAGE = 'We are glad to have you';
const FROM_OPTIONS = { email: 'tech@cutstruct.com', name: 'Team Cutstruct' };

@Injectable()
export class EmailService {
  constructor(private configService: ConfigService) {}

  private readEmailTemplateFile(templateFileName: string) {
    if (!templateFileName)
      throw new BadRequestException('Email template file must not be null');
    const templatePath = path.join(templateDir, templateFileName);
    const templateSource = fs.readFileSync(templatePath, 'utf8');
    return Handlebars.compile(templateSource);
  }

  private compileTemplateToHtml(
    templateName: string,
    context: Record<string, unknown>,
  ): string {
    const template = this.readEmailTemplateFile(templateName);
    return template(context);
  }

  async sendVerifyEmail(data: OTPVerificationDto) {
    const { email, name, otp } = data;
    const context = {
      appName: this.configService.get('APP_NAME'),
      header: 'OTP Verification Code',
      name: name || 'Customer',
      otp,
    };
    const htmlString = this.compileTemplateToHtml(
      'otp_verification_email.hbs',
      context,
    );
    try {
      await seaMailerClient.sendMail({
        htmlPart: htmlString,
        subject: 'OTP Verification Code',
        from: {
          email: 'tech@cutstruct.com',
          name: 'Team Cutstruct',
        },
        to: [
          {
            email,
            name: name,
          },
        ],
        variables: {
          name,
        },
      });
    } catch (error) {
    }
  }

  async sendGeneratedPasswordEmail(data: SendGeneratedPasswordDto) {
    const { email, name, password } = data;
    const context = {
      appName: this.configService.get('APP_NAME'),
      header: 'Send Generated Password',
      name: name || 'Customer',
      password,
    };

    try {
      await seaMailerClient.sendMail({
        htmlPart: this.compileTemplateToHtml(
          'send_generated_email.hbs',
          context,
        ),
        subject: 'Send Generated Password',
        from: FROM_OPTIONS,
        to: [
          {
            email,
            name: name,
          },
        ],
        variables: {
          name,
        },
      });
    } catch (error) {
      console.error(error.message);
    }
  }

  async resendOTPMail(data: OTPVerificationDto) {
    const { email, name, otp } = data;
    const context = {
      appName: this.configService.get('APP_NAME'),
      header: 'Resend OTP: Complete your Secure Login',
      name: name || 'Customer',
      otp,
    };

    return await seaMailerClient.sendMail({
      htmlPart: this.compileTemplateToHtml(
        'resend_otp_verification_email.hbs',
        context,
      ),
      subject: 'Resend OTP: Complete your Secure Login',
      from: FROM_OPTIONS,
      to: [
        {
          email,
          name: name,
        },
      ],
      variables: {
        name,
      },
    });
  }

  async send2FAMail(data: OTPVerificationDto) {
    const { email, name, otp } = data;
    const context = {
      appName: this.configService.get('APP_NAME'),
      header: '2FA Setup: Complete your 2fa setup',
      name: name || 'Customer',
      otp,
    };

    return await seaMailerClient.sendMail({
      htmlPart: this.compileTemplateToHtml('send_2fa_otp_email.hbs', context),
      subject: '2FA Setup: Complete your 2fa setup',
      from: FROM_OPTIONS,
      to: [
        {
          email,
          name: name,
        },
      ],
      variables: {
        name,
      },
    });
  }

  async resetPassword(email: string, token: number, name: string) {
    const context = {
      appName: this.configService.get('APP_NAME'),
      link: `${this.configService.get(
        'AUTH_URL',
      )}/verify-password-reset?email=${email}&change_password=true`,
      name: name || 'Customer',
      token,
    };

    return await seaMailerClient.sendMail({
      htmlPart: this.compileTemplateToHtml('reset_password.hbs', context),
      subject: 'Reset your password',
      from: FROM_OPTIONS,
      to: [
        {
          email,
          name: name,
        },
      ],
      variables: {
        name,
      },
    });
  }

  async sendSponsorEmail(email: string, password: string) {
    const context = {
      appName: this.configService.get('APP_NAME'),
      link: this.configService.get('AUTH_URL'),
      email,
      header: 'Account Details',
      logo: this.configService.get('MAIL_LOGO_LIGHT'),
      password,
      description: `Your CutStruct fundManager account has been created. Please login with the following credentials below at ${this.configService.get(
        'AUTH_URL',
      )}`,
    };
    return await seaMailerClient.sendMail({
      htmlPart: this.compileTemplateToHtml('fundManager_email.hbs', context),
      subject: 'CutStruct FundManager Account Created',
      from: FROM_OPTIONS,
      to: [
        {
          email,
        },
      ],
    });
  }

  async sendAccountCreated({
    name,
    email,
    password,
    userType,
  }: {
    name?: string;
    email: string;
    password: string;
    userType: string;
  }) {
    try {
      const context = {
        appName: this.configService.get('APP_NAME'),
        name: name ? name : 'there',
        email,
        header: 'Account Details',
        logo: this.configService.get('MAIL_LOGO_LIGHT'),
        link: this.configService.get('AUTH_URL'),
        password,
        userType,
        description: `Your CutStruct ${userType} account has been created. Please login with the following credentials below at ${this.configService.get(
          'AUTH_URL',
        )}`,
      };

      await seaMailerClient.sendMail({
        htmlPart: this.compileTemplateToHtml(
          'create_account_email.hbs',
          context,
        ),
        subject: `CutStruct ${userType} Account Created`,
        from: FROM_OPTIONS,
        to: [
          {
            email,
            name: name,
          },
        ],
        variables: {
          name,
        },
      });
    } catch (error) {}
  }
  async inviteNotificationEmail(data: InvitationNotificationDto) {
    const context = {
      appName: this.configService.get('APP_NAME'),
      inviteeName: data.fundManagerName,
      buyerName: data.buyerName,
      loginLink: `${this.configService.get('AUTH_URL')}/?invitationId=${
        data.invitationId
      }`,
      signupLink: `${this.configService.get(
        'AUTH_URL',
      )}/auth/signup?invitationId=${data.invitationId}`,
      header: 'Invitation',
      logo: this.configService.get('MAIL_LOGO_LIGHT'),
      description:  `Hello ${data.buyerName}, You’ve been invited by ${data.fundManagerName},
      to lead the construction of their new project on the Cutstruct platform.
      Kindly click on the link below to sign up on Cutstruct to access the project details and funding.`,
    };
    return await seaMailerClient.sendMail({
      subject: 'CutStruct Platform',
      htmlPart: this.compileTemplateToHtml(
        'platform_invitation_email.hbs',
        context,
      ),
      from: FROM_OPTIONS,
      to: [
        {
          email: data.buyerEmail,
        },
      ],
    });
  }

  async platformInvitationsEmail(data: PlatformInvitation) {
    const msg = data.message || DEFAULTMESSAGE;
    const context = {
      appName: this.configService.get('APP_NAME'),
      inviteeName: data.inviteeName,
      buyerName: data.toName,
      loginLink: `${this.configService.get(
        'AUTH_URL',
      )}?invitationId=${randomUUID()}`,
      signupLink: `${this.configService.get(
        'AUTH_URL',
      )}/auth/signup?invitationId=${randomUUID()}`,
      header: 'Invitation',
      logo: this.configService.get('MAIL_LOGO_LIGHT'),
      description: `Congratulations! ${data.toName}, you have an invitation from ${data.inviteeName}, please signup to CutStruct Platform using the link below`,
      message: `${msg},`,
    };

    return await seaMailerClient.sendMail({
      subject: 'CutStruct Platform',
      htmlPart: this.compileTemplateToHtml(
        'platform_invitation_email.hbs',
        context,
      ),
      from: FROM_OPTIONS,
      to: [
        {
          email: data.toEmail,
        },
      ],
    });
  }
  async projectInviteExistUser(data: PlatformInvitation) {
    const msg = data.message || DEFAULTMESSAGE;
    const context = {
      appName: this.configService.get('APP_NAME'),
      inviteeName: data.inviteeName,
      buyerName: data.toName,
      loginLink: `${this.configService.get('AUTH_URL')}?invitationId=${
        data.invitationId || randomUUID()
      }`,
      signupLink: `${this.configService.get(
        'AUTH_URL',
      )}?invitationId=${data.invitationId}&&projectId=${data.projectId}`,
      header: 'Invitation',
      logo: this.configService.get('MAIL_LOGO_LIGHT'),
      description: `Congratulations! ${data.toName}, you have a project invitation from ${data.inviteeName}, please login to CutStruct Platform using the link below or create account if you don't already have one`,
      message: `${msg},`,
    };

    return await seaMailerClient.sendMail({
      subject: 'CutStruct Platform',
      htmlPart: this.compileTemplateToHtml(
        'platform_invitation_email.hbs',
        context,
      ),
      from: FROM_OPTIONS,
      to: [
        {
          email: data.toEmail,
        },
      ],
    });
  }

  async fundManagerPlatformInvitationsEmail(
    data: FundmanagerPlatformInvitation,
  ) {
    const { toEmail, toName } = data;
    const msg = data.message || DEFAULTMESSAGE;
    const context = {
      appName: this.configService.get('APP_NAME'),
      inviteeName: data.inviteeName,
      buyerName: data.toName,
      loginLink: `${this.configService.get('AUTH_URL')}?invitationId=${
        data.invitationId
      }&projectId=${data.projectId}`,
      signupLink: `${this.configService.get(
        'AUTH_URL',
      )}/auth/signup?invitationId=${data.invitationId}&projectId=${
        data.projectId
      }`,
      header: 'Invitation',
      logo: this.configService.get('MAIL_LOGO_LIGHT'),
      description: `Congratulations! ${data.toName}, you have an invitation from ${data.inviteeName}. For further information, contact ${data.phoneNumber}. Please signup to CutStruct Platform using the link below`,
      message: `${msg},`,
    };

    return await seaMailerClient.sendMail({
      htmlPart: this.compileTemplateToHtml(
        'platform_invitation_email.hbs',
        context,
      ),
      subject: 'CutStruct Platform',
      from: FROM_OPTIONS,
      to: [
        {
          email: toEmail,
          name: toName,
        },
      ],
      variables: {
        toName,
      },
    });
  }

  async platformInvitationsEmailToBuilder(data: BuilderInvitation) {
    const { toEmail, toName } = data;

    const msg = data.message || DEFAULTMESSAGE;

    const context = {
      appName: this.configService.get('APP_NAME'),
      inviteeName: data.inviteeName,
      buyerName: data.toName,
      loginLink: `${this.configService.get('AUTH_URL')}?invitationId=${
        data.invitationId
      }&projectId=${data.projectId}`,
      signupLink: `${this.configService.get(
        'AUTH_URL',
      )}/auth/signup?invitationId=${data.invitationId}&projectId=${
        data.projectId
      }`,
      header: 'Invitation',
      logo: this.configService.get('MAIL_LOGO_LIGHT'),
      description: `Congratulations! ${data.toName}, you have an invitation from ${data.inviteeName}. For further information, contact ${data.phoneNumber}. Please signup to CutStruct Platform using the link below`,
      message: `${msg},`,
    };

    return await seaMailerClient.sendMail({
      htmlPart: this.compileTemplateToHtml(
        'platform_invitation_email.hbs',
        context,
      ),
      subject: 'CutStruct Platform',
      from: FROM_OPTIONS,
      to: [
        {
          email: toEmail,
          name: toName,
        },
      ],
      variables: {
        toName,
      },
    });
  }

  async platformInvitationsEmailToVendor(data: ISendPlatformInvitation) {
    const { toEmail, toName } = data;

    const msg = data.message || DEFAULTMESSAGE;

    const context = {
      appName: this.configService.get('APP_NAME'),
      inviteeName: data.inviteeName,
      BuilderName: data.toName,
      loginLink: `${this.configService.get('AUTH_URL')}?invitationId=${
        data.invitationId
      }`,
      signupLink: `${this.configService.get(
        'AUTH_URL',
      )}/auth/signup?invitationId=${data.invitationId}`,
      header: 'Invitation',
      logo: this.configService.get('MAIL_LOGO_LIGHT'),
      description: `Congratulations! ${data.toName}, you have an invitation from ${data.inviteeName}, please signup to CutStruct Platform using the link below`,
      message: `${msg},`,
    };

    return await seaMailerClient.sendMail({
      htmlPart: this.compileTemplateToHtml(
        'vendor_platform_invitation_email.hbs',
        context,
      ),
      subject: 'CutStruct Platform',
      from: FROM_OPTIONS,
      to: [
        {
          email: toEmail,
          name: toName,
        },
      ],
      variables: {
        toName,
      },
    });
  }

  async adminTransactionApprove(data: ApproveDto) {
    const context = {
      appName: this.configService.get('APP_NAME'),
      VendorName: data.VendorName,
      title: data.title,
      buyerName: data.buyerName,
      approveLink: data.approveLink,
      pay_amount_collected: data.pay_amount_collected,
      header: 'Approve Payment',
      reciept_url: data.reciept_url,
      logo: this.configService.get('MAIL_LOGO_LIGHT'),
    };
    try {
      return await seaMailerClient.sendMail({
        htmlPart: this.compileTemplateToHtml('approvePayment.hbs', context),
        subject: 'Approve Payment Request',
        from: FROM_OPTIONS,
        to: [
          {
            email: this.configService.get('ADMIN_MAIL'),
          },
        ],
      });
    } catch (error) {
      throw 'Could not notify admin please try again';
    }
  }
  async failedVerification(data: FailedVerificationDto) {
    const context = {
      appName: this.configService.get('APP_NAME'),
      VendorName: data.VendorName,
      title: data.title,
      buyerName: data.buyerName,
      approveLink: data.approveLink,
      pay_amount_collected: data.pay_amount_collected,
      header: 'Payment verification failed',
      provider: data.Provider,
      provider_reference: data.provider_reference,
      logo: this.configService.get('MAIL_LOGO_LIGHT'),
    };
    const html = this.compileTemplateToHtml(
      'transactionVerificationFailed.hbs',
      context,
    );
    try {
      return await seaMailerClient.sendMail({
        htmlPart: html,
        subject: 'system error',
        from: FROM_OPTIONS,
        to: [
          {
            email: this.configService.get('ADMIN_MAIL'),
          },
        ],
      });
    } catch (error) {}
  }

  async rfqRaisedNotification(user: User) {
    const context = {
      appName: this.configService.get('APP_NAME'),
      header: 'Request For Qoute',
      logo: this.configService.get('MAIL_LOGO_LIGHT'),
      description: `Congratulation! an RFQ has been raised by ${user.Builder.businessName}`,
    };

    try {
      const to = [];
      const RunningEnv = this.configService.get('NODE_ENV');
      if (RunningEnv === 'production' || RunningEnv == 'prod') {
        to.push({ email: 'RFQs@cutstruct.com' });
        to.push({ email: 'tech@cutstruct.com' });
      } else {
        to.push('stagingadmin@cutstruct.com');
      }
      await seaMailerClient.sendMail({
        htmlPart: this.compileTemplateToHtml(
          'rfq-riasedNotification.hbs',
          context,
        ),
        subject: 'Rfq Raised',
        from: FROM_OPTIONS,
        to: to,
      });
    } catch (error) {}
  }
  async rfqGroupNotification(user: User, data: any) {
    const context = {
      appName: this.configService.get('APP_NAME'),
      header: 'RFQ-Raised',
      logo: this.configService.get('MAIL_LOGO_LIGHT'),
      description: `Congratulation! an RFQ has been raised by ${user.Builder.businessName}`,
      data: data.rfq,
      link: `${this.configService.get('AUTH_URL')}/bid-board`,
    };
    try {
      const to = [];
      const RunningEnv = this.configService.get('NODE_ENV');
      if (RunningEnv === 'production' || RunningEnv == 'prod') {
        to.push({ email: 'RFQs@cutstruct.com' });
        to.push(...data?.user);
      } else {
        to.push({ email: 'stagingadmin@cutstruct.com' });
        to.push(...data?.user);
      }
      await seaMailerClient.sendMail({
        bcc: to,
        htmlPart: this.compileTemplateToHtml('groupRfqEmail.hbs', context),
        subject: 'New purchase request from CutStruct',
        from: FROM_OPTIONS,
        to,
      });
    } catch (error) {}
  }

  async sendContractDispatchedEmail(_data: Contract) {
    try {
      const context = {
        appName: this.configService.get('APP_NAME'),
        buyerName: _data.Builder.businessName,
        header: 'Contract Dispatched',
        logo: this.configService.get('MAIL_LOGO_LIGHT'),
        description: `Congratulations! ${
          _data.Builder.businessName || ''
        }, your contract has been dispatched, please see details by clicking the link below`,
        link: `${this.configService.get('AUTH_URL')}/contracts/${_data.id}`,
      };

      await seaMailerClient.sendMail({
        from: FROM_OPTIONS,
        htmlPart: this.compileTemplateToHtml('bid_actions.hbs', context),
        subject: 'CutStruct Platform',
        to: [
          {
            email: _data.Builder.email,
          },
          {
            email: _data.Vendor.email,
          },
        ],
      });
    } catch (error) {}
  }

  async sendOrderRejectNoticeEmailToVendor(_data: Contract) {
    try {
      const context = {
        appName: this.configService.get('APP_NAME'),
        buyerName: _data.Builder.businessName,
        header: 'Order Rejected',
        logo: this.configService.get('MAIL_LOGO_LIGHT'),
        description: ` ${
          _data.Builder.businessName || _data.Builder.owner.name || ''
        }, has unresolved complaints on the delivered item and has rejected your order, please see details by clicking the link below`,
        link: `${this.configService.get('AUTH_URL')}/contracts/${_data.id}`,
      };
      await seaMailerClient.sendMail({
        subject: 'CutStruct Platform',
        from: FROM_OPTIONS,
        htmlPart: this.compileTemplateToHtml('bid_actions.hbs', context),
        to: [
          {
            email: _data.Vendor.email,
          },
        ],
      });
    } catch (error) {}
  }

  async sendBuilderBargainNoticeEmailToVendor(data: RfqBargain) {
    try {
      const context = {
        appName: this.configService.get('APP_NAME'),
        buyerName: data.RfqQuote.RfqRequest.Builder.businessName,
        header: 'A Bargain Has Been Raised On Your Submitted Bid',
        logo: this.configService.get('MAIL_LOGO_LIGHT'),
        description: ` ${
          data.RfqQuote.RfqRequest.Builder.businessName ||
          data.RfqQuote.RfqRequest.Builder.owner.name ||
          ''
        }, has raised a bargain on Your submitted bid, please see details by clicking the link below`,
        link: `${this.configService.get('AUTH_URL')}/vendor/bid-board`,
      };

      await seaMailerClient.sendMail({
        subject: 'CutStruct Platform',
        htmlPart: this.compileTemplateToHtml('bid_actions.hbs', context),
        from: FROM_OPTIONS,
        to: [
          {
            email: data.RfqQuote.Vendor.email,
          },
        ],
      });
    } catch (error) {}
  }

  async sendVendorBidNoticeEmailToBuilder(data: RfqBargain) {
    try {
      const context = {
        appName: this.configService.get('APP_NAME'),
        VendorName: data.RfqQuote.Vendor.businessName,
        header: 'A Bid Has Been Submitted On Your Request For Quote',
        logo: this.configService.get('MAIL_LOGO_LIGHT'),
        description: ` ${
          data.RfqQuote.Vendor.businessName ||
          data.RfqQuote.Vendor.owner.name ||
          ''
        }, has raised submitted a bid on your Request For Quote, please see details by clicking the link below`,
        link: `${this.configService.get('AUTH_URL')}/builder/company-project`,
      };
      await seaMailerClient.sendMail({
        subject: 'CutStruct Platform',
        htmlPart: this.compileTemplateToHtml('bid_actions.hbs', context),
        from: FROM_OPTIONS,
        to: [
          {
            email: data.RfqQuote.RfqRequest.Builder.email,
          },
        ],
      });
    } catch (error) {}
  }

  async sendContractPaid(_data: Contract) {
    try {
      const context = {
        appName: this.configService.get('APP_NAME'),
        header: 'Contract Paid',
        logo: this.configService.get('MAIL_LOGO_LIGHT'),
        description: `Congratulations! ${
          _data?.Vendor?.businessName
            ? _data?.Vendor?.businessName
            : _data?.Vendor?.businessName
            ? _data?.Vendor?.businessName
            : ''
        }, Payment made please proceed to dispatch the item(s)!`,
        link: `${this.configService.get('AUTH_URL')}/contracts/${_data.id}`,
      };
      await seaMailerClient.sendMail({
        subject: 'CutStruct Platform',
        htmlPart: this.compileTemplateToHtml('bid_actions.hbs', context),
        from: FROM_OPTIONS,
        to: [
          {
            email: _data?.Vendor?.email,
          },
        ],
      });
    } catch (error) {}
  }
  async AdminNotifyContractPaid(_data: Contract) {
    const context = {
      appName: this.configService.get('APP_NAME'),
      header: 'Contract Paid',
      logo: this.configService.get('MAIL_LOGO_LIGHT'),
      description: `₦${_data.totalCost} was paid to ${
        _data?.Vendor?.businessName
          ? _data?.Vendor?.businessName
          : _data?.Vendor?.businessName
          ? _data?.Vendor?.businessName
          : ''
      }, buy ${
        _data.Builder.businessName || _data.Builder.email
      } see contract details here!`,
      link: `${this.configService.get('AUTH_URL')}/contracts/${_data.id}`,
    };

    try {
      await seaMailerClient.sendMail({
        subject: 'Platform Payment Notification',
        htmlPart: this.compileTemplateToHtml('bid_actions.hbs', context),
        from: FROM_OPTIONS,
        to: [
          {
            email: this.configService.get('ADMIN_MAIL'),
          },
        ],
      });
    } catch (error) {}
  }

  async bidAccepted(_data: RfqQuote) {
    const context = {
      appName: this.configService.get('APP_NAME'),
      header: 'Bid Accepted',
      logo: this.configService.get('MAIL_LOGO_LIGHT'),
      description: `Congratulations! ${
        _data?.Vendor?.businessName
          ? _data?.Vendor?.businessName
          : _data?.Vendor?.businessName
          ? _data?.Vendor?.businessName
          : _data?.CreatedBy?.name
      }, Your Bid got Accepted `,
      link: `${this.configService.get('AUTH_URL')}/bid-board/details/${
        _data.id
      }`,
    };
    try {
      await seaMailerClient.sendMail({
        subject: 'CutStruct Platform',
        htmlPart: this.compileTemplateToHtml('bid_actions.hbs', context),
        from: FROM_OPTIONS,
        to: [
          {
            email: _data?.Vendor?.email
              ? _data.Vendor?.email
              : _data.CreatedBy.email,
          },
        ],
      });
    } catch (error) {}
  }

  async TenderbidAccepted(_data: TenderBid) {
    try {
      const context = {
        appName: this.configService.get('APP_NAME'),
        header: 'Bid Accepted',
        logo: this.configService.get('MAIL_LOGO_LIGHT'),
        description: `Congratulations! ${
          _data?.Owner?.businessName
            ? _data?.Owner?.businessName
            : _data?.Owner?.businessName
            ? _data?.Owner?.businessName
            : _data?.CreatedBy?.name
        }, Your Bid has been Accepted `,
        link: `${this.configService.get('AUTH_URL')}/bid-board/details/${
          _data.id
        }`,
      };
      await seaMailerClient.sendMail({
        subject: 'CutStruct Platform',
        htmlPart: this.compileTemplateToHtml('bid_actions.hbs', context),
        from: FROM_OPTIONS,
        to: [
          {
            email: _data?.Owner?.email
              ? _data.Owner?.email
              : _data.CreatedBy.email,
          },
        ],
      });
    } catch (error) {}
  }

  async acceptBargain(_data: RfqQuote) {
    try {
      const context = {
        appName: this.configService.get('APP_NAME'),
        header: 'Bargain  Accepted',
        logo: this.configService.get('MAIL_LOGO_LIGHT'),
        description: `Congratulations! ${
          _data?.Vendor?.businessName
            ? _data?.Vendor?.businessName
            : _data?.Vendor?.businessName
            ? _data?.Vendor?.businessName
            : _data?.CreatedBy?.name
        }, Your bargain got accepted please proceed to pay for item(s)`,
        link: `${this.configService.get('AUTH_URL')}/bid-board/details/${
          _data.id
        }`,
      };
      await seaMailerClient.sendMail({
        subject: 'CutStruct Platform',
        htmlPart: this.compileTemplateToHtml('bid_actions.hbs', context),
        from: FROM_OPTIONS,
        to: [
          {
            email: _data?.Vendor?.email
              ? _data.Vendor?.email
              : _data.CreatedBy.email,
          },
        ],
      });
    } catch (error) {}
  }

  async sendContractAccepted(_data: Contract) {
    const context = {
      appName: this.configService.get('APP_NAME'),
      header: 'Contract Accepted',
      logo: this.configService.get('MAIL_LOGO_LIGHT'),
      description: `Congratulations! ${
        _data.Builder.businessName || ''
      }, your contract has been accepted please proceed to payment of the contract`,
      link: `${this.configService.get('AUTH_URL')}/contracts/${_data.id}`,
    };
    try {
      await seaMailerClient.sendMail({
        subject: 'CutStruct Platform',
        htmlPart: this.compileTemplateToHtml('bid_actions.hbs', context),
        from: FROM_OPTIONS,
        to: [
          {
            email: _data?.Builder?.email,
          },
        ],
      });
    } catch (error) {}
  }

  async confirmAndcompleteContract(_data: Contract) {
    const context = {
      appName: this.configService.get('APP_NAME'),
      header: 'Delivery Confirmed',
      logo: this.configService.get('MAIL_LOGO_LIGHT'),
      description: `Congratulations! ${
        _data?.Vendor?.businessName
          ? _data?.Vendor?.businessName
          : _data?.Vendor?.businessName
          ? _data?.Vendor?.businessName
          : ''
      } contract delivery confirmed and completed`,
      link: `${this.configService.get('AUTH_URL')}/bid-board/details/${
        _data.id
      }`,
    };
    try {
      await seaMailerClient.sendMail({
        subject: 'CutStruct Platform',
        htmlPart: this.compileTemplateToHtml('bid_actions.hbs', context),
        from: FROM_OPTIONS,
        to: [
          {
            email: _data?.Vendor?.email,
          },
        ],
      });
    } catch (error) {}
  }

  async sendEnquiryEmail(data: CreateRetailUserDto) {
    const context = {
      appName: this.configService.get('APP_NAME'),
      header: 'Retail Enquiry',
      link: this.configService.get('AUTH_URL'),
      logo: this.configService.get('MAIL_LOGO_LIGHT'),
      name: data.name,
      email: data.email,
      phone: data.phone,
      enquiry: data.enquiry || 'None',
      description: `You have received a request to talk more from the Custstruct Market on www.cutstruct.com/market. The details of this request is as follows: `,
    };

    const html = this.compileTemplateToHtml('retail_enquiry.hbs', context);
    try {
      const to = [];
      const RunningEnv = this.configService.get('NODE_ENV');
      if (RunningEnv === 'production' || RunningEnv == 'prod') {
        to.push({ email: 'RFQs@cutstruct.com' });
      } else {
        to.push({ email: 'stagingadmin@cutstruct.com' });
      }
      await seaMailerClient.sendMail({
        to,
        subject: 'Retail Enquiry Received',
        htmlPart: html,
        from: FROM_OPTIONS,
      });
    } catch (error) {}
  }

  async loginNotification(data: LoginConfirmationDto) {
    const context = {
      appName: this.configService.get('APP_NAME'),
      header: 'Login Notification',
      name: data.name || 'Customer',
      time: new Date().toLocaleString(),
    };
    const html = this.compileTemplateToHtml('login_notification.hbs', context);
    try {
      await seaMailerClient.sendMail({
        subject: 'Login Notification',
        htmlPart: html,
        from: FROM_OPTIONS,
        to: [
          {
            email: data.email,
          },
        ],
      });
    } catch (error) {
      console.error('Login email notification failed:', error);
    }
  }

  async sendConfirmationOfMaterialMail(data: ConfirmationOfMaterialDto) {
    const { buyerName, vendorName, receiverEmail } = data;
    const context = {
      appName: this.configService.get('APP_NAME'),
      header: 'Confirmation Of Materials Delivery',
      name,
      buyerName,
      vendorName,
    };

    await seaMailerClient.sendMail({
      subject: 'Confirmation Of Materials Delivery',
      htmlPart: this.compileTemplateToHtml(
        'confirm_material_delivery_email.hbs',
        context,
      ),
      from: FROM_OPTIONS,
      to: [
        {
          email: receiverEmail,
        },
      ],
    });
  }

  async sendContactAndSupportEmail(data: ContactAndSupportDto) {
    const {
      receiverEmail,
      generalEnquiriesEmail,
      supportEmail,
      supportPhoneNumber,
      liveChatLink,
      helpCenterLink,
    } = data;
    const context = {
      appName: this.configService.get('APP_NAME'),
      header: 'Contact and Support information for Cutstruct',
      generalEnquiriesEmail,
      supportEmail,
      supportPhoneNumber,
      liveChatLink,
      helpCenterLink,
    };

    await seaMailerClient.sendMail({
      subject: 'Contact and Support information for Cutstruct',
      htmlPart: this.compileTemplateToHtml(
        'contact_and_support_email.hbs',
        context,
      ),
      from: FROM_OPTIONS,
      to: [
        {
          email: receiverEmail,
        },
      ],
    });
  }

  async sendContractAcceptedByVendorEmail(data: ContractAcceptedByVendorDto) {
    const {
      vendorName,
      buyerName,
      buyerEmail,
      constructionMaterial,
      contractTerms,
      contractValue,
    } = data;
    const context = {
      appName: this.configService.get('APP_NAME'),
      header: 'Contract Accepted By Vendor',
      loginLink: this.configService.get('AUTH_URL'),
      vendorName,
      buyerName,
      constructionMaterial,
      contractTerms,
      contractValue,
    };

    await seaMailerClient.sendMail({
      subject: 'Contract Accepted By Vendor',
      htmlPart: this.compileTemplateToHtml(
        'contract_accepted_by_vendor_email.hbs',
        context,
      ),
      from: FROM_OPTIONS,
      to: [
        {
          email: buyerEmail,
        },
      ],
    });
  }

  async sendDeliveryConfirmationEmailToBuilder(data: DeliveryConfirmationDto) {
    const {
      buyerName,
      buyerEmail,
      vendorName,
      orderNumber,
      deliveryDate,
      constructionMaterial,
    } = data;
    const context = {
      appName: this.configService.get('APP_NAME'),
      header: 'Delivery Confirmation',
      logo: this.configService.get('MAIL_LOGO_LIGHT'),
      loginLink: this.configService.get('AUTH_URL'),
      vendorName,
      buyerName,
      constructionMaterial,
      orderNumber,
      deliveryDate,
    };

    await seaMailerClient.sendMail({
      subject: 'Delivery Confirmation',
      htmlPart: this.compileTemplateToHtml(
        'delivery_confirmation.hbs',
        context,
      ),
      from: FROM_OPTIONS,
      to: [
        {
          email: buyerEmail,
        },
      ],
    });
  }

  async sendDeliveryConfirmationEmailToVendor(
    data: DeliveryConfirmationDto,
    email: string,
  ) {
    const {
      buyerName,
      vendorName,
      orderNumber,
      deliveryDate,
      constructionMaterial,
    } = data;
    const context = {
      appName: this.configService.get('APP_NAME'),
      header: 'Delivery Confirmation',
      logo: this.configService.get('MAIL_LOGO_LIGHT'),
      loginLink: this.configService.get('AUTH_URL'),
      buyerName,
      vendorName,
      constructionMaterial,
      orderNumber,
      deliveryDate,
    };

    await seaMailerClient.sendMail({
      subject: 'Delivery Confirmation',
      htmlPart: this.compileTemplateToHtml(
        'delivery_confirmation_vendor.hbs',
        context,
      ),
      from: FROM_OPTIONS,
      to: [
        {
          email: email,
        },
      ],
    });
  }

  async sendFAQEmail(data: LoginConfirmationDto) {
    const { email, name } = data;
    const context = {
      appName: this.configService.get('APP_NAME'),
      header: 'FAQ',
      name,
    };
    await seaMailerClient.sendMail({
      subject: 'FAQ',
      htmlPart: this.compileTemplateToHtml('FAQ.hbs', context),
      from: FROM_OPTIONS,
      to: [
        {
          email,
        },
      ],
    });
  }

  async sendMaterialsDispatchedEmail(data: MaterialsDispatchedDto) {
    const {
      buyerName,
      buyerEmail,
      vendorName,
      constructionMaterial,
      dispatchDate,
      arrivalDate,
    } = data;

    const context = {
      appName: this.configService.get('APP_NAME'),
      header: 'Materials Dispatched',
      vendorName,
      buyerName,
      constructionMaterial,
      dispatchDate,
      arrivalDate,
    };
    await seaMailerClient.sendMail({
      subject: 'Materials Dispatched',
      htmlPart: this.compileTemplateToHtml(
        'materials_dispatched_mail.hbs',
        context,
      ),
      from: FROM_OPTIONS,
      to: [
        {
          email: buyerEmail,
        },
      ],
    });
  }

  async sendNewBidResponseEmail(data: NewBidResponseDto) {
    const {
      buyerName,
      buyerEmail,
      vendorName,
      constructionMaterial,
      quotedPrice,
      deliveryTimeFrame,
    } = data;
    const context = {
      appName: this.configService.get('APP_NAME'),
      header: 'New Bid Response',
      vendorName,
      buyerName,
      constructionMaterial,
      quotedPrice,
      deliveryTimeFrame,
    };
    await seaMailerClient.sendMail({
      subject: 'New Bid Response',
      htmlPart: this.compileTemplateToHtml('new_bid_response.hbs', context),
      from: FROM_OPTIONS,
      to: [
        {
          email: buyerEmail,
        },
      ],
    });
  }

  async sendNewContractNotificationEmail(data: NewContractNotificationDto) {
    const {
      vendorEmail,
      vendorName,
      buyerName,
      constructionMaterial,
      contractTerms,
      contractValue,
    } = data;
    const context = {
      appName: this.configService.get('APP_NAME'),
      header: 'New Contract Notification',
      loginLink: this.configService.get('AUTH_URL'),
      vendorName,
      buyerName,
      constructionMaterial,
      contractTerms,
      contractValue,
    };
    await seaMailerClient.sendMail({
      subject: 'New Contract Notification',
      htmlPart: this.compileTemplateToHtml(
        'new_contract_notification.hbs',
        context,
      ),
      from: FROM_OPTIONS,
      to: [
        {
          email: vendorEmail,
        },
      ],
    });
  }

  async sendNewContractSentByBuilderEmail(data: NewContractNotificationDto) {
    const {
      vendorEmail,
      vendorName,
      buyerName,
      constructionMaterial,
      contractTerms,
    } = data;
    const context = {
      appName: this.configService.get('APP_NAME'),
      header: 'New Contract Sent By Builder',
      vendorName,
      buyerName,
      constructionMaterial,
      contractTerms,
    };
    await seaMailerClient.sendMail({
      subject: 'New Contract Sent By Builder',
      htmlPart: this.compileTemplateToHtml(
        'new_contract_sent_by_buyer.hbs',
        context,
      ),
      from: FROM_OPTIONS,
      to: [
        {
          email: vendorEmail,
        },
      ],
    });
  }

  async sendPaymentReceivedEmail(data: PaymentReceivedDto) {
    const {
      vendorEmail,
      vendorName,
      buyerName,
      constructionMaterial,
      contractValue,
      amountPaid,
    } = data;
    const context = {
      appName: this.configService.get('APP_NAME'),
      header: 'Payment Received',
      vendorName,
      buyerName,
      constructionMaterial,
      contractValue,
      amountPaid,
    };
    await seaMailerClient.sendMail({
      subject: 'Payment Received',
      htmlPart: this.compileTemplateToHtml('payment_received.hbs', context),
      from: FROM_OPTIONS,
      to: [
        {
          email: vendorEmail,
        },
      ],
    });
  }

  async sendPaymentSettledEmail(data: PaymentReceivedDto) {
    const {
      vendorEmail,
      vendorName,
      buyerName,
      constructionMaterial,
      contractTerms,
      amountPaid,
      paymentDate,
    } = data;

    const context = {
      appName: this.configService.get('APP_NAME'),
      header: 'Payment Settled',
      vendorName,
      buyerName,
      constructionMaterial,
      contractTerms,
      amountPaid,
      paymentDate,
    };
    await seaMailerClient.sendMail({
      subject: 'Payment Settled',
      htmlPart: this.compileTemplateToHtml('payment_settled.hbs', context),
      from: FROM_OPTIONS,
      to: [
        {
          email: vendorEmail,
        },
      ],
    });
  }

  async sendWelcomeEmail(data: LoginConfirmationDto) {
    const { email, name } = data;
    try {
      const context = {
        appName: this.configService.get('APP_NAME'),
        header: 'Welcome to Cutstruct',
        name,
      };
      await seaMailerClient.sendMail({
        subject: 'Welcome to Cutstruct',
        htmlPart: this.compileTemplateToHtml('welcome_email.hbs', context),
        from: FROM_OPTIONS,
        to: [
          {
            email,
          },
        ],
      });
    } catch (error) {
      return;
    }
  }

  async sendUserRetailTransactionEmail(
    user: UserDetailsDto,
    products: ProductDto[],
    services: ServiceDto[],
  ) {
    try {
      const context = {
        appName: this.configService.get('APP_NAME'),
        header: 'Retail Order Request',
        link: this.configService.get('AUTH_URL'),
        logo: this.configService.get('MAIL_LOGO_LIGHT'),
        products,
        services,
        showProducts: products.length > 0,
        showServices: services.length > 0,
        // delivery_date: user.delivery_date,
        delivery_address: user.delivery_address,
      };
      await seaMailerClient.sendMail({
        subject: 'Retail Enquiry Received',
        htmlPart: this.compileTemplateToHtml('retail_transaction.hbs', context),
        from: FROM_OPTIONS,
        to: [
          {
            email: user.email,
          },
        ],
      });
    } catch (error) {}
  }

  async sendAdminRetailTransactionEmail(
    user: {
      name: string;
      email: string;
      phone: string;
      delivery_address: string;
    },
    products: ProductDto[],
    services: ServiceDto[],
    no_of_orders: number,
  ) {
    try {
      const to = [];
      const RunningEnv = this.configService.get('NODE_ENV');
      if (RunningEnv === 'production' || RunningEnv == 'prod') {
        to.push({ email: 'RFQs@cutstruct.com' });
      } else {
        to.push({ email: 'stagingadmin@cutstruct.com' });
      }

      const context = {
        appName: this.configService.get('APP_NAME'),
        header: 'Retail Order Request',
        link: this.configService.get('AUTH_URL'),
        logo: this.configService.get('MAIL_LOGO_LIGHT'),
        products,
        services,
        showProducts: products.length > 0,
        showServices: services.length > 0,
        name: user.name,
        email: user.email,
        phone: user.phone,
        // delivery_date: user.delivery_date,
        delivery_address: user.delivery_address,
        orders: no_of_orders,
        firstTimeOrder: no_of_orders === 0,
        // reach_on_whatsapp: user.is_phone_number_on_whatsapp
        // ? '(This number can be reached on whatsapp)'
        // : '',
      };

      await seaMailerClient.sendMail({
        subject: 'Retail Enquiry Received',
        htmlPart: this.compileTemplateToHtml(
          'retail_transaction_admin.hbs',
          context,
        ),
        from: FROM_OPTIONS,
        to,
      });
    } catch (error) {}
  }

  async sendEmailWithAttachment({emailAddress,user_name,datas}:{emailAddress:string,user_name:string,datas:UserTransaction[]}){
      const data = datas.map((d)=>{
        return {
          paymentPurpose:d.paymentPurpose,
          amount:d.amount,
          id:d.id,
          date:d.createdAt,
          reference:d.reference,
          itemName:d.itemName,
        }
      })
      const context = {User_Name:user_name,datas:data,appName:"Cutstruct"}
       seaMailerClient.sendMail({
        subject: 'Account Transaction Report',
        from: FROM_OPTIONS,
        htmlPart: this.compileTemplateToHtml('transaction_report.hbs', context),
        to: [{ email: emailAddress }]
      });
   
  }
}
