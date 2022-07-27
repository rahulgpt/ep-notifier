import { Command } from '../lib';
import GenericMessage from '../lib/GenericMessage';
import { CommandCallbackArguments, CommandOptionTypes } from '../lib/types';
import animeM from '../schemas/anime';
import KayoScraper from '../scrapers/KayoScraper';

export default class Fetch extends Command {
  constructor() {
    super({
      name: 'fetch',
      description: 'Fetch the latest episode count from website',
      args: [
        {
          name: 'animeTitle',
          required: false,
          type: CommandOptionTypes.STRING,
        },
      ],
      alias: ['latest', 'f'],
      ownerOnly: true,
    });
  }

  public async run({ args, message }: CommandCallbackArguments) {
    const [animeTitle] = args;
    const scraper = KayoScraper.getInstance();
    let animeToFetch = [];

    if (animeTitle) {
      const result = await animeM.findOne({ title: animeTitle });
      console.log(result);
      animeToFetch.push(result);
    } else {
      animeToFetch = await animeM.find({});
      GenericMessage.send(
        message,
        'Fetching episode count for every anime. This may take a while...'
      );
    }

    for (const anime of animeToFetch) {
      const episodeCount = await scraper.getEpisodeCount(anime?.kayoDriveUrl!);
      try {
        await animeM.updateOne(
          { title: anime?.title },
          { episodeCount },
          { upsert: true }
        );
      } catch (e) {
        console.error(e);
        GenericMessage.sendError(
          message,
          this,
          'Error Encountered',
          `Failed to update episode count of ${anime?.title}`
        );
      }
    }

    GenericMessage.sendSuccess(
      message,
      'Successfully fetched the latest episode count'
    );
    return;
  }
}
