import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { Builder } from 'src/modules/builder/models/builder.model';
import { BaseModel } from 'src/modules/database/base.model';
import { FundManager } from 'src/modules/fund-manager/models/fundManager.model';
import { Project } from 'src/modules/project/models/project.model';
import { User } from 'src/modules/user/models/user.model';
import { Vendor } from 'src/modules/vendor/models/vendor.model';

export enum DocumentsStatus {
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  PENDING = 'PENDING',
  REVIEW = 'REVIEW',
}

@Table({
  paranoid: true,
})
export class Documents extends BaseModel<Documents> {
  @Column
  recordId: string | null;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID })
  UserId: string;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => FundManager)
  @Column({ type: DataType.UUID, allowNull: true })
  FundManagerId: string;

  @BelongsTo(() => FundManager)
  fundManager: FundManager;

  @Column({ type: DataType.STRING, allowNull: true })
  businessCertificate: string | null;

  @Column({ type: DataType.STRING, allowNull: true })
  vatCertificate: string | null;

  @Column({ type: DataType.STRING, allowNull: true })
  insuranceCertificate: string | null;

  @Column({ type: DataType.STRING, allowNull: true })
  proofOfIdentity: string | null;

  @Column({ type: DataType.STRING, allowNull: true })
  confirmationOfAddress: string | null;

  @Column({ type: DataType.JSONB, allowNull: false, defaultValue: {} })
  others: Record<string, string>;

  @Column({
    type: DataType.ENUM(...Object.values(DocumentsStatus)),
    defaultValue: DocumentsStatus.PENDING,
  })
  status: DocumentsStatus;

  @ForeignKey(() => Vendor)
  @Column({ type: DataType.UUID, allowNull: true })
  VendorId: string;

  @BelongsTo(() => Vendor)
  Vendor: Vendor;

  @ForeignKey(() => Builder)
  @Column({ type: DataType.UUID, allowNull: true })
  BuilderId: string;

  @BelongsTo(() => Builder)
  Builder: Builder;

  @ForeignKey(() => Project)
  @Column({ type: DataType.UUID })
  projectId: string;

  @BelongsTo(() => Project)
  project: Project;

  @Column
  migratedAt: Date | null;
}
