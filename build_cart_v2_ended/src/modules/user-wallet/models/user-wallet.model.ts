import {
  Column,
  Table,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { UserTransaction } from 'src/modules/user-wallet-transaction/models/user-transaction.model';
import { ProjectTransaction } from 'src/modules/project-wallet-transaction/models/project-transaction.model';
import { User } from 'src/modules/user/models/user.model';
import { BaseModel } from 'src/modules/database/base.model';

@Table({
  paranoid: true,
})
export class UserWallet extends BaseModel<UserWallet> {
  @ForeignKey(() => User)
  @Column({ type: DataType.UUID })
  UserId: string;

  @BelongsTo(() => User)
  User: User;

  @Column({ type: DataType.DECIMAL(15, 2), defaultValue: 0 })
  balance: number;

  @Column({ type: DataType.DECIMAL(15, 2), defaultValue: 0 })
  totalCredit: number;

  @Column({ type: DataType.DECIMAL(15, 2), defaultValue: 0 })
  ActualSpend: number;

  @Column({ type: DataType.BIGINT, allowNull: false })
  account_number: bigint;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: true })
  CreatedById?: string | null;

  @BelongsTo(() => User, { foreignKey: 'CreatedById', onDelete: 'SET NULL' })
  CreatedBy?: User | null;

  @HasMany(() => UserTransaction)
  transactions: UserTransaction[];

  @HasMany(() => ProjectTransaction)
  ProjectTransactions: ProjectTransaction[];
}
