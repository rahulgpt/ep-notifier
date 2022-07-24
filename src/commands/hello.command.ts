import { Command } from '../lib';
import { CommandCallbackArguments } from '../lib/types';
import KayoScraper from '../scrapers/KayoScraper';

export default class Hello extends Command {
  constructor() {
    super({
      name: 'hello',
      description: 'Reply hi to hello',
      args: [],
    });
  }

  public async run({ channel }: CommandCallbackArguments) {
    const scraper = new KayoScraper();
    console.log(await scraper.getEpisodeCount());

    channel.send(`${await scraper.getEpisodeCount()}`);

    return "Kon'nichiwa 👋";
  }
}
