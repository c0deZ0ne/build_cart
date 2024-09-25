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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/modules/auth/user.decorator';
import { User } from 'src/modules/user/models/user.model';
import { RfqService } from 'src/modules/rfq/rfq.service';
import { RfqQuoteService } from 'src/modules/rfq/rfq-quote.service';
import { CreateRfqRequestDto } from '../builder/dto';
import { CreateRfqBargainDTO } from '../builder/dto/create-rfqbargain.dto';
import { SponsorGuard } from '../auth/guards/fundManager.guard';
import { VendorService } from '../vendor/vendor.service';
import { SponsorRfqService } from './fundManager-rfq.service';
import { UseSubscription } from '../platfrom-subscription/platform-subscription.decorator';

@Controller('fundManager')
@ApiTags('fundManager')
@ApiBearerAuth()
@UseGuards(SponsorGuard)
@UseSubscription()
export class SponsorRfqController {
  constructor(
    private readonly rfqService: RfqService,
    private readonly rfqQuoteService: RfqQuoteService,
    private readonly fundManagerRfqService: SponsorRfqService,
    private vendorService: VendorService,
  ) {}

  @ApiOperation({
    summary: 'Retrieves all rfq items',
  })
  @Get('rfq/item')
  async fetchItems() {
    return this.rfqService.fetchItems();
  }

  @ApiOperation({
    summary: 'Request for Quote',
  })
  @Post('rfq/')
  async createRfqRequest(
    @GetUser() user: User,
    @Body(ValidationPipe) body: CreateRfqRequestDto,
  ) {
    return await this.rfqService.createRequest(body, user);
  }

  @ApiOperation({
    summary: 'Retrieve RFQs for project',
  })
  @Get('project/:projectId/all-rfqrequest')
  async getRequestsForProject(
    @Param('projectId') projectId: string,
    @GetUser() user: User,
  ) {
    return await this.rfqService.getRequestsForProject({
      projectId,
      fundManagerId: user.FundManagerId,
    });
  }

  @ApiOperation({
    summary: 'Retrieve bids for request',
  })
  @Get('rfq/:rfqRequestId')
  async getBidsForRequest(
    @Param('rfqRequestId') rfqRequestId: string,
    @Query('ProjectId') ProjectId: string,
    @GetUser() { FundManagerId }: User,
  ) {
    return await this.rfqService.getBidsForRequest({
      rfqRequestId,
      FundManagerId,
      ProjectId,
    });
  }

  @ApiOperation({
    summary: 'Retrieve all bids for in rfqrequest material',
  })
  @Get('rfq/:rfqRequestIdMaterialId/viewbid')
  async getRequestMaterials(
    @Param('rfqRequestIdMaterialId') rfqRequestIdMaterialId: string,
    @GetUser() { FundManagerId }: User,
  ) {
    return await this.rfqService.getBidsForMaterial({
      rfqRequestIdMaterialId,
      FundManagerId,
    });
  }
  @ApiOperation({
    summary: 'Accept rfq bid and create order ',
  })
  @Patch('rfq/:rfqQuoteId/accept-bid')
  async acceptBid(
    @GetUser() user: User,
    @Param('rfqQuoteId') RfqQuoteId: string,
  ) {
    return await this.fundManagerRfqService.fundManagerAcceptBid({
      user,
      RfqQuoteId,
    });
  }
  @ApiOperation({
    summary: 'Decline rfq bid and reopen rfq  ',
  })
  @Patch('rfq/:orderId/decline')
  async declineBid(@GetUser() user: User, @Param('orderId') orderId: string) {
    await this.fundManagerRfqService.SponsorDeclineOrder({
      user,
      orderId,
    });
  }

  @ApiOperation({
    summary: 'Bargain for qoute',
  })
  @Post('rfq/bargain')
  async BargainRfqForBuilder(
    @Body(ValidationPipe) body: CreateRfqBargainDTO,
    @GetUser() user: User,
  ) {
    return await this.rfqQuoteService.createBargain({
      user: user,
      bargain: body,
    });
  }

  @ApiOperation({
    summary: 'all vendors and grouped categories',
  })
  @Get('supplier/all')
  async async() {
    return await this.vendorService.getVendorsGroupedByCategoryName();
  }
}
