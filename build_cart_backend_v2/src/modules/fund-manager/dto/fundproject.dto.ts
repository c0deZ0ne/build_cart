import { IsNotEmpty, IsString, IsEnum, IsUUID } from 'class-validator';
import { PaymentMethod, SystemPaymentPurpose } from 'src/modules/payment/types';
import {
  TransactionStatus,
} from 'src/modules/project-wallet-transaction/models/project-transaction.model';

export class FundProjectWalletDto {
  @IsNotEmpty()
  amount: GLfloat;

  @IsEnum(SystemPaymentPurpose)
  paymentPurpose: SystemPaymentPurpose;

  @IsUUID()
  ProjectId: string;

  @IsUUID()
  projectWalletId?: string;

  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @IsString()
  description: string;

  transactionStatus?: TransactionStatus;

  @IsString()
  walletPin: string;
}
