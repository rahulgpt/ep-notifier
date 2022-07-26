import {
  CommandOptions,
  CommandArgType,
  CommandCallbackArguments,
} from './types';

export interface ICommand {
  readonly name: string;
  readonly description: string;
  readonly args: CommandArgType[];
  readonly roles: string[];
  readonly permissions: string[];
  readonly ownerOnly: boolean;
  readonly alias: string[];

  run(args: CommandCallbackArguments): Promise<string | void>;
}

export default class Command implements ICommand {
  public static id: number = 100;
  public readonly id: number;
  public readonly name: string;
  public readonly description: string = '';
  public readonly args: CommandArgType[];
  public readonly roles;
  public readonly permissions;
  public readonly ownerOnly;
  public readonly alias;

  constructor(options: CommandOptions) {
    this.id = ++Command.id;

    this.name = options.name;
    this.args = options.args || [];
    this.description = options.description || this.description;
    this.roles = options.roles || [];
    this.permissions = options.permissions || [];
    this.ownerOnly = options.ownerOnly || false;
    this.alias = options.alias || [];
  }

  public async run(args: CommandCallbackArguments): Promise<string | void> {}
}
