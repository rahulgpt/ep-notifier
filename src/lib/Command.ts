import {
  CommandOptions,
  CommandArgType,
  CommandCallbackArguments,
} from './types';

export interface ICommand {
  readonly name: string;
  readonly description: string;
  readonly args: CommandArgType[];

  run(args: CommandCallbackArguments): Promise<string | void>;
}

export default class Command implements ICommand {
  public static id: number = 100;
  public readonly id: number;
  public readonly name: string;
  public readonly description: string = '';
  public readonly args: CommandArgType[];

  constructor(options: CommandOptions) {
    this.id = ++Command.id;

    this.name = options.name;
    this.args = options.args;
    this.description = options.description || this.description;
  }

  public async run(args: CommandCallbackArguments): Promise<string | void> {}
}
