import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { ContractService } from 'src/modules/contract/contract.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { VendorGuard } from 'src/modules/auth/guards/vendor.guard';
import { GetUser } from 'src/modules/auth/user.decorator';
import { User } from 'src/modules/user/models/user.model';
import { VendorOrderService } from './vendor-order.services';
import { DispatchDto } from './dto/create-rfq-quote.dto';

@Controller('vendor')
@ApiTags('vendor')
@ApiBearerAuth()
@UseGuards(VendorGuard)
export class ContractController {
  constructor(
    private readonly contractService: ContractService,
    private readonly vendorOrderService: VendorOrderService,
  ) {}

  @ApiOperation({
    summary: 'Retrieve contracts',
  })
  @Get('/contract')
  async getContracts(@GetUser() user: User) {
    return await this.contractService.getAllContractsForUser(user);
  }

  @ApiOperation({
    summary: 'Retrieve contract details',
  })
  @Get('/contract/:id')
  async getContractDetailsByIdForUser(
    @Param('id') id: string,
    @GetUser() user: User,
  ) {
    return await this.contractService.getContractDetailsByIdForUser(id, user);
  }

  @ApiOperation({
    summary: 'Cancel contract',
  })
  @Patch('/contract/:id/cancel')
  async cancelContract(@Param('id') contractId: string, @GetUser() user: User) {
    await this.contractService.cancelContract(contractId, user);
  }

  @ApiOperation({
    summary: 'Dispatch contract',
  })
  @Patch('/contract/:contractId/dispatch/:deliveryScheduleId')
  async dispatchContract(
    @Param('contractId') contractId: string,
    @Param('deliveryScheduleId') deliveryId: string,
    @Body() dispatchDto: DispatchDto,
    @GetUser() user: User,
  ) {
    return await this.vendorOrderService.dispatchOrder(
      contractId,
      deliveryId,
      dispatchDto,
      user,
    );
  }

  @ApiOperation({
    summary: 'Accept Contract',
  })
  @Patch('/contract/:id/accept-contract')
  async acceptContract(@GetUser() user: User, @Param('id') contractId: string) {
    return await this.contractService.acceptContract({ contractId, user });
  }
}
