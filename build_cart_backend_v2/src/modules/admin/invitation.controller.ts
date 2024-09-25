import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from 'src/modules/auth/guards/admin.guard';
import { InvitationService } from '../invitation/invitation.service';

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(AdminGuard)
@Controller('admin')
export class InvitationController {
  constructor(private readonly invitationService: InvitationService) {}

  @ApiOperation({
    summary: 'Get all system invitations',
  })
  @Get('/all/invites')
  async getAllInvitations() {
    return await this.invitationService.getAllInvitations();
  }
}
