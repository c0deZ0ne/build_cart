import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ContractService } from '../contract/contract.service';

@Controller('admin')
@ApiTags('admin')
@ApiBearerAuth()
// @UseGuards(AdminGuard)
export class AdminControllerPayment {
  constructor(private readonly contractService: ContractService) {}

  @ApiOperation({
    summary: 'admin approve payment for a contract',
  })
  @Get('/payment/:vend_token/approve')
  async confirmPayment(@Param('vend_token') vend_token: string) {
    await this.contractService.adminConfirmPayment(vend_token);
  }
}
