import { MessageEmbed } from 'discord.js';
import { Command } from '../lib';
import GenericMessage from '../lib/GenericMessage';
import { CommandCallbackArguments, CommandOptionTypes } from '../lib/types';
import anime from '../schemas/anime';

export default class Update extends Command {
  constructor() {
    super({
      name: 'update',
      description: 'Updates a pre-registered anime',
      alias: ['u'],
      args: [
        { name: 'title', required: true, type: CommandOptionTypes.STRING },
        {
          name: 'fieldToUpdate',
          required: true,
          type: CommandOptionTypes.STRING,
        },
      ],
    });
  }

  public async run({ message, args }: CommandCallbackArguments) {
    const [title, fields] = args;
    let fieldArr: string[][] = [];
    let updateObj: any = {};

    // parse fields
    let tmp: any = fields.split('|');

    tmp.forEach((field: string) => {
      fieldArr.push(field.split(':'));
    });

    for (let i = 0; i < fieldArr.length; i++) {
      fieldArr[i][1] = fieldArr[i][1].replace(/,/g, ' ');
      fieldArr[i][1] = fieldArr[i][1].replace(/%1/g, ':');
    }

    console.log(fieldArr);

    fieldArr.forEach(field => (updateObj[field[0]] = field[1]));

    try {
      const result = await anime.updateOne({ title }, updateObj);
      console.log(result);

      if (result.modifiedCount >= 1)
        GenericMessage.sendSuccess(message, `${title} updated`);
      else if (!result.matchedCount)
        GenericMessage.sendError(
          message,
          this,
          `Anime Not Found`,
          `Anime with title ${title} not found`
        );
      else {
        GenericMessage.sendError(
          message,
          this,
          `Failed to Update`,
          `There was some error while updating the title ${title}. Failed to update ${title}`
        );
      }
    } catch (e) {
      console.error(e);
    }
  }
}
