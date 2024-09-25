import {
  Column,
  HasMany,
  DataType,
  Table,
  BelongsTo,
  AllowNull,
  ForeignKey,
} from 'sequelize-typescript';
import { BaseModel } from 'src/modules/database/base.model';
import { Project } from 'src/modules/project/models/project.model';
import { User } from 'src/modules/user/models/user.model';
import { UserUploadMaterial } from './material.model';

@Table({
  paranoid: true,
})
export class MaterialSchedule extends BaseModel<MaterialSchedule> {
  @Column(DataType.STRING)
  title: string;

  @Column({ type: DataType.STRING, allowNull: true })
  csvUrl?: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  ownerId: string | null;
  @BelongsTo(() => User, {
    foreignKey: 'ownerId',
    onDelete: 'CASCADE',
  })
  owner: User;

  @ForeignKey(() => Project)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  ProjectId: string | null;

  @BelongsTo(() => Project, {
    foreignKey: 'ProjectId',
    onDelete: 'CASCADE',
  })
  project: Project | null;

  @Column
  migratedAt: Date | null;

  @Column
  createdAt: Date;

  @Column
  updatedAt: Date;

  @Column
  deletedAt: Date;

  @HasMany(() => UserUploadMaterial, {
    foreignKey: 'materialScheduleId',
    onDelete: 'CASCADE',
  })
  userUploadMaterial: UserUploadMaterial[];
}
