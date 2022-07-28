import cron from 'node-cron';
import KayoScraper from '../scrapers/KayoScraper';
import AnimeService from '../services/anime';
import Updator from './Updator';

export default class Schedular {
  private static instance: Schedular;
  private readonly scheduleTime: string;
  private readonly animeService = AnimeService.getInstance();
  private readonly updator = Updator.getInstance();

  private constructor() {
    this.scheduleTime = process.env.SCHEDULE_TIME || '*/10 * * * *';
    console.log(this.scheduleTime);
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

          if (anime.episodeCount && anime.episodeCount < episodeCount) {
            // send message to user for new episode
            this.updator.emitUpdate(
              anime.fullTitle || anime.title,
              episodeCount,
              anime.kayoDriveUrl,
              anime.image
            );
          }

          // update the episode count in db
          this.animeService.updateCount(anime.title, episodeCount);
        }
      });
    });
  }
}
