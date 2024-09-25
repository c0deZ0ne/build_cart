import {
  Column,
  ForeignKey,
  Table,
  BelongsTo,
  DataType,
  HasMany,
} from 'sequelize-typescript';
import { BaseModel } from 'src/modules/database/base.model';
import { User } from 'src/modules/user/models/user.model';
import { RfqItem } from './rfqItem.model';
import { RfqRequest } from './rfqRequest.model';
import { RfqCategory } from './rfqCategory.model';
import { RfqQuoteMaterial } from './rfqQuoteMaterial.model';
import { Project } from 'src/modules/project/models/project.model';
import { UserUploadMaterial } from 'src/modules/material-schedule-upload/models/material.model';
import { RfqQuote } from './rfqQuote.model';

export enum RfqRequestMaterialStatus {
  ONGOING = 'ONGOING',
  REOPENED = 'REOPENED',
  ClOSED = 'ClOSED',
}

@Table({
  paranoid: true,
})
export class RfqRequestMaterial extends BaseModel<RfqRequestMaterial> {
  @ForeignKey(() => RfqRequest)
  @Column({ type: DataType.UUID, allowNull: false })
  RfqRequestId: string;

  @BelongsTo(() => RfqRequest, { foreignKey: 'RfqRequestId' })
  RfqRequest?: RfqRequest;

  @ForeignKey(() => Project)
  @Column({ type: DataType.UUID, allowNull: false })
  ProjectId: string;

  @BelongsTo(() => Project, { foreignKey: 'ProjectId' })
  Project?: Project;

  @ForeignKey(() => RfqItem)
  @Column({ type: DataType.UUID, allowNull: true })
  RfqItemId: string;

  @BelongsTo(() => RfqItem, { foreignKey: 'RfqItemId' })
  RfqItem: RfqItem;

  @ForeignKey(() => UserUploadMaterial)
  @Column({ type: DataType.UUID, allowNull: true })
  UserUploadMaterialId: string | null;

  @BelongsTo(() => UserUploadMaterial, { foreignKey: 'UserUploadMaterialId' })
  userUploadMaterial: UserUploadMaterial | null;

  @ForeignKey(() => RfqCategory)
  @Column({ type: DataType.UUID, allowNull: false })
  rfqCategoryId: string;

  @BelongsTo(() => RfqCategory, { foreignKey: 'rfqCategoryId' })
  category: RfqCategory;

  @Column
  name: string;

  @Column({ type: DataType.TEXT })
  description: string;

  @Column({ type: DataType.STRING, allowNull: true })
  specification: string;

  @Column(DataType.DECIMAL(10, 2))
  quantity: number;

  @Column
  metric: string;

  @Column(DataType.DECIMAL(10, 2))
  budget: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  CreatedById: string;

  @BelongsTo(() => User, { foreignKey: 'CreatedById' })
  CreatedBy?: User;

  @Column({
    type: DataType.ENUM(...Object.values(RfqRequestMaterialStatus)),
    defaultValue: RfqRequestMaterialStatus.ONGOING,
  })
  status: RfqRequestMaterialStatus;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: true })
  UpdatedById: string | null;

  @BelongsTo(() => User, { foreignKey: 'UpdatedById' })
  UpdatedBy?: User;

  @HasMany(() => RfqQuote)
  vendorBids: RfqQuote[];
}
