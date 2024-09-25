import { TenderType } from 'src/modules/fund-manager/models/project-tender.model';
import { SystemPaymentPurpose } from 'src/modules/payment/types';

export type ProjectInviteBase = {
  projectName: string;
  ProjectTenderId: string;
  logo: string;
  location: string;
  fundManagerLogo: string;
  type: TenderType;
  startDate: Date;
  BOQ: string;
  projectId: string;
};
export interface ProjectInviteType extends ProjectInviteBase {
  blacklistedBuilders: string[] | null;
  invitedBuilders: string[] | null;
}

export type projectInvite = {
  projectId: string;
  owner: { name: string; email: string; phone: string };
  title: string;
  sharedId: string;
  location: string;
  duration: string;
  dateCreated: Date;
};

export interface PaystackWebhookRequest {
  event: PaystackWebhookEnum;
  data: PaystackWebhookRequestData;
}

export enum PaystackWebhookEnum {
  CHARGE_SUCCESS = 'charge.success',
}

export interface PaystackWebhookRequestData {
  status: PaystackTransactionStatus;
  userId: string;
  reference: string;
  gateway_response: string;
  amount: number;
  authorization: PaystackAuthorizationData;
  metadata: MetaData;
}

export interface MetaData {
  projectId: string;
  orderId: string;
  paymentPurpose: SystemPaymentPurpose;
}

export interface initializePaymentData {
  userId: string;
  reference: string;
  email: string;
  amount: number;
  metadata: object;
}

export enum PaystackTransactionStatus {
  SUCCESS = 'success',
}

export interface PaystackAuthorizationData {
  authorization_code: string;
  card_type: string;
  exp_month: string;
  exp_year: string;
  last4: string;
  reusable: boolean;
}
