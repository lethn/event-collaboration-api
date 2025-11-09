import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './event.entity';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { UsersModule } from '../users/users.module';
import { AuditLogModule } from '../audit-log/audit-log.module';

@Module({
  imports: [TypeOrmModule.forFeature([Event]), UsersModule, AuditLogModule],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
