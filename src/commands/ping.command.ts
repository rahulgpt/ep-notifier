import { Command } from '../lib';
import { CommandCallbackArguments, CommandOptionTypes } from '../lib/types';

export default class Ping extends Command {
  constructor() {
    super({
      name: 'ping',
      description: "Ping's Server",
      args: [
        { name: 'time', required: true, type: CommandOptionTypes.NUMBER },
        { name: 'value', required: true, type: CommandOptionTypes.BOOL },
        { name: 'date', required: false, type: CommandOptionTypes.NUMBER },
      ],
    });
  }

  public async run({ message, client }: CommandCallbackArguments) {
    return `Pong!!\nLatency is ${
      Date.now() - message.createdTimestamp
    }ms. API Latency is ${Math.round(client.ws.ping)}ms`;
  }
}
