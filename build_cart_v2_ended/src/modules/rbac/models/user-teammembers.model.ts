import {
  Table,
  Column,
  ForeignKey,
  BelongsTo,
  BelongsToMany,
  DataType,
} from 'sequelize-typescript';
import { Team } from './team.model';
import { User } from 'src/modules/user/models/user.model';
import { BaseModel } from 'src/modules/database/base.model';
import { Role } from './role.model';
import { TeamMemberRoles } from './team-member-role.model';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export enum MEMBER_POSITION {
  ADMIN = 'ADMIN',
  OWNER = 'OWNER',
  SUPER_ADMIN = 'SUPER_ADMIN',
  MEMBER = 'MEMBER',
}

@Table({
  paranoid: true,
})
export class TeamMember extends BaseModel<TeamMember> {
  @ForeignKey(() => Team)
  @Column
  TeamId: string;

  @ForeignKey(() => User)
  @Column
  UserId: string;

  @Column({
    type: DataType.ENUM(...Object.values(MEMBER_POSITION)),
    allowNull: false,
  })
  position: MEMBER_POSITION;

  @BelongsTo(() => Team)
  team: Team;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: true })
  createdById: string;

  @BelongsTo(() => User, {
    foreignKey: 'createdById',
    as: 'createdBy',
    onDelete: 'SET NULL',
  })
  createdBy: User;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: true })
  updatedById: string | null;

  @BelongsTo(() => User, {
    foreignKey: 'updatedById',
    as: 'updatedBy',
    onDelete: 'SET NULL',
  })
  updatedBy?: User;

  @ApiProperty({
    type: Date,
    description: 'date created',
    example: new Date(),
  })
  @IsOptional()
  createdAt: Date;

  @ApiProperty({
    type: Date,
    description: 'date created',
    example: new Date(),
  })
  @IsOptional()
  updatedAt: Date;

  @BelongsToMany(() => Role, () => TeamMemberRoles)
  roles: Role[];
}
