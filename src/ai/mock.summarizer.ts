import { Summarizer } from './ai.types';

export class MockSummarizer implements Summarizer {
  async summarizeMerged(titles: string[], count: number): Promise<string> {
    await Promise.resolve();
    const head = titles.slice(0, 2).join(' + ');
    return `Merged from ${count} overlapping events: ${head}${count > 10 ? '...' : ''}`;
  }
}
