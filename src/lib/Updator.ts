import Client from './Client';
import Logger from './Logger';
import { MessageEmbed, TextChannel } from 'discord.js';

export default class Updator {
  private static instance: Updator;
  private client!: Client;
  private readonly updateChannel: string =
    process.env.UPDATE_CHANNEL || '1001838092342280212';
  private readonly logger = new Logger(this);

  private constructor() {
    setTimeout(() => {
      this.client = Client.getInstance();
    }, 10);
  }

  public static getInstance() {
    if (!Updator.instance) Updator.instance = new Updator();
    return Updator.instance;
  }

  public async emitUpdate(
    title: string,
    count: number,
    link: string,
    image: string | void
  ) {
    const client = this.client.getClient();

    if (!client) {
      this.logger.error('Failed to get the client using getClient method');
    }

    const channel = (await client.channels.cache.get(
      this.updateChannel
    )) as TextChannel;

    if (!channel) {
      this.logger.error('Update channel not found');
    }

    let embed = new MessageEmbed({
      title: `${title}`,
      color: 0x2f3136,
      description: `**Episode ${count}** has been uploaded to \`kayoanime.com\``,
      fields: [{ name: 'Link', value: link }],
    });

    embed.setTimestamp();
    if (image) embed.setThumbnail(image);

    channel.send({ embeds: [embed] });
  }
}
