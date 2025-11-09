import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLog } from './audit-log.entity';
import { AuditLogService } from './audit-log.service';
import { AuditLogController } from './audit-log.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AuditLog])],
  providers: [AuditLogService],
  exports: [AuditLogService],
  controllers: [AuditLogController],
})
export class AuditLogModule {}
