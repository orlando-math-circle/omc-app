import { Body, Controller, Delete, Get, Param, Post, Query } from "@nestjs/common";
import { Usr } from "@server/auth/decorators/user.decorator";
import { User } from "@server/user/user.entity";
import { AuditLogService } from "./audit-log.service";
import { AuditLogDto } from "./dto/audit-log.dto";


@Controller('/auditLog')
export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) {}

  @Post()
  create(@Body() dto: AuditLogDto, @Usr() user: User) {
    return this.auditLogService.create(dto, user);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.auditLogService.findOne(id);
  }

  @Get()
  findAll(
    @Query('limit') limit: number,
    @Query('offset') offset: number,
  ) {
    return this.auditLogService.findAll(limit, offset);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.auditLogService.delete(id);
  }
}