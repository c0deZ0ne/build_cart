import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { BuilderService } from './builder.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { BuilderGuard } from 'src/modules/auth/guards/builder.guard';
import { GetUser } from 'src/modules/auth/user.decorator';
import { User } from 'src/modules/user/models/user.model';
import { RfqService } from '../rfq/rfq.service';
import {
  AddPortFolioMediaDTO,
  BuilderPortFolioDto,
  NewBuilderDto,
  UpdatePortFolioDTO,
} from './dto/reg-builder.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { BuilderVendorService } from './builder-vendor-service';
import { InvitationDto } from '../invitation/dto/platformInvitation.dto';
import { CreateBankAccountDto } from '../vendor/dto/create-bank-account.dto';
import { BankService } from '../bank/bank.service';
import { VendorStatus } from '../vendor/models/vendor.model';
import { ProjectService } from '../project/project.service';
import { UserWalletService } from '../user-wallet/user-wallet.service';
import { ProjectStatus } from '../project/models/project.model';
import { GetOverviewDto } from './dto/get-overview.dto';
import { FundManagerBuilderService } from '../fund-manager/fundManager-builder.service';
import { VendorProductService } from '../vendor-product/services/vendor-product.service';

@Controller('builder')
@ApiTags('builder')
@ApiBearerAuth()
export class BuilderController {
  constructor(
    private readonly builderService: BuilderService,
    private readonly builderVendorService: BuilderVendorService,
    private readonly bankService: BankService,
    private readonly projectService: ProjectService,
    private readonly userWalletService: UserWalletService,
    private readonly rfqService: RfqService,
    private readonly fundManagerBuilderService: FundManagerBuilderService,
    private readonly vendorProductService: VendorProductService,
  ) {}

  @Post('/register')
  @ApiBody({ type: NewBuilderDto })
  @ApiOperation({
    summary: 'Register builder',
  })
  async register(
    @Body(ValidationPipe) body: NewBuilderDto,
    @Query('invitationId') invitationId: string,
  ) {
    const user = await this.builderService.registerBuilder({
      body,
      invitationId: invitationId,
    });
    return await this.builderService.addBuilderToFundManagerBuilders({
      builderId: user.BuilderId,
      invitationId,
    });
    return user;
  }

  @ApiBearerAuth()
  @UseGuards(BuilderGuard)
  @ApiOperation({
    summary: 'Add Builder Portfolio',
  })
  @Post('portfolio')
  async createBuilderPortFolio(
    @Body(ValidationPipe) body: BuilderPortFolioDto,
    @GetUser() user: User,
  ) {
    return this.builderService.addBuilderPortfolio(body, user);
  }

  @ApiBearerAuth()
  @UseGuards(BuilderGuard)
  @ApiOperation({
    summary: 'Edit Builder Portfolio',
  })
  @Patch('portfolio/edit')
  async editBuilderPortFolio(@Body(ValidationPipe) body: UpdatePortFolioDTO) {
    return this.builderService.updateBuilderPortfolio(body);
  }

  @ApiBearerAuth()
  @UseGuards(BuilderGuard)
  @ApiOperation({
    summary: 'Get Builder Portfolio',
  })
  @Get('portfolio')
  async getBuilderPortFolio(@GetUser() user: User) {
    return this.builderService.getBuilderPortFolio(user);
  }

  @ApiBearerAuth()
  @UseGuards(BuilderGuard)
  @ApiOperation({
    summary: 'Add Media to Portfolio',
  })
  @Patch('portfolio/add-media')
  async addMediaToPortFolio(@Body(ValidationPipe) body: AddPortFolioMediaDTO) {
    return this.builderService.addMediaToBuilderPortfolio(body);
  }

  @Post('/register-builder-with-sso')
  @ApiBody({ type: CreateUserDto })
  @ApiOperation({
    summary: 'Register builder with sso',
  })
  async registerBuilderWithSSO(
    @Body(ValidationPipe) body: CreateUserDto,
    @Query('sso_user') sso_user: boolean,
  ) {
    return this.builderService.registerBuilderFromMarketPlace(
      body,
      sso_user ? true : false,
    );
  }

  @Get('/vendors')
  @ApiOperation({
    summary: 'Retrieves all vendors',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description:
      'Search query for vendors. Searches in fields: businessName, location, VendorType.',
  })
  async fetchAllVendors(@Query('search') search: string) {
    return this.builderVendorService.getAllVendors(
      VendorStatus.APPROVED,
      search,
    );
  }

  @ApiOperation({
    summary: 'Get vendor products by vendor Id',
  })
  @ApiQuery({
    name: 'searchParam',
    required: false,
    example: 'cement',
  })
  @Get('/vendors/:vendorId/vendor-products')
  async getVendorProductsByID(
    @Query('searchParam') searchParam: string,
    @Param('vendorId') id: string,
  ) {
    return await this.vendorProductService.getVendorProducts({
      vendorId: id,
      searchParam,
    });
  }

  @Post('/send-invite')
  @ApiOperation({
    summary: 'Send invite to a vendor',
  })
  @UseGuards(BuilderGuard)
  async sendPlatformInviite(
    @Body(ValidationPipe) data: InvitationDto,
    @GetUser() user: User,
  ) {
    return await this.builderVendorService.sendInviteToVendor(data, user);
  }

  @ApiBearerAuth()
  @UseGuards(BuilderGuard)
  @ApiOperation({
    summary: 'Add Bank details',
  })
  @Post('bank')
  async createBankAccount(
    @Body(ValidationPipe) body: CreateBankAccountDto,
    @GetUser() { id, BuilderId }: User,
  ) {
    return this.bankService.upsertBankAccountForBuilder(body, id, BuilderId);
  }

  @ApiBearerAuth()
  @UseGuards(BuilderGuard)
  @Get('/overview')
  @ApiOperation({
    summary: 'Get builder overview',
  })
  async overview(@GetUser() user: User) {
    return this.builderService.getOverview(user);
  }

  @ApiBearerAuth()
  @UseGuards(BuilderGuard)
  @Get('/balance-summary')
  @ApiOperation({
    summary: 'Get builder balance summary',
  })
  async balanceSummary(@GetUser() user: User) {
    return this.builderService.getBalanceSummary(user);
  }

  @ApiBearerAuth()
  @UseGuards(BuilderGuard)
  @Get('/overview/project/cost')
  @ApiOperation({
    summary: 'Get builder project cost',
  })
  async projectCostOverview(
    @GetUser() user: User,
    @Query() dateFilter: GetOverviewDto,
  ) {
    return this.builderService.getProjectCostOverview(user, dateFilter);
  }
}
