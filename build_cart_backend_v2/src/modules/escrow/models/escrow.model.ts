import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { Contract } from 'src/modules/contract/models';

import { BaseModel } from 'src/modules/database/base.model';
import { Order } from 'src/modules/order/models';
import { Project } from 'src/modules/project/models/project.model';
import { RfqRequest } from 'src/modules/rfq/models';

export enum EscrowStatus {
  PENDING = 'PENDING',
  CANCELLED = 'CANCELLED',
  CLOSED = 'CLOSED',
  COMPLETED = 'COMPLETED',
}

@Table({
  paranoid: true,
})
export class Escrow extends BaseModel<Escrow> {
  @ForeignKey(() => Order)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  orderId: string;

  @BelongsTo(() => Order, {
    foreignKey: 'orderId',
  })
  order: Order;

  @ForeignKey(() => Contract)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  contractId: string;

  @BelongsTo(() => Contract, {
    foreignKey: 'contractId',
  })
  contract: Contract;

  @ForeignKey(() => Project)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  projectId: string;

  @BelongsTo(() => Project, {
    foreignKey: 'projectId',
  })
  project: Project;

  @ForeignKey(() => RfqRequest)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  rfqRequestId: string;

  @BelongsTo(() => RfqRequest, {
    foreignKey: 'rfqRequestId',
  })
  rfqRequest: RfqRequest;

  @Column(DataType.DECIMAL(10, 2))
  initialPrice: number;

  @Column({})
  commisionPercentage: number;

  @Column(DataType.DECIMAL(10, 2))
  commisionValue: number;

  @Column(DataType.DECIMAL(10, 2))
  finalAmount: number;

  @Column(DataType.ENUM(...Object.values(EscrowStatus)))
  status: EscrowStatus;
}
