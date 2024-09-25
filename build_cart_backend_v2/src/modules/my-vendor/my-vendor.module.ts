import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { MyVendor } from './models/myVendor.model';
import { MyVendorService } from './my-vendor.service';

@Module({
  imports: [SequelizeModule.forFeature([MyVendor])],
  providers: [MyVendorService],
  exports: [MyVendorService],
})
export class MyVendorModule {}
