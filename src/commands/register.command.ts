import { Command } from '../lib';
import { CommandCallbackArguments, CommandOptionTypes } from '../lib/types';
import anime from '../schemas/anime';

export default class Register extends Command {
  constructor() {
    super({
      name: 'register',
      description: 'Register a new anime',
      args: [
        { name: 'title', required: true, type: CommandOptionTypes.STRING },
        {
          name: 'kayoDriveUrl',
          required: true,
          type: CommandOptionTypes.KAYO_DRIVE_URL,
        },
      ],
      ownerOnly: true,
    });
  }

  public async run({ args }: CommandCallbackArguments) {
    const [title, kayoDriveUrl] = args;

    try {
      (await anime.create({ title, kayoDriveUrl })).save();
    } catch (e) {
      console.error(e);
    }

    return 'Registered Successfully';
  }
}
