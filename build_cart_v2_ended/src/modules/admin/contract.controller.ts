import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ContractService } from 'src/modules/contract/contract.service';
import { AdminGuard } from 'src/modules/auth/guards/admin.guard';
import { GetUser } from 'src/modules/auth/user.decorator';
import { User } from 'src/modules/user/models/user.model';

@Controller('admin')
@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(AdminGuard)
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @ApiOperation({
    summary: 'Retrieve contracts',
  })
  @Get('/contract')
  async getContracts(@GetUser() user: User) {
    return await this.contractService.getAllContractsForUser(user);
  }

  @ApiOperation({
    summary: 'Retrieve details of a contract',
  })
  @Get('/contract/:id')
  async getContractById(
    @Param('id') contractId: string,
    @GetUser() user: User,
  ) {
    return await this.contractService.getContractByIdForUser(
      contractId,
      user,
      true,
    );
  }

  @ApiOperation({
    summary: 'Disburse payment for a contract',
  })
  @Patch('/contract/:id/disburse')
  async disburseContractPayment(
    @Param('id') contractId: string,
    @GetUser() user: User,
  ) {
    await this.contractService.disburseContractPayment(contractId, user);
  }
}
