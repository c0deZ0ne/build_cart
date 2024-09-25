import { Table, Column, ForeignKey } from 'sequelize-typescript';
import { Role } from './role.model';
import { TeamMember } from './user-teammembers.model';
import { BaseModel } from 'src/modules/database/base.model';

@Table({
  paranoid: true,
})
export class TeamMemberRoles extends BaseModel<TeamMemberRoles> {
  @ForeignKey(() => TeamMember)
  @Column
  TeamMemberId: string;

  @ForeignKey(() => Role)
  @Column
  RoleId: string;
}
