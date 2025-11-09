import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './audit-log.entity';

@Injectable()
export class AuditLogService {
  constructor(@InjectRepository(AuditLog) private repo: Repository<AuditLog>) {}

  async createLog(newEventId: string, oldEventIds: string[]) {
    const log = this.repo.create({ newEventId, oldEventIds });
    return this.repo.save(log);
  }

  async findAll() {
    return this.repo.find({
      order: { createdAt: 'DESC' },
    });
  }

  async removeById(id: string) {
    return this.repo.delete(id);
  }
}
