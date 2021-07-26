import { Body, Controller, Delete, Get, Param, Post, Query } from "@nestjs/common";
import { AuditLogService } from "./audit-log.service";
import { AuditLogDto } from "./dto/audit-log.dto";


@Controller('/auditLog')
export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) {}

  @Post()
  create(@Body() dto: AuditLogDto) {
    return this.auditLogService.create(dto);
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