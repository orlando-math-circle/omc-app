import {
  EntityName,
  EventArgs,
  EventSubscriber,
  Subscriber,
} from '@mikro-orm/core';
import { User } from './user.entity';

@Subscriber()
export class UserSubscriber implements EventSubscriber<User> {
  getSubscribedEntities(): EntityName<User>[] {
    return [User];
  }

  async beforeUpdate(args: EventArgs<User>) {
    if (!args.changeSet) return;

    // If the grade was changed, update when it was set.
    if ('grade' in args.changeSet.payload) {
      if (args.changeSet.payload.gradeSet === null) {
        args.entity.gradeSetAt = undefined;
      } else {
        args.entity.gradeSetAt = new Date();
      }
    }
  }
}
