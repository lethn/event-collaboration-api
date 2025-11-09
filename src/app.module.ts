import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { EventsModule } from './events/events.module';
import { AuditLogModule } from './audit-log/audit-log.module';
import { AiModule } from './ai/ai.module';

@Module({
  imports: [
    // Load .env
    ConfigModule.forRoot({ isGlobal: true }),

    // Connect PostgrSQL Database
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: parseInt(config.get('DB_PORT') || '5432'),
        username: config.get('DB_USER'),
        password: config.get('DB_PASS'),
        database: config.get('DB_NAME'),
        autoLoadEntities: true,
        synchronize: config.get('DB_SYNC') === 'true',
      }),
    }),

    UsersModule,

    EventsModule,

    AuditLogModule,

    AiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
