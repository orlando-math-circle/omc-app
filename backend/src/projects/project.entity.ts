import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Project extends BaseEntity {
  constructor(name: string, description: string, hours?: number) {
    super();

    this.name = name;
    this.description = description;
    this.hours = hours;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'smallint', default: 0 })
  hours: number;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;
}
