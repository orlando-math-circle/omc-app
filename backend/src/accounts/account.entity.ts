import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum Role {
  ADMIN = 'Admin',
  EDUCATOR = 'Educator',
  VOLUNTEER = 'Volunteer',
}

@Entity()
export class Account extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  verified: boolean;

  @Column({ type: 'enum', enum: Role, array: true })
  roles: Role[];
}
