import { Logger } from '@nestjs/common';

export class EmailSandbox {
  private readonly logger = new Logger(EmailSandbox.name);

  /**
   * Prints any provided arguments to the console as a rudimentary
   * emailing SandBox.
   *
   * @param args Any
   */
  public async send(...args: any) {
    this.logger.log(JSON.stringify(args, null, 2));
  }
}
