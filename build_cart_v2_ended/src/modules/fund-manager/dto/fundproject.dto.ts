import { IsNotEmpty, IsString, IsEnum, IsUUID } from 'class-validator';
import {
  PaymentMethod,
  TransactionStatus,
} from 'src/modules/project-wallet-transaction/models/project-transaction.model';
import { PaymentPurpose } from 'src/modules/user-wallet-transaction/models/user-transaction.model';

export class FundProjectWalletDto {
  @IsNotEmpty()
  amount: GLfloat;

  @IsEnum(PaymentPurpose)
  paymentPurpose: PaymentPurpose;

  @IsUUID()
  ProjectId: string;

  @IsUUID()
  projectWalletId: string;

  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @IsString()
  description: string;

  transactionStatus?: TransactionStatus;

  @IsString()
  walletPin: string;
}
