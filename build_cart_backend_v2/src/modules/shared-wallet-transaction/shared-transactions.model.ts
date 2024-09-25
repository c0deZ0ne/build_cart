import {
  Column,
  Table,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from 'src/modules/user/models/user.model';
import { ProjectTransaction } from '../project-wallet-transaction/models/project-transaction.model';
import { BaseModel } from '../database/base.model';
import { Builder } from '../builder/models/builder.model';
import { Project } from '../project/models/project.model';
import { FundManager } from '../fund-manager/models/fundManager.model';
import { Payment } from '../payment/models/payment.model';
import { Contract } from '../contract/models';

@Table({
  paranoid: true,
})
export class ProjectTransactionUser extends BaseModel<ProjectTransactionUser> {
  @ForeignKey(() => ProjectTransaction)
  @Column({ type: DataType.UUID })
  ProjectTransactionId: string;

  @BelongsTo(() => ProjectTransaction)
  projectTransaction: ProjectTransaction;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID })
  UserId: string;

  @BelongsTo(() => User)
  User: User;

  @ForeignKey(() => Contract)
  @Column({ type: DataType.UUID })
  ContractId: string;

  @BelongsTo(() => Contract)
  Contract: Contract;

  @ForeignKey(() => Builder)
  @Column({ type: DataType.UUID })
  BuilderId: string;

  @BelongsTo(() => Builder)
  builder: Builder;

  @ForeignKey(() => Project)
  @Column({ type: DataType.UUID })
  ProjectId: string;

  @BelongsTo(() => Project)
  Project: Project;

  @ForeignKey(() => FundManager)
  @Column({ type: DataType.UUID })
  FundManagerId: string;

  @BelongsTo(() => FundManager)
  FundManager: FundManager;

  @ForeignKey(() => Payment)
  @Column({ type: DataType.UUID })
  PaymentId: string;

  @BelongsTo(() => Payment)
  payment: Payment;

  @Column({ type: DataType.UUID })
  vend_token: string;

  @Column({ type: DataType.FLOAT })
  amount: number;
}
