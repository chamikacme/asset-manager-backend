import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
    name: 'first_name',
    type: 'varchar',
    length: 50,
  })
  firstName: string;

  @Column({
	nullable: true,
	name: 'last_name',
	type: 'varchar',
	length: 50,
  })
  lastName: string;

  @Column({
	nullable: false,
	type: 'varchar',
	length: 100,
	unique: true,
  })
  email: string;

  @Column({
	nullable: false,
	type: 'varchar',
	length: 255,
  })
  password: string;

  @Column({
	nullable: true,
	name: 'phone_number',
	type: 'varchar',
	length: 50,
  })
  phoneNumber: string;

}
