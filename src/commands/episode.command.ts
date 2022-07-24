import { Command } from '../lib';
import { CommandCallbackArguments, CommandOptionTypes } from '../lib/types';

export default class Episode extends Command {
  constructor() {
    super({
      name: 'episode',
      description: "Get's the number of episode",
      args: [
        { name: 'time', required: true, type: CommandOptionTypes.NUMBER },
        { name: 'value', required: true, type: CommandOptionTypes.BOOL },
        { name: 'date', required: false, type: CommandOptionTypes.NUMBER },
      ],
    });
  }

  public async run({ message, client }: CommandCallbackArguments) {}
}
