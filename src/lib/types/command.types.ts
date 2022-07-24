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
  name: string;
  description?: string;
  args: CommandArgType[];
  clientPermissions?: string[];
  requiredRoles?: string[];
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
  URL = 'url',
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
  args: string[];
};
