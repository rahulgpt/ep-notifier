import { Client, Message } from 'discord.js';
import Logger, { ILogger } from './Logger';
import { ICommand } from './Command';
import path from 'path';
import fs from 'fs';
import { ParserOptions } from './types';
import GenericMessage from './GenericMessage';

export default class Parser {
  private readonly client: Client;
  private readonly logger: ILogger;
  private readonly commandMap = new Map<string, ICommand>();
  public readonly commandSearchPaths: string[];

  constructor(client: Client, options: ParserOptions) {
    this.client = client;
    this.logger = new Logger(this);
    this.commandSearchPaths = [...options.commandSearchPaths];

    this.constructCommandMap();
  }

  public constructCommandMap() {
    let commandObjPool: ICommand[] = [];

    const readDir = (commandPath: string | undefined) => {
      if (!commandPath) return;
      const files = fs.readdirSync(commandPath);

      files.forEach(file => {
        const stat = fs.lstatSync(path.join(commandPath, file));

        if (stat.isDirectory()) readDir(path.join(commandPath, file));
        else {
          if (file.split('.')[1] === 'command') {
            const commandFile = require(path.join(commandPath, file));
            const { default: commandClass } = commandFile;

            if (typeof commandClass === 'function')
              commandObjPool.push(new commandClass());
          }
        }
      });
    };

    while (this.commandSearchPaths.length) {
      readDir(this.commandSearchPaths.pop());
    }

    commandObjPool.forEach(obj => {
      if (this.commandMap.get(obj.name))
        this.logger.warning(
          `A command with name "${obj.name}" already exist in command map. One of them will not be registered in command map.`
        );
      this.commandMap.set(obj.name, obj);
    });

    console.log(this.commandMap);

    this.logger.success('Command Map generated!');
  }

  private validateUserPermissions() {}

  private validateUserRoles() {}

  private validateArgs(
    command: ICommand,
    args: string[],
    message: Message
  ): boolean {
    // reorder args

    const parsedArgs = [];
    const requiredArgs = command.args.filter(el => el.required);

    // check for missing args
    if (requiredArgs.length !== args.length) {
      GenericMessage.sendError(
        message,
        command,
        `Missing arguments`,
        `I need ${requiredArgs.length} ${
          requiredArgs.length === 1 ? 'argument' : 'arguments'
        } for this command.`
      );
      return false;
    }

    // check if the args are valid
    for (let i = 0; i < args.length; i++) {
      if (requiredArgs[i].type === 'bool') {
        if (!(args[i] === 'true' || args[i] === 'false')) {
          GenericMessage.sendError(
            message,
            command,
            'Non boolean value',
            `Received a non boolean value for boolean argument. Valid boolean values are **true and false**`
          );
          return false;
        }
        parsedArgs.push(args[i] === 'false' ? false : true);
      }

      if (requiredArgs[i].type === 'number') {
        if (isNaN(+args[i])) {
          GenericMessage.sendError(
            message,
            command,
            'Non Number value',
            `Received a non number value for number argument.`
          );
          return false;
        }
        parsedArgs.push(+args[i]);
      }
    }

    return true;
  }

  public async parseCommand(message: Message) {
    const { member, content, guild, channel, author } = message;

    if (message.author.bot) return;

    const args: string[] = content.split(/[ ]+/);
    const name: string | undefined = args?.shift()?.toLowerCase();

    const prefix: string = process.env.DEFAULT_PREFIX || ';';

    if (!name?.startsWith(prefix)) return;

    const command = this.commandMap.get(name.replace(prefix, ''));
    if (!command) return;

    if (!this.validateArgs(command, args, message)) return;

    // execute the command
    const returnMessage = await command.run({
      message,
      channel,
      client: this.client,
      args,
    });

    try {
      if (returnMessage) channel.send(returnMessage);
    } catch (e) {
      console.log(e);
    }
  }
}
