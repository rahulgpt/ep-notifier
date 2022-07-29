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
    await page.waitForSelector('div.h-sb-Ic.h-R-w-d-ff', { visible: true });

    const episodeCount = await page.evaluate(async () => {
      // Check if the anime drive has a dual audio banner
      const dualAudioBanner = (
        document.getElementsByClassName(
          'h-sb-Ic h-R-w-d-ff'
        )[0] as HTMLDivElement
      )?.innerText
        ?.toLowerCase()
        ?.includes('dual-audio');

      if (dualAudioBanner) {
        const elArr = Array.from(document.getElementsByClassName('Q5txwe'));
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
