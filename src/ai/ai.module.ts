import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { AiService } from './ai.service';

@Module({
  imports: [
    CacheModule.register({
      ttl: 3600,
      max: 1000,
      isGlobal: true,
    }),
  ],
  providers: [AiService],
  exports: [AiService],
})
export class AiModule {}
