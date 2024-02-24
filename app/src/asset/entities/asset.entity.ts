import { Organization } from 'src/organization/entities/organization.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AssetCondition } from '../enums/asset-condition.enum';

@Entity('assets')
export class Asset {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
    name: 'name',
    type: 'varchar',
    length: 100,
  })
  name: string;

  @Column({
    nullable: true,
    name: 'description',
    type: 'text',
  })
  description: string;

  @ManyToOne(() => User)
  createdBy: User;

  @Column({
    nullable: false,
    name: 'created_at',
    type: 'timestamp',
  })
  createdAt: Date;

  @Column({
    nullable: false,
    name: 'updated_at',
    type: 'timestamp',
  })
  updatedAt: Date;

  @Column({
    nullable: false,
    name: 'condition',
    type: 'varchar',
    length: 20,
  })
  condition: AssetCondition;

  @ManyToOne(() => User, (user) => user.assets, {
    nullable: true,
  })
  assignedTo: User;

  @ManyToOne(() => Organization, (organization) => organization.assets)
  organization: Organization;
}
