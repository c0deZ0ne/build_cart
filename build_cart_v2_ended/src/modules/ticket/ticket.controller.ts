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
import { GetUser } from 'src/modules/auth/user.decorator';
import { User } from 'src/modules/user/models/user.model';
import { TicketService } from 'src/modules/ticket/ticket.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { CreateTicketDto } from './dto';

@Controller('ticket')
@ApiTags('ticket')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @ApiOperation({
    summary: 'Create a ticket',
  })
  @Post()
  async createTicket(
    @GetUser() user: User,
    @Body(ValidationPipe) createTicketDto: CreateTicketDto,
  ) {
    await this.ticketService.createTicket(user, createTicketDto);
  }

  @ApiOperation({
    summary: 'Retrieve all tickets',
  })
  @Get()
  async getAllTickets(@GetUser() user: User) {
    return await this.ticketService.getAllTickets(user);
  }

  @ApiOperation({
    summary: 'Get ticket details',
  })
  @Get(':id')
  async getTicket(@Param('id') ticketId: string, @GetUser() user: User) {
    return await this.ticketService.getTicketByIdForUser(ticketId, user);
  }

  @ApiOperation({
    summary: 'Close a ticket',
  })
  @Patch(':id/close')
  async closeTicket(@Param('id') ticketId: string, @GetUser() user: User) {
    return await this.ticketService.closeTicket(ticketId, user);
  }
}
