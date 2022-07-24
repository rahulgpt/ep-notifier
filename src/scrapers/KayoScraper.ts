import { IScraper } from './index';
import Browser from '../lib/Browser';
import { Browser as PBrowser } from 'puppeteer';

export default class KayoScraper implements IScraper {
  private browser: PBrowser;

  constructor() {
    this.browser = Browser.getInstance().getBrowser();
  }

  public async getEpisodeCount(): Promise<number> {
    const page = await this.browser.newPage();
    const navigationPromise = page.waitForNavigation();
    await page.goto(
      'https://drive.google.com/drive/folders/1NOVFn5E6FLs1AzY0nRhobdcxPuBiH4qn'
    );
    await navigationPromise;

    await page.screenshot({ path: 'ss.png' });

    const episodeCount = await page.evaluate(() => {
      return document.getElementsByClassName('iZmuQc')[0].childElementCount;
    });

    await page.close();

    return episodeCount;
  }
}
