import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { VendorGuard } from 'src/modules/auth/guards/vendor.guard';
import { BankService } from 'src/modules/bank/bank.service';
import { VendorService } from './vendor.service';
import { GetUser } from 'src/modules/auth/user.decorator';
import { User } from 'src/modules/user/models/user.model';
import { UserService } from 'src/modules/user/user.service';
import { DocumentsService } from 'src/modules/documents/documents.service';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import {
  DeleteVendorCategoryDto,
  UpdateVendorCategoryDto,
  UpdateVendorDocuments,
  UpdateVendorProfileDto,
} from './dto';
import { RfqCategory } from '../rfq/models';
import { SecurityUpdateDTO } from '../user/dto/user-security.dto';

@Controller('vendor')
@ApiTags('vendor')
@ApiBearerAuth()
@UseGuards(VendorGuard)
export class AccountController {
  constructor(
    private readonly vendorService: VendorService,
    private readonly bankService: BankService,
    private readonly userService: UserService,
    private readonly documentsService: DocumentsService,
  ) {}

  @ApiOperation({
    summary: 'Get vendor profile details',
  })
  @Get('account/profile')
  async getVendorProfile(@GetUser() user: User) {
    return await this.vendorService.ProfileOverview(user);
  }
  @ApiOperation({
    summary: 'Get dashboard profile overview',
  })
  @Get('dashboard/overview')
  async getVendorDashboardOverview(@GetUser() user: User) {
    return await this.vendorService.dashboardOverview(user);
  }

  @ApiOperation({
    summary: 'update your security details',
  })
  @Patch('security-update')
  async securityUpdate(
    @GetUser() user: User,
    @Body(ValidationPipe) securityUpdateDto: SecurityUpdateDTO,
  ) {
    return this.userService.securityUpdate({ user, securityUpdateDto });
  }

  @ApiOperation({
    summary: 'Get user details',
  })
  @Get('account/security')
  async getUserDetails(@GetUser() { id }: User) {
    const {
      status,
      email,
      twoFactorAuthEnabled,
      emailNotificationEnabled,
      smsNotificationEnabled,
      signatures,
    } = await this.userService.getUserById(id);
    return {
      status,
      id,
      email,
      smsNotificationEnabled,
      signatures,
      twoFactorAuthEnabled,
      emailNotificationEnabled,
    };
  }

  @ApiOperation({
    summary: 'Get bank details',
  })
  @Get('account/bank')
  async getBankDetails(@GetUser() { VendorId }: User) {
    return await this.bankService.getBankDetails(VendorId);
  }

  @ApiOperation({
    summary: 'Update bank details',
  })
  @Put('account/bank')
  async updateBankAccount(
    @Body(ValidationPipe) body: CreateBankAccountDto,
    @GetUser() { id, VendorId }: User,
  ) {
    return await this.bankService.upsertBankAccount(body, id, VendorId);
  }

  @ApiOperation({
    summary: 'Update vendor profile details',
  })
  @Patch('account/profile')
  async updateVendorProfile(
    @Body(ValidationPipe) body: UpdateVendorProfileDto,
    @GetUser() { VendorId }: User,
  ) {
    return await this.vendorService.updateProfile(VendorId, body);
  }

  @ApiOperation({
    summary: 'Update vendor document details',
  })
  @Patch('account/document')
  async updateDocument(
    @Body(ValidationPipe) data: UpdateVendorDocuments,
    @GetUser() { VendorId }: User,
  ) {
    await this.vendorService.updateVendorDocuments(VendorId, data);
  }

  @ApiOperation({
    summary: 'bulk add category list to your account',
  })
  @ApiCreatedResponse({ type: RfqCategory })
  @Post('/category/add')
  async updateCategory(
    @GetUser() { VendorId }: User,
    @Body(ValidationPipe) updateVendorCategory: UpdateVendorCategoryDto,
  ) {
    return this.vendorService.addVendorCategory({
      updateVendorCategory: updateVendorCategory,
      vendorId: VendorId,
    });
  }

  @ApiOperation({
    summary: 'add single category to vendor list of categories',
  })
  @ApiCreatedResponse({ type: RfqCategory })
  @Put('/:categoryId/add')
  async addSingleCategory(
    @GetUser() { VendorId }: User,
    @Param('categoryId') categoryId: string,
  ) {
    return this.vendorService.addSingleCategory({
      categoryId,
      VendorId,
    });
  }

  @ApiOperation({
    summary: 'bulk remove category from a vendor list of categories',
  })
  @ApiCreatedResponse({ type: RfqCategory })
  @Delete('/category/delete')
  async bulkRemoveCategory(
    @GetUser() { VendorId }: User,
    @Body(ValidationPipe) updateVendorCategory: UpdateVendorCategoryDto,
  ) {
    return this.vendorService.bulkDeleteVendorCategories({
      updateVendorCategory: updateVendorCategory,
      vendorId: VendorId,
    });
  }
  @ApiOperation({
    summary: 'remove category from a vendor list of categories',
  })
  @ApiCreatedResponse({ type: RfqCategory })
  @Delete('/:categoryId/delete')
  async removeCategory(
    @GetUser() { VendorId }: User,
    @Param('categoryId') categoryId: string,
  ) {
    return this.vendorService.removeCategoryFromUserList({
      categoryId,
      VendorId,
    });
  }
}
