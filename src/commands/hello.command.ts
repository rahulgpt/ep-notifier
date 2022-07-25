import { Command } from '../lib';

export default class Hello extends Command {
  constructor() {
    super({
      name: 'hello',
      description: 'Reply with hello in Japanese',
      args: [],
    });
  }

  public async run() {
    return "Kon'nichiwa 👋";
  }
}
