import {
  Body,
  Controller,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { RegisterVendorDto } from './dto/register-vendor.dto';
import { VendorService } from './vendor.service';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiBody,
} from '@nestjs/swagger';
import { UploadDocumentsDto } from './dto';
import { VendorGuard } from 'src/modules/auth/guards/vendor.guard';
import { GetUser } from 'src/modules/auth/user.decorator';
import { User } from 'src/modules/user/models/user.model';
import { BankService } from 'src/modules/bank/bank.service';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { DocumentsService } from 'src/modules/documents/documents.service';
import { Vendor } from './models/vendor.model';
import { RegisterVendorFromMarketDto } from './dto/register-vendor-from-market.dto';
@Controller('vendor')
@ApiTags('vendor')
export class VendorController {
  constructor(
    private readonly vendorService: VendorService,
    private readonly bankService: BankService,
    private readonly documentsService: DocumentsService,
  ) {}

  @ApiOperation({
    summary: 'Register a vendor',
  })
  @ApiBody({ type: RegisterVendorDto })
  @ApiCreatedResponse({ type: Vendor })
  @Post('')
  async register(
    @Body(ValidationPipe) body: RegisterVendorDto,
    @Query('invitationId') invitationId: string,
  ) {
    if (invitationId) {
      const vendorId = await this.vendorService.registerVendor({ body });
      return await this.vendorService.addVendorToBuilder(
        invitationId,
        vendorId,
      );
    }
    return await this.vendorService.registerVendor({ body });
  }

  @ApiOperation({
    summary: 'Register Vendor from Retail Market Place',
  })
  @Post('create-vendor')
  async createVendor(@Body(ValidationPipe) body: RegisterVendorFromMarketDto) {
    // return this.vendorService.registerVendorFromRetail(body);
  }

  @ApiBearerAuth()
  @UseGuards(VendorGuard)
  @ApiOperation({
    summary: 'Add Bank details',
  })
  @Post('bank')
  async createBankAccount(
    @Body(ValidationPipe) body: CreateBankAccountDto,
    @GetUser() { id, VendorId }: User,
  ) {
    return this.bankService.upsertBankAccount(body, id, VendorId);
  }

  @ApiBearerAuth()
  @UseGuards(VendorGuard)
  @ApiOperation({
    summary: 'Upload required documents',
  })
  @Post('documents')
  async uploadDocuments(
    @Body(ValidationPipe) body: UploadDocumentsDto,
    @GetUser() { VendorId }: User,
  ) {
    return this.documentsService.uploadDocuments(body, VendorId);
  }
}
