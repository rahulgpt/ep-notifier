import cron from 'node-cron';
import KayoScraper from '../scrapers/KayoScraper';
import AnimeService from '../services/anime';
import Logger from './Logger';

export default class Schedular {
  private static instance: Schedular;
  private readonly scheduleTime: string;
  private readonly logger = new Logger(Schedular);
  private readonly animeService = AnimeService.getInstance();

  private constructor() {
    this.scheduleTime = process.env.SCHEDULE_TIME || '* * */10 * * *';
  }

  private async handleEpisodeCount(title: string, count: number) {
    const anime = await this.animeService.getOne(title);
    if (count > (anime?.episodeCount || 0)) {
      await this.animeService.updateCount(title, count);
    }
  }

  public static getInstance() {
    if (!Schedular.instance) Schedular.instance = new Schedular();

    return Schedular.instance;
  }

  public schedule() {
    cron.schedule(this.scheduleTime, async () => {
      let animes = await this.animeService.getAll();
      if (!animes) return;

      let kayoScraper = KayoScraper.getInstance();

      animes.forEach(async anime => {
        if (anime.schedule) {
          const episodeCount = await kayoScraper.getEpisodeCount(
            anime.kayoDriveUrl
          );

          if ((anime.episodeCount || 0) < episodeCount) {
          }
          this.animeService.updateCount(anime.title, episodeCount);
        }
      });
    });
  }
}
