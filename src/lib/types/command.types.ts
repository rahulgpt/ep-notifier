import {
  Message,
  Client,
  DMChannel,
  NewsChannel,
  PartialDMChannel,
  TextChannel,
  ThreadChannel,
} from 'discord.js';

export type CommandOptions = {
  ownerOnly?: boolean;
  permissions?: string[];
  roles?: string[];
  name: string;
  description?: string;
  args: CommandArgType[];
};

export type CommandArgType = {
  name: string;
  type: CommandOptionTypes;
  required: boolean;
};

export enum CommandOptionTypes {
  STRING = 'string',
  NUMBER = 'number',
  BOOL = 'bool',
  KAYO_DRIVE_URL = 'kayoDriveUrl',
  GOGO_URL = 'gogoUrl',
}

export type CommandCallbackArguments = {
  message: Message;
  channel:
    | DMChannel
    | PartialDMChannel
    | NewsChannel
    | TextChannel
    | ThreadChannel;
  client: Client;
  args: any[];
};
