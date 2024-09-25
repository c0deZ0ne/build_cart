import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TicketService } from 'src/modules/ticket/ticket.service';
import { AdminGuard } from 'src/modules/auth/guards/admin.guard';
import { GetUser } from 'src/modules/auth/user.decorator';
import { User } from 'src/modules/user/models/user.model';

@Controller('admin')
@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(AdminGuard)
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @ApiOperation({
    summary: 'Retrieve tickets',
  })
  @Get('/ticket')
  async getTickets(@GetUser() user: User) {
    return await this.ticketService.getAllTickets(user);
  }

  @ApiOperation({
    summary: 'Retrieve details of a ticket',
  })
  @Get('/ticket/:id')
  async getTicketById(@Param('id') ticketId: string, @GetUser() user: User) {
    return await this.ticketService.getTicketByIdForUser(ticketId, user);
  }

  @ApiOperation({
    summary: 'Process a ticket',
  })
  @Patch('/ticket/:id/process')
  async processTicket(@Param('id') ticketId: string, @GetUser() user: User) {
    return await this.ticketService.processTicket(ticketId, user);
  }

  @ApiOperation({
    summary: 'Resolve a ticket',
  })
  @Patch('/ticket/:id/resolve')
  async resolveTicket(@Param('id') ticketId: string, @GetUser() user: User) {
    return await this.ticketService.resolveTicket(ticketId, user);
  }
}
