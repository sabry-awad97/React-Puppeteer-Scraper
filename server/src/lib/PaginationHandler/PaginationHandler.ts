import axios from 'axios';
import { ElementHandle, Page } from 'puppeteer';

import { checkRateLimit } from '../../helpers/checkRateLimit/checkRateLimit.js';
import { classNameToSelector } from '../../helpers/classNameToSelector/classNameToSelector.js';
import { retry } from '../../helpers/retry/retry.js';
import {
  IRecord,
  IWebsiteTemplate,
  PageEvents,
  ScraperEvents,
} from '../../types/index.js';
import { DataHandler } from '../DataHandler.js';
import { ElementDataExtractor } from './streams/ElementDataExtractor.js';
import { DataSink } from './streams/DataSink.js';
import { ElementDataSource } from './streams/ElementDataSource.js';
import { includes } from '../../helpers/includes/index.js';

export class PaginationHandler {
  private data: IRecord[] = [];

  private prevDataLength: number = 0;
  constructor(
    private readonly page: Page,
    private website: IWebsiteTemplate,
    private dataHandler: DataHandler
  ) {}

  async getTitle() {
    let title = (await this.page.title()) || '';
    title = title.replace(/\r?\n|\r/g, '').trim();
    return title;
  }

  getUrl() {
    return this.page.url();
  }

  async updateData() {
    const screenshot = await this.page.screenshot();
    this.dataHandler.emit(PageEvents.PageScreenShot, screenshot);
    const newData = await this.getNewElementData();
    for (const record of newData) {
      if (!includes(this.data, record)) {
        this.data.push(record);
      }
    }
    this.dataHandler.emit(PageEvents.PageData, this.data);
  }

  async handle() {
    this.dataHandler.emit(PageEvents.PageStart);

    await this.checkBlocking();
    try {
      await this.updateData();
      this.prevDataLength = this.data.length;

      let counter = 0;
      while (await this.hasNextPage()) {
        try {
          await this.goToNextPage();
          await this.updateData();
        } catch (error) {
          this.dataHandler.emit('error', error);
        }

        if (this.prevDataLength === this.data.length) {
          counter++;
        } else {
          this.prevDataLength = this.data.length;
          counter = 0;
        }

        if (counter >= 5) {
          console.log(
            'No new data found for 5 consecutive times. Please manually check the page using ChromeDriver'
          );
          this.dataHandler.emit(PageEvents.Page5Runs, this.data);
          break;
        }
      }

      this.dataHandler.emit(PageEvents.PageEnd, this.data);

      const cleanedData = this.dataHandler.cleanData(this.data);
      await this.dataHandler.saveToMongo(cleanedData);
      return cleanedData;
    } catch (error) {
      this.dataHandler.emit(ScraperEvents.Error, error);
      return [];
    }
  }

  private async checkBlocking() {
    try {
      const response = await axios.get(this.getUrl());
      console.log('Response Status', response.status);

      if ([403, 404, 429, 503].includes(response.status)) {
        console.log(
          'The website is blocking the scraper, please check the IP address or use a proxy'
        );
      }
    } catch (error) {
      console.error(`Error checking for blocking: ${error}`);
      this.dataHandler.emit(ScraperEvents.Error, error);
    }
  }

  private async hasNextPage() {
    const { nextButton, showMoreButton } = this.website;
    return (
      (await this.hasButton(nextButton)) ||
      (await this.hasButton(showMoreButton))
    );
  }

  private async goToNextPage() {
    const { nextButton, showMoreButton } = this.website;
    let button = (await this.hasButton(showMoreButton))
      ? showMoreButton
      : nextButton;
    if (!button) return;

    const selector = classNameToSelector(button) as string;

    try {
      await retry(async () => {
        await checkRateLimit();
        await this.handleElementClick(this.page, selector);
        this.dataHandler.emit(PageEvents.PageNext, button);
      });
    } catch (error) {
      console.error(`Error clicking element "${button}": ${error}`);
      this.dataHandler.emit(ScraperEvents.Error, error);
    }
  }

  private async hasButton(className: string | null) {
    const selector = classNameToSelector(className);
    if (!selector) return false;

    const btn = await this.page.$(selector);
    if (!btn) return false;

    const isDisabled = await btn.evaluate(el => el.hasAttribute('disabled'));
    const isHidden = await btn.evaluate(el => el.hasAttribute('hidden'));

    return !isDisabled && !isHidden;
  }

  private async handleElementClick(page: Page, selector: string) {
    await page.waitForSelector(selector, {
      timeout: 5000,
      visible: true,
    });

    await page.click(selector);
    await this.page.waitForNetworkIdle();
  }

  getNewElementData() {
    return this.parseElementsWithStreams();
  }

  async findCommonAncestor(
    ...elementHandles: ElementHandle[]
  ): Promise<ElementHandle | null> {
    const result = await this.page.evaluateHandle((...handles) => {
      let ancestors = new Set<Node | null>();
      let currentNode: Node | null = handles[0];
      let found = false;
      while (currentNode) {
        ancestors.add(currentNode);
        currentNode = currentNode.parentNode;
      }
      let commonAncestor: Node | null = null;
      for (let i = 1; i < handles.length; i++) {
        currentNode = handles[i];
        while (currentNode) {
          if (ancestors.has(currentNode)) {
            if (!found) {
              found = true;
              commonAncestor = currentNode;
            } else {
              ancestors.clear();
              ancestors.add(commonAncestor);
              currentNode = commonAncestor;
            }
          }
          currentNode = currentNode ? currentNode.parentNode : null;
        }
      }
      return commonAncestor;
    }, ...elementHandles);

    return result.asElement() as ElementHandle<Element>;
  }

  private parseElementsWithStreams() {
    const { reviewElement, nextButton, fieldData } = this.website;
    const parentSelector = classNameToSelector(reviewElement);
    const scrapedData: IRecord[] = [];

    if (!parentSelector) {
      throw new Error(`Invalid class name: ${reviewElement}`);
    }

    return new Promise<IRecord[]>(async (resolve, reject) => {
      await this.page.$$(parentSelector).then(async parentElements => {
        const elementsToProcess = parentElements.slice(
          nextButton ? 0 : this.prevDataLength
        );

        const elementsStream = new ElementDataSource(elementsToProcess);
        const elementDataStream = new ElementDataExtractor(
          fieldData,
          this.getUrl(),
          await this.getTitle()
        );
        const resultsStream = new DataSink(scrapedData, resolve, reject);

        elementsStream.pipe(elementDataStream).pipe(resultsStream);
      });
    });
  }
}
