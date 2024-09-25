
export enum AllPaymentType {
  ACCOUNT_WALLET_TOP_UP = 'ACCOUNT_WALLET_TOP_UP',
  ORDER_PAYMENT = 'ORDER_PAYMENT',
  PROJECT_WALLET_TOP_UP = 'PROJECT_WALLET_TOP_UP',
  PLATFORM_SUBSCRIPTION = 'PLATFORM_SUBSCRIPTION',
}
export enum AllPaymentProviders {
  REMITA = 'REMITA',
  PAYSTACK = 'PAYSTACK',
  WALLET="WALLET"
}

export enum FundOrderType {
  VAULT = 'vault',
  PROJECT_WALLET = 'projecWallet',
}

export enum PaymentProvider {
  BANI = 'BANI',
  PAYSTACK = 'PAYSTACK',
  REMITA = 'REMITA',
  BANK = 'BANK_TRANSFER',
  CUTSTRUCT_PAY = 'CUTSTRUCT_PAY',
}

export enum PaymentStatus {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  PENDING = 'PENDING',
}

export enum PaymentMethod {
  BANK_TRANSFER = 'BANK_TRANSFER',
  CREDIT_CARD = 'CREDIT_CARD',
  BANK_USSD = 'BANK_USSD',
  MOBILE_MONEY = 'MOBILE_MONEY',
  CUTSTRUCT_PAY = 'CUTSTRUCT_PAY',
}

export enum SystemPaymentPurpose {
  RFQ_REQUEST = 'RFQ_REQUEST',
  FUND_PROJECT_WALLET = 'FUND_PROJECT_WALLET',
  FUND_WALLET = 'FUND_WALLET',
  FUND_ORDER = 'FUND_ORDER',
  PLATFORM_SUBSCRIPTION = 'PLATFORM_SUBSCRIPTION',
}

export enum PaymentType {
  ACCOUNT_WALLET_TOP_UP = 'ACCOUNT_WALLET_TOP_UP',
  ORDER_PAYMENT = 'ORDER_PAYMENT',
  PROJECT_WALLET_TOP_UP = 'PROJECT_WALLET_TOP_UP',
  PLATFORM_SUBSCRIPTION = 'PLATFORM_SUBSCRIPTION',
}
export enum VaultPayment {
  FUND_ORDER = 'FUND_ORDER',
  FUND_PROJECT_WALLET = 'FUND_PROJECT_WALLET',
  PLATFORM_SUBSCRIPTION = 'PLATFORM_SUBSCRIPTION',
}
export enum ProjectPayment {
  FUND_ORDER = 'FUND_ORDER',
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
export interface RemitaWebhookRequestData {
  status: PaymentStatus;
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