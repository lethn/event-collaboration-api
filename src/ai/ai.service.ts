import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { Summarizer } from './ai.types';
import { MockSummarizer } from './mock.summarizer';

@Injectable()
export class AiService {
  constructor(@Inject(CACHE_MANAGER) private cache: Cache) {}

  private getSummarizer(): Summarizer {
    const provider = (process.env.AI_PROVIDER ?? 'mock').toLowerCase();
    switch (provider) {
      case 'mock':
      default:
        return new MockSummarizer();
    }
  }

  async summarizeMerged(titles: string[], count: number): Promise<string> {
    const key = `summary:${count}:${titles.join('|').slice(0, 100)}`;

    const cache = this.cache as unknown as {
      get<T>(key: string): Promise<T | undefined>;
      set<T>(key: string, value: T): Promise<void>;
    };

    const cached = await cache.get<string>(key);
    if (cached !== undefined) {
      return cached;
    }

    const summarizer = this.getSummarizer();
    const summary = await summarizer.summarizeMerged(titles, count);

    await cache.set<string>(key, summary);

    return summary;
  }
}
