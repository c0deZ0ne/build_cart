import {
  Column,
  HasMany,
  DataType,
  Table,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { BaseModel } from 'src/modules/database/base.model';
import { User } from 'src/modules/user/models/user.model';
import { MaterialSchedule } from './material-schedule.model';

@Table({
  paranoid: true,
})
export class UserUploadMaterial extends BaseModel<UserUploadMaterial> {
  @Column(DataType.STRING)
  name: string;

  @Column(DataType.STRING)
  category: string;

  @Column({
    type: DataType.STRING,
    defaultValue: null,
  })
  description: string | null;
  @Column({
    type: DataType.DECIMAL,
    defaultValue: 0,
  })
  budget: number | null;

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

  @ForeignKey(() => MaterialSchedule)
  @Column({ type: DataType.UUID, allowNull: false })
  materialScheduleId: string;

  @BelongsTo(() => MaterialSchedule, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    foreignKey: 'materialScheduleId',
  })
  materialSchedule: MaterialSchedule;

  @Column
  createdAt: Date;

  @Column
  updatedAt: Date;

  @Column
  deletedAt: Date;

  @Column
  migratedAt: Date | null;
}
