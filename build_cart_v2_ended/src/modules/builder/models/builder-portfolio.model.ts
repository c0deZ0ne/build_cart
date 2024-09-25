import {
  BelongsToMany,
  Column,
  DataType,
  Table,
  HasMany,
  BelongsTo,
  HasOne,
  ForeignKey,
} from 'sequelize-typescript';
import { BaseModel } from 'src/modules/database/base.model';
import { PortFolioMedias } from './builder-portfolio-media';
import { User } from 'src/modules/user/models/user.model';
import { Builder } from './builder.model';

@Table({
  paranoid: true,
})
export class BuilderPortFolio extends BaseModel<BuilderPortFolio> {
  @Column({ type: DataType.STRING, allowNull: true })
  title: string | null;

  @Column({ type: DataType.STRING, allowNull: true })
  about: string | null;

  @Column({ type: DataType.STRING, allowNull: true })
  description: string | null;

  @HasMany(() => PortFolioMedias)
  Medias?: PortFolioMedias[];

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: true })
  OwnerId: string | null;

  @BelongsTo(() => User, {
    foreignKey: 'OwnerId',
    onDelete: 'CASCADE',
  })
  owner: User;

  @ForeignKey(() => Builder)
  @Column({ type: DataType.UUID, allowNull: true })
  BuilderId: string | null;

  @BelongsTo(() => Builder, {
    foreignKey: 'BuilderId',
    onDelete: 'CASCADE',
  })
  Builder?: Builder;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  createdAt: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  updatedAt: Date | null;

  @Column
  migratedAt: Date | null;
}
