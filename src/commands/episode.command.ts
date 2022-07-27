import axios from 'axios';
import { MessageEmbed } from 'discord.js';
import { Command } from '../lib';
import GenericMessage from '../lib/GenericMessage';
import { CommandCallbackArguments, CommandOptionTypes } from '../lib/types';
import anime from '../schemas/anime';

export default class Episode extends Command {
  constructor() {
    super({
      name: 'episode',
      description: "Get's the number of episode",
      args: [
        { name: 'anime', required: true, type: CommandOptionTypes.STRING },
      ],
      alias: ['ep'],
    });
  }

  public async run({ args, message }: CommandCallbackArguments) {
    const [title] = args;
    const result = await anime.findOne({ title });

    const embed = new MessageEmbed({
      color: 0x2f3136,
      title: `${result?.fullTitle || title.toUpperCase()} Episode Count`,
      fields: [
        {
          name: 'Kayo Episode Count',
          value: ` ${result?.episodeCount ?? '?'}`,
          inline: true,
        },
      ],
    });

    if (result?.image) {
      embed.setThumbnail(result.image);
    }

    if (!result) {
      GenericMessage.sendError(
        message,
        this,
        'Anime Not Found',
        `Anime title **${title}** not found. Register it with the **register** command.`
      );
      return;
    }

    message.channel.send({ embeds: [embed] });
  }
}
