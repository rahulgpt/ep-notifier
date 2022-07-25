export interface IScraper {
  getEpisodeCount(url: string): Promise<number>;
}
