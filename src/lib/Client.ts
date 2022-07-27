import Discord, { Intents } from 'discord.js';
import dotenv from 'dotenv';
import Parser from './Parser';
import Logger, { ILogger } from './Logger';
import path from 'path';
import fs from 'fs';
import Database from './Database';

export default class Client {
  private static instance: Client;
  private readonly client: Discord.Client;
  public readonly parser: Parser;
  public readonly database: Database;
  private readonly logger: ILogger = new Logger(this);
  private readonly commandSearchPaths: string[] = [
    path.join(__dirname + '/../commands'),
  ];

  private constructor() {
    // configure env
    dotenv.config();

    this.database = Database.getInstance();
    this.client = new Discord.Client({
      intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
    });
    this.parser = new Parser(this.client, {
      commandSearchPaths: this.commandSearchPaths,
    });

    this.client.on('ready', () => console.log('Ready'));

    this.client.on('messageCreate', message => {
      this.parser.parseCommand(message);
    });
  }

  public async init() {
    await this.database.init();
    this.client.login(process.env.DISCORD_TOKEN);
  }

  public static getInstance(): Client {
    if (!Client.instance) Client.instance = new Client();

    return Client.instance;
  }

  public registerCommandsIn(path: string) {
    if (!fs.lstatSync(path).isDirectory())
      throw new Error('path does not resolved to a directory');
    else
      !this.commandSearchPaths.filter(pathStr => pathStr === path).length &&
        this.commandSearchPaths.push(path) &&
        this.parser.commandSearchPaths.push(path);

    this.parser.constructCommandMap();
  }

  public getClient() {
    return this.client;
  }
}
