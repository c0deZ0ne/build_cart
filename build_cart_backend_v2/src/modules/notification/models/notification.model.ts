import { BelongsTo, Column, DataType, Table } from 'sequelize-typescript';
import { BaseModel } from 'src/modules/database/base.model';
import { User } from 'src/modules/user/models/user.model';

@Table({ paranoid: true })
export class Notification extends BaseModel<Notification> {
  @Column(DataType.STRING)
  message: string;

  @Column(DataType.STRING)
  logo: string;

  @Column({ type: DataType.UUID, allowNull: true })
  UserId?: string | null;

  @BelongsTo(() => User, { foreignKey: 'UserId', onDelete: 'CASCADE' })
  user: User;

  @Column(DataType.BOOLEAN)
  isRead: boolean;

  @Column(DataType.JSONB)
  ctas: { label: string; url: string }[];
}
