import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Event } from './event.entity';
import { UsersService } from '../users/users.service';
import { CreateEventDto } from './dto/create-event-dto';
import { AuditLogService } from '../audit-log/audit-log.service';
import { AiService } from '../ai/ai.service';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event) private repo: Repository<Event>,
    private usersService: UsersService,
    private auditLogService: AuditLogService,
    private aiService: AiService,
    private dataSource: DataSource,
  ) {}

  async create(dto: CreateEventDto) {
    const owner = await this.usersService.findById(dto.ownerId);
    if (!owner) throw new BadRequestException('Owner not found');

    const start = new Date(dto.startTime);
    const end = new Date(dto.endTime);

    if (start >= end) {
      throw new BadRequestException('startTime must be before endTime');
    }

    const invitees = dto.inviteeIds?.length
      ? await this.usersService.findMany(dto.inviteeIds)
      : [];

    const event = this.repo.create({
      title: dto.title,
      description: dto.description,
      status: dto.status ?? 'TODO',
      startTime: new Date(dto.startTime),
      endTime: new Date(dto.endTime),
      owner,
      invitees,
    });

    return this.repo.save(event);
  }

  async findAll() {
    return this.repo.find({
      relations: ['owner', 'invitees'],
    });
  }

  async findById(id: string) {
    return this.repo.findOne({
      where: { id },
      relations: ['owner', 'invitees'],
    });
  }

  async removeById(id: string) {
    return this.repo.delete(id);
  }

  async updateById(id: string, body: any) {
    return this.repo.update(id, body);
  }

  async findConflictsByUserId(userId: string) {
    const events = await this.repo.find({
      where: { owner: { id: userId } },
      order: { startTime: 'ASC' },
    });

    const conflicts: { eventA: Event; eventB: Event }[] = [];
    for (let i = 0; i < events.length; i++) {
      for (let j = i + 1; j < events.length; j++) {
        const A = events[i];
        const B = events[j];

        if (A.endTime <= B.startTime) {
          break;
        }

        if (A.startTime < B.endTime && A.endTime > B.startTime) {
          conflicts.push({ eventA: A, eventB: B });
        }
      }
    }

    return conflicts;
  }

  async mergeAllEventsByUserId(userId: string): Promise<any[]> {
    const events = await this.repo.find({
      where: { owner: { id: userId } },
      order: { startTime: 'ASC' },
    });

    const groups: Event[][] = [];

    for (const event of events) {
      let placed = false;
      for (const group of groups) {
        for (const e of group) {
          if (event.startTime < e.endTime && event.endTime > e.startTime) {
            group.push(event);
            placed = true;
            break;
          }
        }
        if (placed) break;
      }
      if (!placed) groups.push([event]);
    }

    // const mergedResults: Event[] = [];
    const mergedResults: any[] = [];

    for (const group of groups) {
      // Skip if single event
      if (group.length === 1) {
        continue;
      }

      const titles = group.map((e) => e.title).join(' + ');
      const description = group
        .map((e) => e.description ?? '')
        .filter((d) => d.trim() !== '')
        .join(' | ');
      const status = group[group.length - 1].status; // Latest event's status
      const start = new Date(
        Math.min(...group.map((e) => e.startTime.getTime())),
      );
      const end = new Date(Math.max(...group.map((e) => e.endTime.getTime())));
      const owner = group[0].owner;
      const invitees = [...new Set(group.flatMap((e) => e.invitees))];

      const mergedEvent = this.repo.create({
        title: titles,
        description,
        status,
        startTime: start,
        endTime: end,
        owner,
        invitees,
        mergedFrom: group.map((e) => e.id),
      });

      const saved = await this.repo.save(mergedEvent);

      const aiSummary = await this.aiService.summarizeMerged(
        group.map((e) => e.title),
        group.length,
      );

      await this.auditLogService.createLog(
        saved.id,
        group.map((e) => ({
          id: e.id,
          title: e.title,
          description: e.description ?? null,
          status: e.status,
          startTime: e.startTime.toISOString(),
          endTime: e.endTime.toISOString(),
          invitees: e.invitees.map((u) => ({
            id: u.id,
            name: u.name,
          })),
        })),
      );

      await this.repo.remove(group); // Delete old events

      mergedResults.push({
        ...saved,
        aiSummary,
      });
    }

    return mergedResults;
  }

  async createBatch(eventInputs: CreateEventDto[]): Promise<Event[]> {
    if (eventInputs.length > 500) {
      throw new BadRequestException('Batch limit is 500 events');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const toInsert: Event[] = [];

      for (const dto of eventInputs) {
        const owner = await this.usersService.findById(dto.ownerId);
        if (!owner)
          throw new BadRequestException(`Owner not found: ${dto.ownerId}`);

        const invitees = dto.inviteeIds?.length
          ? await this.usersService.findMany(dto.inviteeIds)
          : [];

        toInsert.push(
          this.repo.create({
            title: dto.title,
            description: dto.description,
            status: dto.status ?? 'TODO',
            startTime: new Date(dto.startTime),
            endTime: new Date(dto.endTime),
            owner,
            invitees,
          }),
        );
      }

      const saved = await queryRunner.manager.save(Event, toInsert);

      await queryRunner.commitTransaction();
      return saved;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
