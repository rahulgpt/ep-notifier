import mongoose from 'mongoose';
import Logger, { ILogger } from './Logger';

export default class Database {
  private static instance: Database;
  private readonly logger: ILogger = new Logger(this);

  private constructor() {}

  public static getInstance(): Database {
    if (!Database.instance) Database.instance = new Database();

    return Database.instance;
  }

  public async init() {
    try {
      await mongoose.connect(process.env.MONGO_URI!);
      this.logger.success('Connected to database.');
    } catch (err) {
      this.logger.error('Error while connecting to database');
      console.error(err);
    }
  }
}
