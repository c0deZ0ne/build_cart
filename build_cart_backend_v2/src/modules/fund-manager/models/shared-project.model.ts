import {
  Table,
  Model,
  ForeignKey,
  BelongsTo,
  Column,
} from 'sequelize-typescript';
import { BaseModel } from 'src/modules/database/base.model';
import { Project } from 'src/modules/project/models/project.model';
import { User } from 'src/modules/user/models/user.model';

@Table({
  paranoid: true,
})
export class UserProject extends BaseModel<UserProject> {
  @ForeignKey(() => User)
  UserId: string;

  @BelongsTo(() => User, { foreignKey: 'UserId', as: 'user' })
  user: User;

  @ForeignKey(() => Project)
  ProjectId: string;

  @BelongsTo(() => Project, { foreignKey: 'ProjectId', as: 'Project' })
  project: Project;

  @Column
  createdAt: Date;

  @Column
  updatedAt: Date;
}
