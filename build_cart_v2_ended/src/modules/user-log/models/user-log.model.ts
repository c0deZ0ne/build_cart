import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';

import { BaseModel } from 'src/modules/database/base.model';
import { User } from 'src/modules/user/models/user.model';

@Table({
  paranoid: true,
})
export class UserLog extends BaseModel<UserLog> {
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  teamMemberId: string;

  @BelongsTo(() => User, {
    foreignKey: 'teamMemberId',
    onDelete: 'CASCADE',
  })
  teamMember: User;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  activityTitle: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  activityDescription: string;
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  deletedAt: Date;
}
