import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DocumentsService } from './documents.service';
import { Documents } from './models/documents.model';
import { VendorModule } from '../vendor/vendor.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Documents]),
    forwardRef(() => VendorModule),
  ],
  controllers: [],
  providers: [DocumentsService],
  exports: [DocumentsService],
})
export class DocumentsModule {}
