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
    });
  }

  public async run({ args, message }: CommandCallbackArguments) {
    const [title] = args;

    const result = await anime.findOne({ title });

    if (!result) {
      GenericMessage.sendError(
        message,
        this,
        'Anime Not Found',
        `Anime title **${title}** not found. Register it with the **register** command.`
      );
      return;
    }

    GenericMessage.sendSuccess(
      message,
      `Episode Count: ${result?.episodeCount ?? '?'}`
    );
  }
}
