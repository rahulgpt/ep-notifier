import puppeteer from 'puppeteer-extra';
import { Browser as PBrowser } from 'puppeteer';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import Logger, { ILogger } from './Logger';

export default class Browser {
  private static instance: Browser;
  private browser!: PBrowser;
  private readonly logger: ILogger = new Logger(this);

  private constructor() {
    puppeteer.use(StealthPlugin());
  }

  private async login() {
    const page = await this.browser.newPage();
    const navigationPromise = page.waitForNavigation();
    await page.goto('https://accounts.google.com/');
    await navigationPromise;

    await page.waitForSelector('input[type="email"]');
    await page.click('input[type="email"]');
    await navigationPromise;

    await page.type('input[type="email"]', process.env.G_EMAIL!);
    await page.waitForSelector('#identifierNext');
    await page.click('#identifierNext');

    await page.waitForTimeout(3000);
    await page.waitForSelector('input[type="password"]');
    await page.click('input[type="password"]');
    await page.waitForTimeout(500);

    await page.type('input[type="password"]', process.env.G_PASSWORD!);
    await page.waitForSelector('#passwordNext');
    await page.click('#passwordNext');
  }

  public static getInstance(): Browser {
    if (!Browser.instance) Browser.instance = new Browser();

    return Browser.instance;
  }

  public async init() {
    this.browser = await puppeteer.launch({
      headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    try {
      await this.login();
      console.log('logged in');
    } catch (e) {
      this.logger.error('Account login failed!');
      console.error(e);
    }
  }

  public getBrowser(): PBrowser {
    return this.browser;
  }
}
