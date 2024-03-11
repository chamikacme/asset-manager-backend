import { Asset } from 'src/asset/entities/asset.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('organizations')
export class Organization {
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

  @OneToMany(() => User, (user) => user.organization, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  members: User[];

  @OneToMany(() => Asset, (asset) => asset.organization, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  assets: Asset[];
}
