import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from 'src/modules/database/base.model';
import { Blog } from './blog.model';

@Table({
  paranoid: true,
})
export class SubBlog extends BaseModel<SubBlog> {
  @ForeignKey(() => Blog)
  @Column(DataType.UUID)
  BlogId: string;

  @BelongsTo(() => Blog)
  Blog?: Blog;

  @Column({ type: DataType.STRING(500000) })
  subTitle: string | null;

  @Column({ type: DataType.STRING(500000) })
  subContent: string | null;
}
