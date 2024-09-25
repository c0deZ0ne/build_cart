import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BuilderGuard } from 'src/modules/auth/guards/builder.guard';
import { GetUser } from 'src/modules/auth/user.decorator';
import { User } from 'src/modules/user/models/user.model';
import { ContractService } from 'src/modules/contract/contract.service';
import { RateReviewService } from 'src/modules/rate-review/rate-review.service';
import { CreateDisputeDto, RateReviewVendorDto } from './dto';
import { DisputeService } from '../dispute/dispute.service';
import { UseSubscription } from '../platfrom-subscription/platform-subscription.decorator';

@Controller('builder')
@ApiTags('builder')
@ApiBearerAuth()
  @UseGuards(BuilderGuard)
    @UseSubscription()

export class ContractController {
  constructor(
    private readonly contractService: ContractService,
    private readonly rateReviewVendorService: RateReviewService,
    private readonly disputeService: DisputeService,
  ) {}

  @ApiOperation({
    summary: 'Retrieve orderss',
  })
  @Get('order')
  async getContracts(@GetUser() user: User) {
    return await this.contractService.getAllNonArchivedContractsForUser(user);
  }

  @ApiOperation({
    summary: 'Retrieve archived orders',
  })
  @Get('order/archive')
  async getArchivedContracts(@GetUser() user: User) {
    return await this.contractService.getAllArchivedContractsForUser(user);
  }

  @ApiOperation({
    summary: 'Retrieve order details',
  })
  @Get('order/:id')
  async getContractDetailsByIdForUser(
    @Param('id') id: string,
    @GetUser() user: User,
  ) {
    return await this.contractService.getContractDetailsByIdForUser(id, user);
  }
  @ApiOperation({
    summary: 'Retrieve order details by project',
  })
  @Get('order/:ProjectId/details')
  async getOrderDetail(@Param('ProjectId') ProjectId: string) {
    return await this.contractService.getOrderDetailsByProjectId(ProjectId);
  }

  @ApiOperation({
    summary: 'Archive order',
  })
  @Patch('order/:id/archive')
  async archiveContract(
    @Param('id') contractId: string,
    @GetUser() user: User,
  ) {
    await this.contractService.archiveContractForUser(contractId, user);
  }

  @ApiOperation({
    summary: 'Rate and review the order service',
  })
  @Post('order/:id/rate-review')
  async rateAndReviewVendor(
    @Body(ValidationPipe) rateReviewVendorDto: RateReviewVendorDto,
    @GetUser() user: User,
    @Param('id') contractId: string,
  ) {
    await this.rateReviewVendorService.rateAndReviewVendor(
      rateReviewVendorDto,
      user,
      contractId,
    );
  }

  @ApiOperation({
    summary: 'Create a Dispute for a order',
  })
  @Post('/report/:id')
  async createDispute(
    @Body(ValidationPipe) createDisputeDto: CreateDisputeDto,
    @GetUser() user: User,
    @Param('id') contractId: string,
  ) {
    await this.disputeService.createDispute(createDisputeDto, contractId, user);
  }
}
