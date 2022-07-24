export interface IScraper {
  getEpisodeCount(): Promise<number>;
}
