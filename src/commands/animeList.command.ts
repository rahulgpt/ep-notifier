import { MessageEmbed } from 'discord.js';
import { Command } from '../lib';
import { CommandCallbackArguments } from '../lib/types';
import anime from '../schemas/anime';

export default class AnimeList extends Command {
  constructor() {
    super({
      name: 'animeList',
      description: 'Return the list registered animes',
      alias: ['al', 'list'],
    });
  }

  public async run({ message }: CommandCallbackArguments) {
    let result;
    // let desc = '';

    try {
      result = await anime.find({});
    } catch (e) {
      console.error(e);
    }

    const embed = new MessageEmbed({ title: 'Anime List', color: 0x2f3136 });

    result?.forEach(anime => {
      // desc += `**${anime.title}**`;
      embed.addFields([
        {
          name: anime.title,
          value: anime.fullTitle || anime.title,
          inline: true,
        },
      ]);
    });

    // embed.setDescription(desc);

    message.channel.send({ embeds: [embed] });
  }
}
