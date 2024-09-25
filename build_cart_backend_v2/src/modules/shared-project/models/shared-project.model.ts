import {
  Table,
  Column,
  DataType,
  BelongsTo,
  ForeignKey,
  BelongsToMany,
} from 'sequelize-typescript';
import { Builder } from 'src/modules/builder/models/builder.model';
import { BaseModel } from 'src/modules/database/base.model';
import { FundManager } from 'src/modules/fund-manager/models/fundManager.model';
import { MyProject } from 'src/modules/my-project/models/myProjects.model';
import { MyFundManager } from 'src/modules/my-fundManager/models/myFundManager.model';
import { Project } from 'src/modules/project/models/project.model';
import { User } from 'src/modules/user/models/user.model';

export enum SharedProjectStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
}

@Table({
  paranoid: true,
})
export class SharedProject extends BaseModel<SharedProject> {
  @Column
  email?: string | null;

  @Column
  buyerEmail: string;

  @Column
  fundManagerEmail: string;

  @Column({
    type: DataType.ENUM(...Object.values(SharedProjectStatus)),
    defaultValue: SharedProjectStatus.PENDING,
    allowNull: false,
  })
  status: SharedProjectStatus;

  @ForeignKey(() => Project)
  @Column({ type: DataType.UUID, allowNull: false })
  ProjectId: string;

  @BelongsTo(() => Project)
  Project: Project;

  @ForeignKey(() => FundManager)
  @Column({ type: DataType.UUID, allowNull: true })
  FundManagerId: string;

  @BelongsTo(() => FundManager)
  FundManager: FundManager;

  @ForeignKey(() => Builder)
  @Column({ type: DataType.UUID, allowNull: true })
  BuilderId: string;

  @BelongsTo(() => Builder)
  Builder: Builder;

  @BelongsToMany(() => User, () => MyProject)
  Users: User[];

  @Column
  migratedAt: Date | null;

  @Column({ type: DataType.UUID, allowNull: false })
  CreatedById?: string;

  @ForeignKey(() => MyFundManager)
  @Column({ type: DataType.UUID })
  MyFundManagerId?: string;

  @BelongsTo(() => User, { foreignKey: 'CreatedById', onDelete: 'SET NULL' })
  CreatedBy: User;
}
