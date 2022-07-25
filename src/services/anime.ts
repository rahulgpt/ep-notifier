import animeM, { IAnime } from '../schemas/anime';
import tryCatchWrapper from '../utils/tryCatchWrapper';

export default class AnimeService {
  private static instance: AnimeService;
  private readonly anime: typeof animeM;

  private constructor() {
    this.anime = animeM;
  }

  public static getInstance() {
    if (!AnimeService.instance) AnimeService.instance = new AnimeService();
    return AnimeService.instance;
  }

  public async updateCount(title: string, count: number) {
    try {
      return await this.anime.updateOne(
        { title },
        { episodeCount: count },
        { upsert: true }
      );
    } catch (e) {
      console.error(e);
    }
  }

  public async getAll() {
    try {
      return await this.anime.find({});
    } catch (e) {
      console.error(e);
    }
  }

  public async getOne(title: string) {
    try {
      return await this.anime.findOne({ title });
    } catch (e) {
      console.error(e);
    }
  }

  public async create(opts: IAnime) {
    try {
      return (await this.anime.create(opts)).save();
    } catch (e) {
      console.error(e);
    }
  }
}
