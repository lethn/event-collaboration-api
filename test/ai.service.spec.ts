import { Test } from '@nestjs/testing';
import { AiService } from '../src/ai/ai.service';
import { MockSummarizer } from '../src/ai/mock.summarizer';
import { CacheModule } from '@nestjs/cache-manager';

describe('AiService', () => {
  let aiService: AiService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CacheModule.register()],
      providers: [AiService, MockSummarizer],
    }).compile();

    aiService = moduleRef.get(AiService);
  });

  it('Returns a one-line summary', async () => {
    const summary = await aiService.summarizeMerged(['A', 'B'], 2);
    expect(summary).toContain('Merged from 2 overlapping events');
    expect(summary).toContain('A + B');
  });

  it('Caches repeated calls', async () => {
    const s1 = await aiService.summarizeMerged(['A'], 1);
    const s2 = await aiService.summarizeMerged(['A'], 1);
    expect(s1).toBe(s2);
  });
});
