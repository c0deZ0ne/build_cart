import {
  Column,
  Table,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from 'src/modules/user/models/user.model';
import { ProjectWallet } from '../project-wallet/models/project-wallet.model';
import { BaseModel } from '../database/base.model';

@Table({
  paranoid: true,
})
export class UserProjectWallet extends BaseModel<UserProjectWallet> {
  @ForeignKey(() => User)
  @Column({ type: DataType.UUID })
  UserId: string;

  @BelongsTo(() => User)
  User: User;

  @ForeignKey(() => ProjectWallet)
  @Column({ type: DataType.UUID })
  ProjectWalletId: string;

  @BelongsTo(() => ProjectWallet)
  ProjectWallet: ProjectWallet;
}
