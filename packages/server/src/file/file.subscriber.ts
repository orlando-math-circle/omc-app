import {
  EntityName,
  EventArgs,
  EventSubscriber,
  Subscriber,
} from '@mikro-orm/core';
import { Logger } from '@nestjs/common';
import fs from 'fs';
import { File } from './file.entity';

const { unlink } = fs.promises;

/**
 * Basic methodology for removing a file when it is being deleted from the
 * database. While this works, it throws an error. If this is used,
 * try to investigate if an absolute path is required.
 */

@Subscriber()
export class FileSubscriber implements EventSubscriber<File> {
  private readonly logger = new Logger(FileSubscriber.name);

  getSubscribedEntities(): EntityName<File>[] {
    return [File];
  }

  async beforeDelete(args: EventArgs<File>) {
    // Attempt to delete a file if it is being truly removed.
    try {
      await unlink(args.entity.path);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
