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

    const episodeCount = await page.evaluate(async () => {
      const elArr = Array.from(document.getElementsByClassName('Q5txwe'));
      const dualAudio =
        (elArr[0] as HTMLDivElement)?.innerText
          ?.toLowerCase()
          .includes('dual-audio') || false;

      if (dualAudio) {
        const count = elArr.filter((el: any) =>
          el?.innerText?.toLowerCase()?.includes('dual-audio')
        );

        return count.length > 0
          ? count.length
          : document.getElementsByClassName('iZmuQc')[0].childElementCount;
      }

      return document.getElementsByClassName('iZmuQc')[0].childElementCount;
    });

    await page.close();

    return episodeCount;
  }
}
