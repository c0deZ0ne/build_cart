import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from 'src/modules/user/models/user.model';
import { SubscriptionStatus, SubscriptionType } from '../types';
import { BaseModel } from 'src/modules/database/base.model';

@Table({  paranoid: true})
export class Subscription extends BaseModel<Subscription> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    allowNull: false,
  })
  id: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  userId: string;    
     @Column({
    type: DataType.ENUM(...Object.values(SubscriptionType)),
    allowNull: false,
     })
         
  type?: SubscriptionType;
     @Column({
    type: DataType.ENUM(...Object.values(SubscriptionStatus)),
    allowNull: false,
  })
  status?: SubscriptionStatus;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  usedTrialPeriod: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  expirationDate: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  deletedAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  createdAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  updatedAt: Date;

  @BelongsTo(() => User)
  user: User;
}
