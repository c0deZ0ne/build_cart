import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';
import { Builder } from 'src/modules/builder/models/builder.model';
import { BuilderFundManager } from 'src/modules/project/models/builder-fundManager-project.model';
import { BaseModel } from 'src/modules/database/base.model';
import { ProjectFundManager } from 'src/modules/project-fundManager/model/projectFundManager.model';
import { Project } from 'src/modules/project/models/project.model';
import { User } from 'src/modules/user/models/user.model';
import { ProjectShares } from 'src/modules/project/models/project-shared.model';

enum BusinessSize {
  MICRO = 'MICRO',
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE',
}
@Table({
  paranoid: true,
})
export class FundManager extends BaseModel<FundManager> {
  @Column({ unique: true })
  email: string;

  @Column
  phone?: string | null;

  @Column
  businessAddress?: string | null;

  @Column({
    type: DataType.ENUM(...Object.values(BusinessSize)),
    allowNull: true,
  })
  businessSize: BusinessSize | null;

  @Column
  businessRegNo: string | null;

  @Column
  businessName: string | null;

  @Column({ type: DataType.STRING, allowNull: true })
  logo: string;

  @Column
  about?: string | null;

  @Column
  contactPhone: string | null;

  @Column
  contactEmail: string | null;

  @Column
  lastLogin: Date | null;

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

  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  procurementManagerId: string | null;

  @BelongsTo(() => User, {
    foreignKey: 'procurementManagerId',
    onDelete: 'CASCADE',
  })
  procurementManager: User;

  @Column({
    allowNull: true,
    type: DataType.STRING,
  })
  other_docs: string | null;

  @BelongsToMany(() => Project, () => ProjectFundManager)
  CompanyProjects: Project[];

  @BelongsToMany(
    () => Project,
    () => ProjectShares,
    'FundManagerId',
    'ProjectId',
  )
  ProjectInvites: Project[];

  @BelongsToMany(
    () => Builder,
    () => BuilderFundManager,
    'BuilderId',
    'FundManagerId',
  )
  Contractors: Builder[];

  @Column
  migratedAt: Date | null;
}
