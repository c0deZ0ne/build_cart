import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from 'src/modules/database/base.model';
import { SubBlog } from './subBlog.model';
import { User } from 'src/modules/user/models/user.model';

@Table({
  paranoid: true,
})
export class Blog extends BaseModel<Blog> {
  @Column({ type: DataType.STRING(500000) })
  blogTitle: string;

  @Column({ type: DataType.TEXT })
  blogContent: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID })
  UserId: string;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: true })
  CreatedById: string | null;

  @BelongsTo(() => User, { foreignKey: 'CreatedById', onDelete: 'SET NULL' })
  CreatedBy?: User;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: true })
  UpdatedById: string | null;

  @BelongsTo(() => User, { foreignKey: 'UpdatedById', onDelete: 'SET NULL' })
  UpdatedBy?: User;

  @Column
  image: string;

  @Column
  postedBy: string | null;

  @Column
  EditedBy: string | null;

  @HasMany(() => SubBlog)
  SubBlog?: SubBlog[];
}
