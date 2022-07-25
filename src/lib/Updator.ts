import chalk from 'chalk';
import Client from './Client';

export default class Updator {
  private readonly client: Client = Client.getInstance();

  public update(title: string, count: number) {}
}
