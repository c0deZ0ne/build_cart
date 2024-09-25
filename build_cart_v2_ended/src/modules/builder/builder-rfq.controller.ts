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
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetUser } from 'src/modules/auth/user.decorator';
import { User } from 'src/modules/user/models/user.model';
import { RfqService } from 'src/modules/rfq/rfq.service';
import { RfqQuoteService } from 'src/modules/rfq/rfq-quote.service';
import { CreateRfqRequestDto, RfqRequestDeliveryScheduleDto } from './dto';
import { CreateRfqBargainDTO } from './dto/create-rfqbargain.dto';
import { VendorService } from '../vendor/vendor.service';
import { BuilderRfqService } from './builder-rfq.service';
import { BuilderGuard } from '../auth/guards/builder.guard';
import { RFQMaterialDetailsDto } from './dto/rfq-view.dto';

@Controller('builder')
@ApiTags('builder')
@ApiBearerAuth()
@UseGuards(BuilderGuard)
export class BuilderRfqController {
  constructor(
    private readonly rfqService: RfqService,
    private readonly rfqQuoteService: RfqQuoteService,
    private readonly builderRfqService: BuilderRfqService,
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
    summary: 'Request for Quote',
  })
  @Patch('rfq/:rfqRequestId/add-schedule')
  async addScheduleToRequest(
    @Param('rfqRequestId') rfqRequestId: string,
    @Body(ValidationPipe) body: RfqRequestDeliveryScheduleDto,
  ) {
    return await this.rfqService.addDeliveryScheduleToRequest(
      rfqRequestId,
      body,
    );
  }

  @ApiOperation({
    summary: 'Retrieve bids for request',
  })
  @Get('rfq/:rfqRequestId')
  async getBidsForRequest(
    @Param('rfqRequestId') rfqRequestId: string,
    @GetUser() { BuilderId }: User,
  ) {
    return await this.rfqService.getBidsForRequest({
      rfqRequestId,
      BuilderId,
    });
  }
  @ApiOperation({
    summary: 'Retrieve all bids for request',
  })
  @ApiResponse({
    status: 200,
    description: 'Rfq view Details',
    type: RFQMaterialDetailsDto,
  })
  @Get('rfq/:rfqRequestId/viewbid')
  async getRequestMaterials(
    @Param('rfqRequestId') rfqRequestId: string,
    @GetUser() user: User,
    @Query('search') search: string,
  ) {
    return await this.builderRfqService.getRfqBids({
      rfqRequestId,
      user,
      search,
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
    return await this.builderRfqService.buyerAcceptBid({
      user,
      RfqQuoteId,
    });
  }
  @ApiOperation({
    summary: 'Decline rfq bid and reopen rfq  ',
  })
  @Patch('rfq/:orderId/decline')
  async declineBid(@GetUser() user: User, @Param('orderId') orderId: string) {
    return await this.builderRfqService.buyerDeclineOrder({
      user,
      orderId,
    });
  }

  @ApiOperation({
    summary: 'Bargain for quote',
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
