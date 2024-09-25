import { Table, Column, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { BaseModel } from 'src/modules/database/base.model';
import { SharedProject } from 'src/modules/shared-project/models/shared-project.model';
import { User } from 'src/modules/user/models/user.model';

@Table({
  paranoid: true,
})
export class MyProject extends BaseModel<MyProject> {
  @ForeignKey(() => User)
  @Column
  UserId: string;

  @BelongsTo(() => User)
  User: User;

  @ForeignKey(() => SharedProject)
  @Column
  SharedProjectId: string;

  @BelongsTo(() => SharedProject)
  SharedProject: SharedProject;
}
