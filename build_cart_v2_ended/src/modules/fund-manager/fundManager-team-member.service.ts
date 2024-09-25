import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { TeamMember } from '../rbac/models/user-teammembers.model';
import { Sequelize } from 'sequelize-typescript';
import { Transaction } from 'sequelize';
import { CreateTeamMemberDto } from '../rbac/dtos/create-teamMember.dto';

@Injectable()
export class SponsorTeamMemberService {
  constructor(
    @InjectModel(TeamMember) private teamMemberModel: typeof TeamMember,
    private readonly sequelize: Sequelize,
  ) {}

  /**
   * Create a new FundManager Team Member.
   *
   * @param createTeamMemberDto - The data for creating the team member.
   * @returns The newly created Team Member instance.
   */
  async create({
    body,
    dbTransaction,
  }: {
    body: CreateTeamMemberDto;
    dbTransaction?: Transaction;
  }): Promise<TeamMember> {
    try {
      if (!dbTransaction) {
        dbTransaction = await this.sequelize.transaction();
      }
      const data = this.teamMemberModel.create(
        { ...body },
        { transaction: dbTransaction },
      );
      await dbTransaction.commit();
      return data;
    } catch (error) {
      dbTransaction.rollback();
    }
  }

  /**
   * Get all FundManager Team Members.
   *
   * @returns An array of Team Member instances.
   */
  async findAll(): Promise<TeamMember[]> {
    return this.teamMemberModel.findAll();
  }

  /**
   * Find a FundManager Team Member by its ID.
   *
   * @param id - The ID of the team member to find.
   * @returns The Team Member instance if found, otherwise null.
   */
  async findById(id: string): Promise<TeamMember> {
    return this.teamMemberModel.findByPk(id);
  }

  /**
   * Update a FundManager Team Member by its ID.
   *
   * @param id - The ID of the team member to update.
   * @param updateTeamMemberDto - The data for updating the team member.
   * @returns The updated Team Member instance.
   */
  async update(id: string, updateTeamMemberDto: CreateTeamMemberDto) {
    return this.teamMemberModel.update(updateTeamMemberDto, {
      where: { id },
      returning: true,
    });
  }

  /**
   * Remove a FundManager Team Member by its ID.
   *
   * @param id - The ID of the team member to remove.
   */
  async remove(id: string): Promise<void> {
    const teamMember = await this.findById(id);
    if (teamMember) {
      await teamMember.destroy();
    }
  }
}
