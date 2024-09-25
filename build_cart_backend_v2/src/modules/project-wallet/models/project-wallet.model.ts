import {
  Column,
  Table,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
  BelongsToMany,
} from 'sequelize-typescript';
import { BaseModel } from 'src/modules/database/base.model';
import { ProjectTransaction } from 'src/modules/project-wallet-transaction/models/project-transaction.model';
import { Project } from 'src/modules/project/models/project.model';
import { UserProjectWallet } from 'src/modules/shared-wallet-transaction/shared-wallet.model';
import { User } from 'src/modules/user/models/user.model';

@Table({
  paranoid: true,
})
export class ProjectWallet extends BaseModel<ProjectWallet> {
  @ForeignKey(() => Project)
  @Column({ type: DataType.UUID })
  ProjectId: string;

  @BelongsTo(() => Project)
  Project: Project;

  @Column({ type: DataType.DECIMAL(15, 2), defaultValue: 0 })
  balance: number;

  @Column({ type: DataType.DECIMAL(15, 2), defaultValue: 0 })
  totalCredit: number;

  @Column({ type: DataType.DECIMAL(15, 2), defaultValue: 0 })
  ActualSpend: number;

  @HasMany(() => ProjectTransaction)
  transactions: ProjectTransaction[];

  @BelongsToMany(() => User, () => UserProjectWallet)
  Users: User[];
}
