import { Global, Module } from '@nestjs/common';
import { UserModule } from '@server/user/user.module';
import { ActivityRecordController } from './activity-record.controller';
import { ActivityRecordService } from './activity-record.service';

@Global()
@Module({
  imports: [UserModule],
  providers: [ActivityRecordService],
  controllers: [ActivityRecordController],
  exports: [ActivityRecordService],
})
export class ActivityRecordModule {}
