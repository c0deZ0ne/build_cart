import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
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
import * as fs from 'fs';

const dir = path.join(__dirname, 'templates');

const DEFAULTMESSAGE = 'We are glad to have you';

@Injectable()
export class EmailServiceOld {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  sendEmail(sendMailOptions: ISendMailOptions) {
    try {
      return this.mailerService.sendMail(sendMailOptions);
    } catch (error) {}
  }

  async sendVerifyEmail(data: OTPVerificationDto) {
    const { email, name, otp } = data;

    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'OTP Verification Code',
        template: './otp_verification_email',
        context: {
          appName: this.configService.get('APP_NAME'),
          header: 'OTP Verification Code',
          name: name || 'Customer',
          otp,
        },
      });
    } catch (error) {}
  }

  async sendGeneratedPasswordEmail(data: SendGeneratedPasswordDto) {
    const { email, name, password } = data;
    try {
      this.mailerService.sendMail({
        to: email,
        subject: 'Send Generated Password',
        template: './send_generated_email',
        context: {
          appName: this.configService.get('APP_NAME'),
          header: 'Send Generated Password',
          name: name || 'Customer',
          password,
        },
      });
    } catch (error) {}
  }

  async resendOTPMail(data: OTPVerificationDto) {
    const { email, name, otp } = data;

    return this.mailerService.sendMail({
      to: email,
      subject: 'Resend OTP: Complete your Secure Login',
      template: './resend_otp_verification_email',
      context: {
        appName: this.configService.get('APP_NAME'),
        header: 'Resend OTP: Complete your Secure Login',
        name: name || 'Customer',
        otp,
      },
    });
  }

  async send2FAMail(data: OTPVerificationDto) {
    const { email, name, otp } = data;

    return this.mailerService.sendMail({
      to: email,
      subject: '2FA Setup: Complete your 2fa setup',
      template: './send_2fa_otp_email',
      context: {
        appName: this.configService.get('APP_NAME'),
        header: '2FA Setup: Complete your 2fa setup',
        name: name || 'Customer',
        otp,
      },
    });
  }

  resetPassword(email: string, token: number, name: string) {
    return this.mailerService.sendMail({
      to: email,
      subject: 'Reset your password',
      template: './reset_password',
      context: {
        name: name || 'Customer',
        token,
        appName: this.configService.get('APP_NAME'),
        link: `${this.configService.get(
          'AUTH_URL',
        )}/verify-password-reset?email=${email}&change_password=true`,
      },
    });
  }

  async sendSponsorEmail(email: string, password: string) {
    return this.mailerService.sendMail({
      to: email,
      subject: 'CutStruct FundManager Account Created',
      template: './fundManager_email',
      context: {
        appName: this.configService.get('APP_NAME'),
        email,
        header: 'Account Details',
        logo: this.configService.get('MAIL_LOGO_LIGHT'),
        link: this.configService.get('AUTH_URL'),
        password,
        description: `Your CutStruct fundManager account has been created. Please login with the following credentials below at ${this.configService.get(
          'AUTH_URL',
        )}`,
      },
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
      await this.mailerService.sendMail({
        to: email,
        subject: `CutStruct ${userType} Account Created`,
        template: './create_account_email',
        context: {
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
        },
      });
    } catch (error) {}
  }
  async inviteNotificationEmail(data: InvitationNotificationDto) {
    return await this.mailerService.sendMail({
      to: data.buyerEmail,
      subject: 'CutStruct Platform',
      template: './platform_invitation_email',
      context: {
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
        description: `Congratulations! ${data.buyerName}, you have an invitation from ${data.fundManagerName}, please signup to CutStruct Platform using the link below`,
      },
    });
  }

  async platformInvitationsEmail(data: PlatformInvitation) {
    const msg = data.message || DEFAULTMESSAGE;
    return await this.mailerService.sendMail({
      to: data.toEmail,
      subject: 'CutStruct Platform',
      template: './platform_invitation_email',
      context: {
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
      },
    });
  }
  async projectInviteExistUser(data: PlatformInvitation) {
    const msg = data.message || DEFAULTMESSAGE;
    return await this.mailerService.sendMail({
      to: data.toEmail,
      subject: 'CutStruct Platform',
      template: './platform_invitation_email',
      context: {
        appName: this.configService.get('APP_NAME'),
        inviteeName: data.inviteeName,
        buyerName: data.toName,
        loginLink: `${this.configService.get('AUTH_URL')}?invitationId=${
          data.invitationId || randomUUID()
        }`,
        signupLink: `${this.configService.get(
          'AUTH_URL',
        )}?invitationId=${randomUUID()}&&projectId=${data.projectId}`,
        header: 'Invitation',
        logo: this.configService.get('MAIL_LOGO_LIGHT'),
        description: `Congratulations! ${data.toName}, you have a project invitation from ${data.inviteeName}, please login to CutStruct Platform using the link below or create account if you don't already have one`,
        message: `${msg},`,
      },
    });
  }

  async fundManagerPlatformInvitationsEmail(
    data: FundmanagerPlatformInvitation,
  ) {
    const msg = data.message || DEFAULTMESSAGE;
    return await this.mailerService.sendMail({
      to: data.toEmail,
      subject: 'CutStruct Platform',
      template: './platform_invitation_email',
      context: {
        appName: this.configService.get('APP_NAME'),
        inviteeName: data.inviteeName,
        buyerName: data.toName,
        loginLink: `${this.configService.get(
          'AUTH_URL',
        )}?invitationId=${randomUUID()}&projectId=${data.projectId}`,
        signupLink: `${this.configService.get(
          'AUTH_URL',
        )}/auth/signup?invitationId=${randomUUID()}&projectId=${
          data.projectId
        }`,
        header: 'Invitation',
        logo: this.configService.get('MAIL_LOGO_LIGHT'),
        description: `Congratulations! ${data.toName}, you have an invitation from ${data.inviteeName}. For further information, contact ${data.phoneNumber}. Please signup to CutStruct Platform using the link below`,
        message: `${msg},`,
      },
    });
  }

  async platformInvitationsEmailToBuilder(data: BuilderInvitation) {
    const msg = data.message || DEFAULTMESSAGE;
    return await this.mailerService.sendMail({
      to: data.toEmail,
      subject: 'CutStruct Platform',
      template: './platform_invitation_email',
      context: {
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
      },
    });
  }

  async platformInvitationsEmailToVendor(data: ISendPlatformInvitation) {
    const msg = data.message || DEFAULTMESSAGE;
    return await this.mailerService.sendMail({
      to: data.toEmail,
      subject: 'CutStruct Platform',
      template: './vendor_platform_invitation_email',
      context: {
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
      },
    });
  }

  async adminTransactionApprove(data: ApproveDto) {
    try {
      return await this.mailerService.sendMail({
        to: this.configService.get('ADMIN_MAIL'),
        subject: 'Approve Payment Request',
        template: './approvePayment',
        context: {
          appName: this.configService.get('APP_NAME'),
          VendorName: data.VendorName,
          title: data.title,
          buyerName: data.buyerName,
          approveLink: data.approveLink,
          pay_amount_collected: data.pay_amount_collected,
          header: 'Approve Payment',
          reciept_url: data.reciept_url,
          logo: this.configService.get('MAIL_LOGO_LIGHT'),
        },
      });
    } catch (error) {
      throw 'Could not notify admin please try again';
    }
  }
  async failedVerification(data: FailedVerificationDto) {
    try {
      return await this.mailerService.sendMail({
        to: this.configService.get('ADMIN_MAIL'),
        subject: 'system error',
        template: './transactionVerificationFailed',
        context: {
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
        },
      });
    } catch (error) {}
  }

  async rfqRaisedNotification(user: User) {
    try {
      const to = [];
      const RunningEnv = this.configService.get('NODE_ENV');
      if (RunningEnv === 'production' || RunningEnv == 'prod') {
        to.push('RFQs@cutstruct.com');
        to.push('tech@cutstruct.com');
      } else {
        to.push('stagingadmin@cutstruct.com');
      }
      await this.mailerService.sendMail({
        to,
        subject: 'Rfq Raised',
        template: './rfq-riasedNotification',
        context: {
          appName: this.configService.get('APP_NAME'),
          header: 'Request For Qoute',
          logo: this.configService.get('MAIL_LOGO_LIGHT'),
          description: `Congratulation! an RFQ has been raised by ${user.Builder.businessName}  `,
        },
      });
    } catch (error) {}
  }
  async rfqGroupNotification(user: User, data: any) {
    try {
      const to = [];
      const RunningEnv = this.configService.get('NODE_ENV');
      if (RunningEnv === 'production' || RunningEnv == 'prod') {
        to.push('RFQs@cutstruct.com');
        to.push(...data?.user);
      } else {
        to.push('stagingadmin@cutstruct.com');
        to.push(...data?.user);
      }
      await this.mailerService.sendMail({
        bcc: to,
        subject: 'New purchase request from CutStruct',
        template: './groupRfqEmail',
        context: {
          appName: this.configService.get('APP_NAME'),
          header: 'RFQ-Raised',
          logo: this.configService.get('MAIL_LOGO_LIGHT'),
          description: `Congratulation! an RFQ has been raised by ${user.Builder.businessName}  `,
          data: data.rfq,
          link: `${this.configService.get('AUTH_URL')}/bid-board`,
        },
      });
    } catch (error) {}
  }

  async sendContractDispatchedEmail(_data: Contract) {
    try {
      await this.mailerService.sendMail({
        to: _data.Builder.email,
        subject: 'CutStruct Platform',
        template: './bid_actions',
        context: {
          appName: this.configService.get('APP_NAME'),
          buyerName: _data.Builder.businessName,
          header: 'Contract Dispatched',
          logo: this.configService.get('MAIL_LOGO_LIGHT'),
          description: `Congratulations! ${
            _data.Builder.businessName || ''
          }, your contract has been dispatched, please see details by clicking the link below`,
          link: `${this.configService.get('AUTH_URL')}/contracts/${_data.id}`,
        },
      });
    } catch (error) {}
  }

  async sendOrderRejectNoticeEmailToVendor(_data: Contract) {
    try {
      await this.mailerService.sendMail({
        to: _data.Vendor.email,
        subject: 'CutStruct Platform',
        template: './bid_actions',
        context: {
          appName: this.configService.get('APP_NAME'),
          buyerName: _data.Builder.businessName,
          header: 'Order Rejected',
          logo: this.configService.get('MAIL_LOGO_LIGHT'),
          description: ` ${
            _data.Builder.businessName || _data.Builder.owner.name || ''
          }, has unresolved complaints on the delivered item and has rejected your order, please see details by clicking the link below`,
          link: `${this.configService.get('AUTH_URL')}/contracts/${_data.id}`, // TODO: Confirm link from frontend
        },
      });
    } catch (error) {}
  }

  async sendBuilderBargainNoticeEmailToVendor(data: RfqBargain) {
    try {
      await this.mailerService.sendMail({
        to: data.RfqQuote.Vendor.email,
        subject: 'CutStruct Platform',
        template: './bid_actions',
        context: {
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
        },
      });
    } catch (error) {}
  }

  async sendVendorBidNoticeEmailToBuilder(data: RfqBargain) {
    try {
      await this.mailerService.sendMail({
        to: data.RfqQuote.RfqRequest.Builder.email,
        subject: 'CutStruct Platform',
        template: './bid_actions',
        context: {
          appName: this.configService.get('APP_NAME'),
          VendorName: data.RfqQuote.Vendor.businessName,
          header: 'A Bid Has Been Submitted On Your Request For Quote',
          logo: this.configService.get('MAIL_LOGO_LIGHT'),
          description: ` ${
            data.RfqQuote.Vendor.businessName ||
            data.RfqQuote.Vendor.owner.name ||
            ''
          }, has raised submitted a bit on your Request For Quote, please see details by clicking the link below`,
          link: `${this.configService.get('AUTH_URL')}/builder/company-project`,
        },
      });
    } catch (error) {}
  }

  async sendContractPaid(_data: Contract) {
    try {
      await this.mailerService.sendMail({
        to: _data?.Vendor?.email,
        subject: 'CutStruct Platform',
        template: './bid_actions',
        context: {
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
        },
      });
    } catch (error) {}
  }
  async AdminNotifyContractPaid(_data: Contract) {
    try {
      await this.mailerService.sendMail({
        to: this.configService.get('ADMIN_MAIL'),
        subject: 'Platform Payment Notification',
        template: './bid_actions',
        context: {
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
        },
      });
    } catch (error) {}
  }

  async bidAccepted(_data: RfqQuote) {
    try {
      await this.mailerService.sendMail({
        to: _data?.Vendor?.email ? _data.Vendor?.email : _data.CreatedBy.email,
        subject: 'CutStruct Platform',
        template: './bid_actions',
        context: {
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
        },
      });
    } catch (error) {}
  }

  async TenderbidAccepted(_data: TenderBid) {
    try {
      await this.mailerService.sendMail({
        to: _data?.Owner?.email ? _data.Owner?.email : _data.CreatedBy.email,
        subject: 'CutStruct Platform',
        template: './bid_actions',
        context: {
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
        },
      });
    } catch (error) {}
  }

  async acceptBargain(_data: RfqQuote) {
    try {
      await this.mailerService.sendMail({
        to: _data?.Vendor?.email ? _data.Vendor?.email : _data.CreatedBy.email,
        subject: 'CutStruct Platform',
        template: './bid_actions',
        context: {
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
        },
      });
    } catch (error) {}
  }

  async sendContractAccepted(_data: Contract) {
    try {
      await this.mailerService.sendMail({
        to: _data?.Builder?.email,
        subject: 'CutStruct Platform',
        template: './bid_actions',
        context: {
          appName: this.configService.get('APP_NAME'),
          header: 'Contract Accepted',
          logo: this.configService.get('MAIL_LOGO_LIGHT'),
          description: `Congratulations! ${
            _data.Builder.businessName || ''
          }, your contract has been accepted please proceed to payment of the contract`,
          link: `${this.configService.get('AUTH_URL')}/contracts/${_data.id}`,
        },
      });
    } catch (error) {}
  }

  async confirmAndcompleteContract(_data: Contract) {
    try {
      await this.mailerService.sendMail({
        to: _data?.Vendor?.email,
        subject: 'CutStruct Platform',
        template: './bid_actions',
        context: {
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
        },
      });
    } catch (error) {}
  }

  async sendEnquiryEmail(data: CreateRetailUserDto) {
    try {
      const to = [];
      const RunningEnv = this.configService.get('NODE_ENV');
      if (RunningEnv === 'production' || RunningEnv == 'prod') {
        to.push('RFQs@cutstruct.com');
      } else {
        to.push('stagingadmin@cutstruct.com');
      }
      this.mailerService.sendMail({
        to,
        subject: 'Retail Enquiry Received',
        template: './retail_enquiry',
        context: {
          appName: this.configService.get('APP_NAME'),
          header: 'Retail Enquiry',
          link: this.configService.get('AUTH_URL'),
          logo: this.configService.get('MAIL_LOGO_LIGHT'),
          name: data.name,
          email: data.email,
          phone: data.phone,
          enquiry: data.enquiry || 'None',
          description: `You have received a request to talk more from the Custstruct Market on www.cutstruct.com/market. The details of this request is as follows: `,
        },
      });
    } catch (error) {}
  }

  async loginNotification(data: LoginConfirmationDto) {
    try {
      const { email, name } = data;
      this.mailerService.sendMail({
        to: email,
        subject: 'Login Notification',
        template: './login_notification',
        context: {
          appName: this.configService.get('APP_NAME'),
          header: 'Login Notification',
          name: name || 'Customer',
          time: new Date().toLocaleString(),
        },
      });
    } catch (error) {}
  }

  async sendConfirmationOfMaterialMail(data: ConfirmationOfMaterialDto) {
    const { buyerName, vendorName, receiverEmail } = data;

    this.mailerService.sendMail({
      to: receiverEmail,
      subject: 'Confirmation Of Materials Delivery',
      template: './confirm_material_delivery_email',
      context: {
        appName: this.configService.get('APP_NAME'),
        header: 'Confirmation Of Materials Delivery',
        name,
        buyerName,
        vendorName,
      },
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
    this.mailerService.sendMail({
      to: receiverEmail,
      subject: 'Contact and Support information for Cutstruct',
      template: './contact_and_support_email',
      context: {
        appName: this.configService.get('APP_NAME'),
        header: 'Contact and Support information for Cutstruct',
        generalEnquiriesEmail,
        supportEmail,
        supportPhoneNumber,
        liveChatLink,
        helpCenterLink,
      },
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
    this.mailerService.sendMail({
      to: buyerEmail,
      subject: 'Contract Accepted By Vendor',
      template: './contract_accepted_by_vendor_email',
      context: {
        appName: this.configService.get('APP_NAME'),
        header: 'Contract Accepted By Vendor',
        loginLink: this.configService.get('AUTH_URL'),
        vendorName,
        buyerName,
        constructionMaterial,
        contractTerms,
        contractValue,
      },
    });
  }

  async sendDeliveryConfirmationEmail(data: DeliveryConfirmationDto) {
    const {
      buyerName,
      buyerEmail,
      vendorName,
      orderNumber,
      deliveryDate,
      constructionMaterial,
    } = data;
    this.mailerService.sendMail({
      to: buyerEmail,
      subject: 'Delivery Confirmation',
      template: './delivery_confirmation',
      context: {
        appName: this.configService.get('APP_NAME'),
        header: 'Delivery Confirmation',
        logo: this.configService.get('MAIL_LOGO_LIGHT'),
        loginLink: this.configService.get('AUTH_URL'),
        vendorName,
        buyerName,
        constructionMaterial,
        orderNumber,
        deliveryDate,
      },
    });
  }

  async sendFAQEmail(data: LoginConfirmationDto) {
    const { email, name } = data;
    this.mailerService.sendMail({
      to: email,
      subject: 'FAQ',
      template: './FAQ',
      context: {
        appName: this.configService.get('APP_NAME'),
        header: 'FAQ',
        name,
      },
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
    this.mailerService.sendMail({
      to: buyerEmail,
      subject: 'Materials Dispatched',
      template: './materials_dispatched_mail',
      context: {
        appName: this.configService.get('APP_NAME'),
        header: 'Materials Dispatched',
        vendorName,
        buyerName,
        constructionMaterial,
        dispatchDate,
        arrivalDate,
      },
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
    this.mailerService.sendMail({
      to: buyerEmail,
      subject: 'New Bid Response',
      template: './new_bid_response',
      context: {
        appName: this.configService.get('APP_NAME'),
        header: 'New Bid Response',
        vendorName,
        buyerName,
        constructionMaterial,
        quotedPrice,
        deliveryTimeFrame,
      },
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
    this.mailerService.sendMail({
      to: vendorEmail,
      subject: 'New Contract Notification',
      template: './new_contract_notification',
      context: {
        appName: this.configService.get('APP_NAME'),
        header: 'New Contract Notification',
        loginLink: this.configService.get('AUTH_URL'),
        vendorName,
        buyerName,
        constructionMaterial,
        contractTerms,
        contractValue,
      },
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
    this.mailerService.sendMail({
      to: vendorEmail,
      subject: 'New Contract Sent By Builder',
      template: './new_contract_sent_by_buyer',
      context: {
        appName: this.configService.get('APP_NAME'),
        header: 'New Contract Sent By Builder',
        vendorName,
        buyerName,
        constructionMaterial,
        contractTerms,
      },
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
    this.mailerService.sendMail({
      to: vendorEmail,
      subject: 'Payment Received',
      template: './payment_received',
      context: {
        appName: this.configService.get('APP_NAME'),
        header: 'Payment Received',
        vendorName,
        buyerName,
        constructionMaterial,
        contractValue,
        amountPaid,
      },
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
    this.mailerService.sendMail({
      to: vendorEmail,
      subject: 'Payment Settled',
      template: './payment_settled',
      context: {
        appName: this.configService.get('APP_NAME'),
        header: 'Payment Settled',
        vendorName,
        buyerName,
        constructionMaterial,
        contractTerms,
        amountPaid,
        paymentDate,
      },
    });
  }

  async sendWelcomeEmail(data: LoginConfirmationDto) {
    const { email, name } = data;
    try {
      this.mailerService.sendMail({
        to: email,
        subject: 'Welcome to Cutstruct',
        template: './welcome_email',
        context: {
          appName: this.configService.get('APP_NAME'),
          header: 'Welcome to Cutstruct',
          name,
        },
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
      this.mailerService.sendMail({
        to: user.email,
        subject: 'Retail Enquiry Received',
        template: './retail_transaction',
        context: {
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
        },
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
        to.push('RFQs@cutstruct.com');
      } else {
        to.push('stagingadmin@cutstruct.com');
      }

      this.mailerService.sendMail({
        to,
        subject: 'Retail Enquiry Received',
        template: './retail_transaction_admin',
        context: {
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
        },
      });
    } catch (error) {}
  }
}
