import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Table,
} from 'sequelize-typescript';
import { Builder } from 'src/modules/builder/models/builder.model';
import { BaseModel } from 'src/modules/database/base.model';
import { Project } from 'src/modules/project/models/project.model';
import { User } from 'src/modules/user/models/user.model';
import { RfqRequestMaterial } from './rfqRequestMaterial.model';
import { RfqQuote } from './rfqQuote.model';
import { FundManager } from 'src/modules/fund-manager/models/fundManager.model';
import { Order } from 'src/modules/order/models';

export enum RfqRequestStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  CANCELLED = 'CANCELLED',
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  FLAGGED = 'FLAGGED',
  DRAFT = 'DRAFT',
}

export enum RfqRequestPaymentTerm {
  ESCROW = 'ESCROW',
  CREDIT = 'CREDIT',
  BNPL = 'BNPL',
  PAY_ON_DELIVERY = 'PAY_ON_DELIVERY',
}

export enum RfqRequestType {
  PUBLIC = 'PUBLIC',
  INVITATION = 'INVITATION',
}

@Table({
  paranoid: true,
})
export class RfqRequest extends BaseModel<RfqRequest> {
  @Column
  title: string;

  @Column(DataType.ENUM(...Object.values(RfqRequestStatus)))
  status: RfqRequestStatus;

  @Column
  budgetVisibility: boolean;

  @Column(DataType.DECIMAL(10, 2))
  totalBudget: number;

  @Column({
    type: DataType.ENUM(...Object.values(RfqRequestPaymentTerm)),
    defaultValue: RfqRequestPaymentTerm.ESCROW,
  })
  paymentTerm?: RfqRequestPaymentTerm;

  @Column(DataType.DATE)
  deliveryDate: Date;

  @Column
  deliveryAddress: string;

  @Column
  deliveryContactNumber: string;

  @Column({ allowNull: true })
  deliveryInstructions?: string | null;

  @Column(DataType.DATE)
  quoteDeadline?: Date;

  @Column(DataType.ENUM(...Object.values(RfqRequestType)))
  requestType: RfqRequestType;

  @Column
  tax: boolean;

  @Column(DataType.DATE)
  createdAt: Date;

  @Column(DataType.DATE)
  updatedAt: Date;

  @Column(DataType.DECIMAL(5, 2))
  taxPercentage: number | null;

  @Column
  lpo: string | null;

  @Column
  isArchived: boolean;

  @Column
  isSaved?: boolean;

  @ForeignKey(() => Project)
  @Column({ type: DataType.UUID, allowNull: false })
  ProjectId: string;

  @BelongsTo(() => Project, { foreignKey: 'ProjectId' })
  Project?: Project;

  @ForeignKey(() => Builder)
  @Column({ type: DataType.UUID, allowNull: true })
  BuilderId?: string;

  @BelongsTo(() => Builder, { foreignKey: 'BuilderId' })
  Builder?: Builder;

  @ForeignKey(() => FundManager)
  @Column({ type: DataType.UUID, allowNull: true })
  FundManagerId?: string;

  @BelongsTo(() => FundManager, { foreignKey: 'FundManagerId' })
  FundManager?: FundManager;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  CreatedById: string;

  @BelongsTo(() => User, { foreignKey: 'CreatedById' })
  CreatedBy?: User;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: true })
  UpdatedById: string | null;

  @BelongsTo(() => User, { foreignKey: 'UpdatedById' })
  UpdatedBy?: User;

  @HasMany(() => RfqRequestMaterial)
  RfqRequestMaterials?: RfqRequestMaterial[];

  @Column(DataType.JSONB)
  deliverySchedule: {
    dueDate: Date;
    quantity: number;
    description: string;
  }[];

  @HasMany(() => RfqQuote)
  RfqQuotes?: RfqQuote[];

  @HasMany(() => Order)
  orders?: Order[];

  @Column
  migratedAt: Date | null;
}
