// import { Injectable, Injectable } from '@nestjs/common';

// @Injectable()
// export class EmailScheduler extends NestSchedule {
//   constructor(@InjectQueue('email') private readonly queue: Queue) {
//     super();
//   }

//   // Every 15th minute
//   @Cron('*/15 * * * *')
//   enqueueNotifications() {
//     this.queue.add('send-email-notifications', { attempts: 1 });
//   }
// }

// @Processor('email')
// export class EmailQueue {
//   @Process({ name: 'send-email-notifications', concurrency: 1 })
//   private async sendEmailNotifications(job: Job) {
//     // Find event registrations and send email notifications
//   }
// }
