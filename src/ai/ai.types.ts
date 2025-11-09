export interface Summarizer {
  summarizeMerged(titles: string[], count: number): Promise<string>;
}
