import {
  Table,
  Column,
  DataType,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { BaseModel } from 'src/modules/database/base.model';
import { FundManager } from 'src/modules/fund-manager/models/fundManager.model';
import { Project } from 'src/modules/project/models/project.model';
import { User } from 'src/modules/user/models/user.model';

@Table({
  paranoid: true,
})
export class Invitation extends BaseModel<Invitation> {
  @Column
  fundManagerName?: string | null;

  // Invitee Email
  @Column
  buyerEmail: string;

  // Invitee Name
  @Column
  buyerName: string;

  // Invitee Phone
  @Column({ allowNull: true })
  buyerPhone: string;

  @ForeignKey(() => FundManager)
  @Column({ type: DataType.UUID, allowNull: true })
  FundManagerId: string | null;

  @BelongsTo(() => FundManager, {
    foreignKey: 'FundManagerId',
    onDelete: 'SET NULL',
  })
  FundManager: string | null;

  @ForeignKey(() => Project)
  @Column({ type: DataType.UUID, allowNull: true })
  projectId?: string | null;

  @BelongsTo(() => Project, {
    foreignKey: 'projectId',
    onDelete: 'SET NULL',
  })
  project?: Project | null;

  @Column
  migratedAt: Date | null;

  // Who is sending the invite
  @Column({ type: DataType.UUID, allowNull: true })
  CreatedById?: string | null;

  @BelongsTo(() => User, { foreignKey: 'CreatedById', onDelete: 'SET NULL' })
  CreatedBy: User;
}
