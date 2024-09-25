import { Module, forwardRef } from '@nestjs/common';
import { BaniPaymentService } from './bani-payment/bani-payment.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { MyPayment } from '../my-payment/models/myPayments.model';
import { Contract } from '../contract/models';
import { Payment } from './models/payment.model';
import { BaniPaymentModule } from './bani-payment/bani-payment.module';
import { CutstructPayModule } from './cutstuct-payment/cutstruct-payment.module';
import { CutstructPayService } from './cutstuct-payment/custruct-payment.service';
import { PaymentService } from './payment.service';
import { EmailModule } from '../email/email.module';
import { PaystackPaymentService } from './paystack-payment/paystcak-payment.service';
import { PaystackPaymentModule } from './paystack-payment/paystack-payment.module';
import { RfqBargain } from '../rfq/models';
import { VendorRfqBlacklist } from '../vendor/models/vendor-rfqBlacklist';
import { RemitterPaymentService } from './remiter-payment/remitter-payment.service';
import { RemitterPaymentModule } from './remiter-payment/remitter-payment.module';
import { Order } from '../order/models';
import { ContractModule } from '../contract/contract.module';
import { UserWalletModule } from '../user-wallet/user-wallet.module';
import { UserWalletService } from '../user-wallet/user-wallet.service';
import { UserWallet } from '../user-wallet/models/user-wallet.model';
@Module({
  imports: [
    SequelizeModule.forFeature([
      MyPayment,
      UserWallet,
      Contract,
      Order,
      Payment,
      RfqBargain,
      VendorRfqBlacklist,
    ]),
    forwardRef(() => BaniPaymentModule),
    forwardRef(() => PaystackPaymentModule),
    forwardRef(() => CutstructPayModule),
    forwardRef(() => RemitterPaymentModule),
    forwardRef(() => ContractModule),
    forwardRef(() => UserWalletModule),
    EmailModule,
  ],
  providers: [
    BaniPaymentService,
    CutstructPayService,
    UserWalletService,
    PaymentService,
    PaystackPaymentService,
    RemitterPaymentService

  ],
  exports: [BaniPaymentService, CutstructPayService, PaymentService,RemitterPaymentService,UserWalletService],
})
export class PaymentModule {}
