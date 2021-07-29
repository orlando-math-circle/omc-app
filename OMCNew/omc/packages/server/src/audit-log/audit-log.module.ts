import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { AuditLogController } from './audit-log.controller';
import { AuditLog } from './audit-log.entity';
import { AuditLogService } from './audit-log.service';

@Module({
  imports: [MikroOrmModule.forFeature([AuditLog])],
  providers: [AuditLogService],
  controllers: [AuditLogController],
  exports: [AuditLogService],
})
export class AuditLogModule {}