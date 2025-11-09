import { Controller, Get, Delete, Param } from '@nestjs/common';
import { AuditLogService } from './audit-log.service';

@Controller('audit-logs')
export class AuditLogController {
  constructor(private auditLogService: AuditLogService) {}

  @Get()
  getAllLogs() {
    return this.auditLogService.findAll();
  }

  @Delete(':id')
  deleteLog(@Param('id') id: string) {
    return this.auditLogService.removeById(id);
  }
}
