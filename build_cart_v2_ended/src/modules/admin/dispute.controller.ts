import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DisputeService } from 'src/modules/dispute/dispute.service';
import { AdminGuard } from 'src/modules/auth/guards/admin.guard';
import { GetUser } from 'src/modules/auth/user.decorator';
import { User } from 'src/modules/user/models/user.model';

@Controller('admin')
@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(AdminGuard)
export class DisputeController {
  constructor(private readonly disputeService: DisputeService) {}

  @ApiOperation({
    summary: 'Retrieve all disputes',
  })
  @Get('/disputes')
  async getAllDisputes() {
    return await this.disputeService.getAllDisputes(true);
  }

  @ApiOperation({
    summary: 'Retrieve disputes by Id',
  })
  @Get('/dispute/:id')
  async getDisputeById(@Param('id') disputeId: string) {
    return await this.disputeService.getDisputeById(disputeId, true);
  }

  @ApiOperation({
    summary: 'Resolve Dispute',
  })
  @Patch('/dispute/:id/resolve')
  async resolveDispute(@Param('id') disputeId: string, @GetUser() user: User) {
    return await this.disputeService.resolveDispute(disputeId, user);
  }

  @ApiOperation({
    summary: 'Refund Dispute',
  })
  @Patch('/dispute/:id/refund')
  async refund(@Param('id') disputeId: string, @GetUser() user: User) {
    await this.disputeService.refund(disputeId, user);
  }
}
