import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModule } from '../user/user.module';
import { Vendor } from '../vendor/models/vendor.model';
import { TemporaryVendor } from './model/temporary-vendor.model';
import { TemporaryVendorController } from './temporary-vendor.controller';
import { TemporaryVendorService } from './temporary-vendor.service';

@Module({
  imports: [SequelizeModule.forFeature([TemporaryVendor, Vendor]), UserModule],
  controllers: [TemporaryVendorController],
  providers: [TemporaryVendorService],
  exports: [TemporaryVendorService],
})
export class TemporaryVendorModule {}
