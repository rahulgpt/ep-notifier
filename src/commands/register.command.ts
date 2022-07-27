import { Command } from '../lib';
import GenericMessage from '../lib/GenericMessage';
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
        {
          name: 'fullTitle',
          required: false,
          type: CommandOptionTypes.STRING,
        },
        {
          name: 'imageUrl',
          required: false,
          type: CommandOptionTypes.STRING,
        },
      ],
      alias: ['r'],
      ownerOnly: true,
    });
  }

  public async run({ message, args }: CommandCallbackArguments) {
    const [title, kayoDriveUrl, uFullTitle, uimage] = args;

    const anim = await anime.findOne({ title });
    if (anim) {
      GenericMessage.sendError(
        message,
        this,
        'Already Exist',
        `Anime with the title **${title}** already exists. Use **update** command to update the anime`
      );
      return;
    }

    // parse kitsuTitle
    const fullTitle = uFullTitle.replace(/,/g, ' ');
    const image = uimage.replace(/<|>/g, '');

    try {
      (await anime.create({ title, kayoDriveUrl, fullTitle, image })).save();
    } catch (e) {
      console.error(e);
    }

    return 'Registered Successfully';
  }
}
