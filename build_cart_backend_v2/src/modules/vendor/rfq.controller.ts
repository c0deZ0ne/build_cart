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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { RfqService } from 'src/modules/rfq/rfq.service';
import { VendorGuard } from 'src/modules/auth/guards/vendor.guard';
import { GetUser } from 'src/modules/auth/user.decorator';
import { User } from 'src/modules/user/models/user.model';
import { RfqQuoteService } from 'src/modules/rfq/rfq-quote.service';
import { CreateVendorRfqBlacklistDto } from './dto/create-rdfBlacklist.dto';
import { VendorRfqService } from './vendor-rfq.service';
import { VendorAcceptRfqOrBargainDTO } from '../builder/dto/create-rfqbargain.dto';

@Controller('vendor')
@ApiTags('vendor')
@ApiBearerAuth()
@UseGuards(VendorGuard)
export class RfqController {
  constructor(
    private readonly rfqService: RfqService,
    private readonly rfqQuoteService: RfqQuoteService,
    private readonly vendorRfqService: VendorRfqService,
  ) {}

  @ApiOperation({
    summary: 'get rfq material requests',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description:
      'Search query for vendors. Searches in fields: builder name, item name, paymentType.',
  })
  @Get('bidboard/rfq/request')
  async getRfqs(@GetUser() user: User, @Query('search') search: string) {
    return await this.rfqService.getNonBiddedMaterialRequestsForSupplier(
      {
        user,
      },
      search,
    );
  }

  @ApiOperation({
    summary: 'view material request details',
  })
  @Get('/bidboard/rfq/:rfqMaterialRequestId')
  async viewMaterialRequest(
    @Param('rfqMaterialRequestId') rfqMaterialRequestId: string,
  ) {
    return await this.vendorRfqService.getMaterialRequest(rfqMaterialRequestId);
  }

  @ApiQuery({
    name: 'search',
    required: false,
    description:
      'Search query for vendors. Searches in fields: builder name, item name, paymentType.',
  })
  @ApiOperation({
    summary: 'bidboard submitted RFQ requests',
  })
  @Get('bidboard/submitted')
  async getSubmittedRfq(
    @GetUser() user: User,
    @Query('search') search: string,
  ) {
    return await this.rfqQuoteService.getSubmittedRfq({ user }, search);
  }

  @ApiOperation({
    summary: ' enable Bargain for quote',
  })
  @Patch('bidboard/rfq-bargain/:rfqQuoteId/enable')
  async BargainRfqForBuilder(
    @GetUser() user: User,
    @Param('rfqQuoteId') rfqQuoteId: string,
  ) {
    return await this.rfqQuoteService.allowBidBargain({
      user: user,
      id: rfqQuoteId,
    });
  }

  @ApiOperation({
    summary: 'Disable Builder bargaining',
  })
  @Patch('bidboard/rfq-bargain/:rfqQuoteId/disable')
  async disableBuilderBargain(
    @GetUser() user: User,
    @Param('rfqQuoteId') rfqQuoteId: string,
  ) {
    return await this.rfqQuoteService.disableBidBargain({
      user: user,
      id: rfqQuoteId,
    });
  }

  @ApiOperation({
    summary: 'close/blacklist RFQ requests',
  })
  @Post('bidboard/rfq/close')
  async blackListRfq(
    @GetUser() user: User,
    @Body(ValidationPipe) createDto: CreateVendorRfqBlacklistDto,
  ) {
    return await this.vendorRfqService.createRfqBlacklist({ user, createDto });
  }

  @ApiOperation({
    summary: 'Retrieve saved RFQ requests',
  })
  @Get('rfq/saved')
  async getSavedRfqForVendor(@GetUser() user: User) {
    return await this.rfqService.getSavedRfqForVendor(user.VendorId);
  }

  @ApiOperation({
    summary: 'Get details and all materials of an RFQ request',
  })
  @Get('rfq/:id')
  async getRequestDetails(@Param('id') rfqRequestId: string) {
    return await this.rfqService.getRequestDetails(rfqRequestId);
  }

  @ApiOperation({
    summary: 'Save an RFQ request',
  })
  @Post('rfq/:id/save')
  async saveRfqRequestForVendor(
    @GetUser() user: User,
    @Param('id') rfqRequestId: string,
  ) {
    return await this.rfqService.saveRfqRequestForVendor(
      rfqRequestId,
      user.VendorId,
    );
  }

  @ApiOperation({
    summary: 'Cancel Quote',
  })
  @Post('rfq/:rfqQuoteId/cancel')
  async cancelBid(@Param('rfqQuoteId') rfqQuoteId: string) {
    return await this.rfqQuoteService.cancelBid(rfqQuoteId);
  }

  @ApiOperation({
    summary: 'Vendor Bargain for rfqMaterial',
  })
  @Post('rfq/bargain')
  async BargainRfqForVendor(
    @Body(ValidationPipe) body: VendorAcceptRfqOrBargainDTO,
    @GetUser() user: User,
  ) {
    return await this.rfqQuoteService.createVendorBargain({
      user: user,
      body: body as VendorAcceptRfqOrBargainDTO,
    });
  }

  @ApiOperation({
    summary: 'fetches a Quote details',
  })
  @Get('rfq/:rfqQuoteId')
  async getQuote(
    @Param('rfqQuoteId') rfqQuoteId: string,
    @GetUser() user: User,
  ) {
    return await this.rfqQuoteService.getRfqQuoteByIdForUser(rfqQuoteId, user);
  }
}
