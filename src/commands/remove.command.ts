import { Command } from '../lib';
import GenericMessage from '../lib/GenericMessage';
import { CommandCallbackArguments, CommandOptionTypes } from '../lib/types';
import anime from '../schemas/anime';

export default class Remove extends Command {
  constructor() {
    super({
      name: 'remove',
      description: 'Remove an anime from db',
      args: [
        { name: 'title', required: true, type: CommandOptionTypes.STRING },
      ],
      alias: ['rm'],
      ownerOnly: true,
    });
  }

  public async run({ message, args }: CommandCallbackArguments) {
    const [title] = args;

    try {
      const result = await anime.deleteOne({ title });
      if (result.acknowledged && result.deletedCount >= 1) {
        GenericMessage.sendSuccess(message, `Removed **${title}**`);
      } else {
        GenericMessage.sendError(
          message,
          this,
          'Anime Not Found | Failed To Acknowledge',
          `Failed to remove anime title **${title}**`
        );
      }
    } catch (e) {
      console.error(e);
    }
  }
}
