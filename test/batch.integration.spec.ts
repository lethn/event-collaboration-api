import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from '../src/events/event.entity';
import { User } from '../src/users/user.entity';
import { EventsService } from '../src/events/events.service';
import { UsersService } from '../src/users/users.service';
import { AuditLogModule } from '../src/audit-log/audit-log.module';
import { AiModule } from '../src/ai/ai.module';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

describe('Batch Insert Integration', () => {
  let eventsService: EventsService;
  let usersService: UsersService;
  let moduleRef: TestingModule;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.DB_HOST,
          port: Number(process.env.DB_PORT),
          username: process.env.DB_USER,
          password: process.env.DB_PASS,
          database: process.env.DB_NAME,
          synchronize: process.env.DB_SYNC === 'true',
          entities: [Event, User],
        }),
        TypeOrmModule.forFeature([Event, User]),
        AuditLogModule,
        AiModule,
      ],
      providers: [EventsService, UsersService],
    }).compile();

    eventsService = moduleRef.get(EventsService);
    usersService = moduleRef.get(UsersService);
  });

  beforeEach(async () => {
    const dataSource = moduleRef.get(DataSource);
    await dataSource.query(`TRUNCATE TABLE "event" CASCADE;`);
    await dataSource.query(`TRUNCATE TABLE "user" CASCADE;`);
  });

  it('Inserts up to 500 events in one transaction', async () => {
    const user = await usersService.create(
      'Test User',
      `test_${Date.now()}@example.com`,
    );

    const events = Array.from({ length: 10 }).map((_, i) => ({
      title: `Evt ${i}`,
      startTime: `2025-01-01T0${i}:00:00Z`,
      endTime: `2025-01-01T0${i}:30:00Z`,
      ownerId: user.id,
    }));

    const result = await eventsService.createBatch(events);

    expect(result.length).toBe(10);
    expect(result[0].id).toBeDefined();
  });

  afterAll(async () => {
    const dataSource = moduleRef.get(DataSource);
    await dataSource.destroy();
  });
});
