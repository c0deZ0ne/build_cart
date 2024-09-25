import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/modules/user/models/user.model';
import { CreateTicketDto } from 'src/modules/ticket/dto/create-ticket.dto';
import { Ticket, TicketStatus } from './models/ticket.model';

@Injectable()
export class TicketService {
  constructor(
    @InjectModel(Ticket)
    private readonly ticketModel: typeof Ticket,
  ) {}
  /**
   * Create a new ticket
   * @param user - The user opening the ticket
   * @param createTicketDto - DTO for creating a new ticket
   * @returns - The newly created ticket
   */
  async createTicket(
    user: User,
    createTicketDto: CreateTicketDto,
  ): Promise<Ticket> {
    return await this.ticketModel.create({
      subject: createTicketDto.subject,
      message: createTicketDto.message,
      UserId: user.id,
      BuilderId: user.BuilderId,
      VendorId: user.VendorId,
    });
  }

  /**
   * Updates ticket to processing
   * @param user - The user processing the ticket
   */
  async processTicket(ticketId: string, user: User) {
    const ticket = await this.getTicketByIdForUser(ticketId, user);
    if (ticket.status === TicketStatus.CLOSED) {
      throw new BadRequestException(`This ticket is already closed`);
    }

    if (ticket.status !== TicketStatus.OPEN) {
      throw new BadRequestException(`This ticket is no longer opened`);
    }

    await this.ticketModel.update(
      { status: TicketStatus.PROCESSING },
      { where: { id: ticketId } },
    );
  }

  /**
   * Updates ticket to resolved
   * @param user - The user resolving the ticket
   */
  async resolveTicket(ticketId: string, user: User) {
    const ticket = await this.getTicketByIdForUser(ticketId, user);
    if (ticket.status === TicketStatus.CLOSED) {
      throw new BadRequestException(`This ticket is already closed`);
    }

    if (ticket.status === TicketStatus.RESOLVED) {
      throw new BadRequestException(`This ticket is already resolved`);
    }

    await this.ticketModel.update(
      {
        status: TicketStatus.RESOLVED,
        ResolvedById: user.id,
        resolvedAt: new Date(),
      },
      { where: { id: ticketId } },
    );
  }

  /**
   * Updates ticket to closed
   * @param user - The user closing the ticket
   */
  async closeTicket(ticketId: string, user: User) {
    const ticket = await this.getTicketByIdForUser(ticketId, user);
    if (ticket.status === TicketStatus.CLOSED) {
      throw new BadRequestException(`This ticket is already closed`);
    }

    await this.ticketModel.update(
      {
        status: TicketStatus.CLOSED,
        ClosedById: user.id,
        closedAt: new Date(),
      },
      { where: { id: ticketId } },
    );
  }

  /**
   * Get all tickets
   * @param user - the user fetching the ticket
   * @returns - All tickets
   */
  async getAllTickets(user: User): Promise<Ticket[]> {
    return await this.ticketModel.findAll({
      where: this.getWhereOptionsForUser(user),
      include: [
        { model: User, as: 'User', attributes: ['id', 'name', 'email'] },
      ],
    });
  }

  /**
   * Fetch a ticket by id for user
   * @param ticketId - the id of the ticket to be fetched
   * @param user - the user fetching the ticket
   * @returns the fetched ticket
   */
  async getTicketByIdForUser(ticketId: string, user: User): Promise<Ticket> {
    return await this.ticketModel.findOrThrow({
      where: this.getWhereOptionsForUser(user, ticketId),
      include: [
        { model: User, as: 'User', attributes: ['id', 'name', 'email'] },
      ],
    });
  }

  getWhereOptionsForUser(user: User, id?: string) {
    const whereOptions: any = {};
    if (id) whereOptions.id = id;
    if (user.VendorId) whereOptions.VendorId = user.VendorId;
    if (user.BuilderId) whereOptions.BuilderId = user.BuilderId;

    return whereOptions;
  }
}
