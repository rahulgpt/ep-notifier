import chalk from 'chalk';

enum Level {
  Error = 0,
  Warn,
  Info,
  Debug,
}

export interface ILogger {
  error(errString: string): void;
  general(msgString: string): void;
  success(msgString: string): void;
  warning(warnStr: string): void;
}

export default class Logger implements ILogger {
  private level: Level;
  private readonly caller: any;

  constructor(calleInstance: any) {
    this.level = Level.Info;
    this.caller = calleInstance.constructor.name;
  }

  public error(errStr: string) {
    console.error(
      `${chalk.bold('Error')}: ${chalk.red(
        errStr
      )} - ${new Date().toLocaleTimeString('en-GB')} [${this.caller}]`
    );
  }

  public general(msgStr: string) {
    console.log(
      `${chalk.bold('General')}: ${chalk.white(
        msgStr
      )} - ${new Date().toLocaleTimeString('en-GB')} [${this.caller}]`
    );
  }

  public warning(warnStr: string) {
    console.log(
      `${chalk.bold('Warning')}: ${chalk.yellow(
        warnStr
      )} - ${new Date().toLocaleTimeString('en-GB')} [${this.caller}]`
    );
  }

  public success(msgStr: string) {
    console.log(
      `${chalk.bold('Success')}: ${chalk.green(
        msgStr
      )} - ${new Date().toLocaleTimeString('en-GB')} [${this.caller}]`
    );
  }
}
