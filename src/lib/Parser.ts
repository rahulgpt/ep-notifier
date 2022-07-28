import {
  Client,
  Message,
  GuildMember,
  MessageEmbed,
  MessageManager,
} from 'discord.js';
import Logger, { ILogger } from './Logger';
import { ICommand } from './Command';
import path from 'path';
import fs from 'fs';
import { CommandOptionTypes, ParserOptions } from './types';
import GenericMessage from './GenericMessage';

export default class Parser {
  private readonly client: Client;
  private readonly logger: ILogger;
  private readonly commandMap = new Map<string, ICommand>();
  private readonly aliasMap = new Map<string, string>();
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
      this.commandMap.set(obj.name.toLowerCase(), obj);
      obj.alias.forEach(alias => this.aliasMap.set(alias, obj.name));
    });

    console.log(this.commandMap);

    this.logger.success('Command Map generated!');
  }

  private validateUserPermissions(
    command: ICommand,
    member: GuildMember
  ): boolean {
    if (!command.permissions) return true;

    for (const perm in command.permissions) {
      // if (!member.permissions.has(perm)) return false;
    }

    return true;
  }

  private validateUserRoles(command: ICommand, member: GuildMember): boolean {
    if (!command.roles) return true;
    for (const role in command.roles) {
      if (!member.roles.cache.has(role)) return false;
    }
    return true;
  }

  private validateArgs(
    command: ICommand,
    args: any[],
    message: Message
  ): [boolean, any[]] {
    // reorder args
    const parsedArgs = [];

    const requiredArgs = command.args.filter(el => el.required).length;

    // check for missing args
    if (requiredArgs > args.length) {
      GenericMessage.sendError(
        message,
        command,
        `Missing arguments`,
        `Need ${requiredArgs} ${
          requiredArgs === 1 ? 'more argument' : 'more arguments'
        } for this command.`
      );
      return [false, []];
    }

    // check if the args types are valid
    for (let i = 0; i < args.length && i < command.args.length; i++) {
      if (command.args[i].type === CommandOptionTypes.BOOL) {
        if (!(args[i] === 'true' || args[i] === 'false')) {
          GenericMessage.sendError(
            message,
            command,
            'Non boolean value',
            `Received a non boolean value for boolean argument. Valid boolean values are **true and false**`
          );
          return [false, []];
        }
        parsedArgs.push(args[i] === 'false' ? false : true);
        continue;
      }

      if (command.args[i].type === CommandOptionTypes.NUMBER) {
        if (isNaN(+args[i])) {
          GenericMessage.sendError(
            message,
            command,
            'Non Number value',
            `Received a non number value for number argument.`
          );
          return [false, []];
        }
        parsedArgs.push(+args[i]);
        continue;
      }

      if (command.args[i].type === CommandOptionTypes.KAYO_DRIVE_URL) {
        if (!/drive.google.com/g.test(args[i])) {
          GenericMessage.sendError(
            message,
            command,
            'Bad KayoDriveUrl',
            'Received a non kayo drive url. The url should be a google drive url from kayoanime.com.'
          );
          return [false, []];
        }
        parsedArgs.push(args[i].replace(/<|>/g, ''));
        continue;
      }

      if (command.args[i].type === CommandOptionTypes.GOGO_URL) {
        if (!/gogoanime|category/g.test(args[i])) {
          GenericMessage.sendError(
            message,
            command,
            'Bad GogoAnimeUrl',
            'Received a non gogo anime url. The url should be a gogoanime anime info url, and must container (gogoanime|category).'
          );
          return [false, []];
        }
        parsedArgs.push(args[i].replace(/<|>/g, ''));
        continue;
      }

      parsedArgs.push(args[i].replace(/\s+/g, ''));
    }

    return [true, parsedArgs];
  }

  private async generateHelp(message: Message) {
    let embed = new MessageEmbed({ color: 0xd24d7e, title: 'Help' });

    this.commandMap.forEach(command => {
      let argsString = '';

      command.args.forEach(arg => {
        argsString += `<${arg.name} : ${arg.type}>${arg.required ? '' : '?'} `;
      });

      embed.addField(
        `${process.env.DEFAULT_PREFIX}${command.name} ${argsString}`,
        command.description
      );
    });

    message.channel.send({ embeds: [embed] });
  }

  private async generateDetailHelp(message: Message, command: ICommand) {
    let argsString = '';

    for (let i = 0; i < command.args.length; i++) {
      const arg = command.args[i];
      argsString += `<${arg.name}:${arg.type}>${arg.required ? '' : '?'} `;
    }

    let embed = new MessageEmbed({
      color: 0xd24d7e,
      title: `Help - ${command.name}`,
      description: `${command.description}\n**Format:** \`${
        process.env.DEFAULT_PREFIX
      }${command.name} ${argsString}\`\n**Owner Only:** \`${
        command.ownerOnly
      }\`\n**Prefix:** \`${
        command.alias.length ? command.alias.join(', ') : 'None'
      }\``,
    });

    return message.channel.send({ embeds: [embed] });
  }

  public async parseCommand(message: Message) {
    const { member, content, guild, channel, author } = message;

    if (message.author.bot) return;

    const _args: string[] = content.split(/[ ]+/);
    const name: string | undefined = _args?.shift()?.toLowerCase();

    const prefix: string = process.env.DEFAULT_PREFIX || ';';

    if (!name?.startsWith(prefix)) return;

    if (
      name.replace(prefix, '').toLowerCase() === 'help' ||
      name.replace(prefix, '').toLowerCase() === 'h'
    ) {
      if (_args[0]) {
        if (
          !this.commandMap.has(
            this.aliasMap.get(_args[0].toLowerCase()) || _args[0].toLowerCase()
          )
        ) {
          await channel.send({
            embeds: [
              new MessageEmbed({
                description: `${_args[0]} command does not exist. Type ${prefix}help to see the list of commands`,
                color: 0x2f3136,
              }),
            ],
          });
          return;
        }
        await this.generateDetailHelp(
          message,
          this.commandMap.get(
            this.aliasMap.get(_args[0].toLowerCase()) || _args[0].toLowerCase()
          )!
        );
      } else {
        await this.generateHelp(message);
      }

      return;
    }

    let resolvedName =
      this.aliasMap.get(name.replace(prefix, '')) || name.replace(prefix, '');
    resolvedName = resolvedName.toLowerCase();

    const command = this.commandMap.get(resolvedName);
    if (!command) return;

    if (command.ownerOnly) {
      if (member!?.id !== process.env.OWNER_ID) {
        GenericMessage.sendError(
          message,
          command,
          'Owner Only Command',
          'This command is flagged as owner only.'
        );

        return;
      }
    }

    const [isArgsValid, args] = this.validateArgs(command, _args, message);

    if (!isArgsValid) return;

    // if (!this.validateUserPermissions(command, memeber)) {
    //   return;
    // }

    if (!this.validateUserRoles(command, member!)) {
      GenericMessage.sendError(
        message,
        command,
        'Required Role Not Found',
        'You do not have the required role to execute this command'
      );
      return;
    }

    // execute the command
    const returnMessage = await command.run({
      message,
      channel,
      client: this.client,
      args,
    });

    try {
      if (returnMessage)
        await channel.send({
          embeds: [
            new MessageEmbed({ description: returnMessage, color: 0x2f3136 }),
          ],
        });
    } catch (e) {
      console.error(e);
    }
  }
}
