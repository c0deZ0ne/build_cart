import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UploadDocumentsDto } from 'src/modules/vendor/dto';
import { Documents } from './models/documents.model';
import { VendorService } from '../vendor/vendor.service';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectModel(Documents)
    private readonly documentsModel: typeof Documents,
    @Inject(forwardRef(() => VendorService))
    private vendorService: VendorService,
  ) {}

  async uploadDocuments(
    uploadDocumentsDto: UploadDocumentsDto,
    vendorId: string,
  ) {
    await this.documentsModel.upsert({
      VendorId: vendorId,
      businessCertificate: uploadDocumentsDto.businessCertificate,
      vatCertificate: uploadDocumentsDto.vatCertificate,
      insuranceCertificate: uploadDocumentsDto.insuranceCertificate,
      proofOfIdentity: uploadDocumentsDto.proofOfIdentity,
      confirmationOfAddress: uploadDocumentsDto.confirmationOfAddress,
    });
    await this.vendorService.shouldVerifyKyc(vendorId);
  }

  async retrieveDocuments(vendorId: string) {
    return await this.documentsModel.findOne({ where: { VendorId: vendorId } });
  }
}
