import { Entity, BaseEntity, PrimaryKey } from '@mikro-orm/core';

@Entity()
export class EventRegistration extends BaseEntity<EventRegistration, 'id'> {
  @PrimaryKey()
  id!: number;
}
