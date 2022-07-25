import { Message, MessageEmbed } from 'discord.js';
import { ICommand } from './Command';

export default class GenericMessage {
  public static sendError(
    message: Message,
    command: ICommand,
    reason: string,
    content: string
  ) {
    const embed = new MessageEmbed({ color: 0xd24d7e });

    let argsString = '';

    for (let i = 0; i < command.args.length; i++) {
      const arg = command.args[i];
      argsString += `<${arg.name} : ${arg.type}>${arg.required ? '' : '?'} `;
    }

    embed.title = `Error`;
    embed.description = `${content}`;
    embed.addField('Reason', reason);
    embed.addField(
      'Format',
      `${process.env.DEFAULT_PREFIX}${command.name} ${argsString}`
    );
    // embed.thumbnail = {
    //   url: 'https://media.discordapp.net/attachments/969222381317021746/969226663424585728/92428e727dc23064444954523ce2a970.jpg',
    // };

    message.channel.send({ embeds: [embed] });
  }

  public static sendSuccess(message: Message, content: string) {
    const embed = new MessageEmbed({ color: 0x001220 });

    embed.title = 'Success';
    embed.description = content;

    message.channel.send({ embeds: [embed] });
  }

  public static send(message: Message, content: string) {
    message.channel.send({
      embeds: [new MessageEmbed({ color: 0x2f3136, description: content })],
    });
  }
}
