import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { EmailModule } from '../email/email.module';
import { LabourHackModule } from '../labour-hack/labour-hack.module';
import { ProductModule } from '../product/product.module';
import { VendorProductModule } from '../vendor-product/vendor-product.module';
import { RetailTransaction } from './models/retail-transaction.model';
import { RetailUser } from './models/retail.model';
import { RetailController } from './retail.controller';
import { RetailService } from './retail.service';
import { BuilderModule } from '../builder/builder.module';
import { UserModule } from '../user/user.module';
import { RetailTransactionController } from './controllers/retail-transaction.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([RetailUser, RetailTransaction]),
    EmailModule,
    LabourHackModule,
    ProductModule,
    VendorProductModule,
    BuilderModule,
    UserModule,
  ],
  controllers: [RetailController, RetailTransactionController],
  providers: [RetailService],
})
export class RetailModule {}
