import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

@Table({ tableName: 'documents', paranoid: true })
export class V1Documents extends Model<V1Documents> {
  @PrimaryKey
  @Column({ type: DataType.INTEGER, autoIncrement: true })
  id: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  user_id: number;

  @Column({ type: DataType.STRING, allowNull: true })
  name: string;

  @Column({ type: DataType.STRING, allowNull: true })
  slug: string;

  @Column({ type: DataType.STRING, allowNull: true })
  url: string;

  @Column({ type: DataType.STRING, allowNull: true })
  type: string;

  @Column({ type: DataType.DATE, allowNull: true })
  published_at: Date;

  @Column({ type: DataType.INTEGER, allowNull: true })
  created_by: number;

  @Column({ type: DataType.INTEGER, allowNull: true })
  updated_by: number;

  @Column({ type: DataType.DATE, allowNull: false })
  created_at: Date;

  @Column({ type: DataType.DATE, allowNull: false })
  updated_at: Date;

  @Column({ type: DataType.STRING, allowNull: true })
  business_certificate: string;

  @Column({ type: DataType.STRING, allowNull: true })
  vat_certificate: string;

  @Column({ type: DataType.STRING, allowNull: true })
  insurance_certificate: string;

  @Column({ type: DataType.STRING, allowNull: true })
  confirmation_of_address: string;

  @Column({ type: DataType.STRING, allowNull: true })
  proof_of_identity: string;

  @Column({ type: DataType.UUID, allowNull: true })
  NewId: string | null;
}
