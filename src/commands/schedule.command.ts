import { MessageEmbed } from 'discord.js';
import { Command } from '../lib';
import GenericMessage from '../lib/GenericMessage';
import { CommandCallbackArguments, CommandOptionTypes } from '../lib/types';
import anime from '../schemas/anime';

export default class Schedule extends Command {
  constructor() {
    super({
      name: 'schedule',
      description: 'Toggle whether the anime scheduled',
      args: [
        { name: 'title', required: false, type: CommandOptionTypes.STRING },
        { name: 'setSchedule', required: false, type: CommandOptionTypes.BOOL },
      ],
      alias: ['sdl', 'sch'],
      ownerOnly: true,
    });
  }

  public async run({ message, args }: CommandCallbackArguments) {
    const [title, schedule] = args;

    if (title && typeof schedule === 'boolean') {
      try {
        const result = await anime.updateOne({ title }, { schedule });
        if (result.acknowledged && result.matchedCount) {
          GenericMessage.sendSuccess(
            message,
            `${title} switched to ${
              schedule ? '**schedule**' : '**not schedule**'
            }`
          );
        } else {
          GenericMessage.sendError(
            message,
            this,
            'Anime Not Found | Failed To Acknowledge',
            `Failed to switch the schedule for title **${title}**`
          );
        }
      } catch (e) {
        console.error(e);
      }
      return;
    }

    // display the list of scheduled animes
    const result = await anime.find({ schedule: true });
    const embed = new MessageEmbed({
      title: 'Scheduled Anime List',
      color: 0x2f3136,
    });
    let desc = '';

    result.forEach(anime => (desc += `${anime.fullTitle || anime.title}\n`));
    embed.description = desc;

    message.channel.send({ embeds: [embed] });
  }
}
