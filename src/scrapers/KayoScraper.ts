import { IScraper } from './index';
import Browser from '../lib/Browser';
import { Browser as PBrowser } from 'puppeteer';

export default class KayoScraper implements IScraper {
  private static instance: KayoScraper;
  private browser: PBrowser;

  private constructor() {
    this.browser = Browser.getInstance().getBrowser();
  }

  public static getInstance() {
    if (!KayoScraper.instance) KayoScraper.instance = new KayoScraper();

    return KayoScraper.instance;
  }

  public async getEpisodeCount(url: string): Promise<number> {
    const page = await this.browser.newPage();
    const navigationPromise = page.waitForNavigation();
    await page.goto(url);
    await navigationPromise;

    const episodeCount = await page.evaluate(() => {
      return document.getElementsByClassName('iZmuQc')[0].childElementCount;
    });

    await page.close();

    return episodeCount;
  }
}
