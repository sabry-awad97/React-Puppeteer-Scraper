import { Browser, launch } from 'puppeteer';

import { IWebsiteTemplate, ScraperEvents } from '../types/index.js';

import { PaginationHandler } from './PaginationHandler/PaginationHandler.js';
import { TaskQueue } from './TaskQueue/TaskQueue.js';
import { DataHandler } from './DataHandler.js';

export class ParallelScraper {
  private paginationHandler!: PaginationHandler;
  private readonly taskQueue: TaskQueue<void>;
  private browser!: Browser;

  constructor(private concurrency: number, private dataHandler: DataHandler) {
    this.taskQueue = new TaskQueue(concurrency);
  }

  public async start() {
    try {
      this.browser = await launch({
        headless: true,
        defaultViewport: null,
        timeout: 0,
        args: ['--start-maximized'],
      });

      this.dataHandler.emit(ScraperEvents.BrowserStart);
    } catch (error) {
      this.dataHandler.emit(ScraperEvents.Error, error);
    }
  }

  public async close() {
    try {
      await this.browser.close();
      this.dataHandler.emit(ScraperEvents.BrowserClose);
    } catch (error) {
      this.dataHandler.emit(ScraperEvents.Error, error);
    }
  }

  async scrapeWebsite(website: IWebsiteTemplate) {
    for (const url of website.urls) {
      this.taskQueue.add(() => this.scrapeUrl(url, website));
    }
    await this.taskQueue.run();
  }

  async scrapeUrl(url: string, website: IWebsiteTemplate) {
    const page = await this.browser.newPage();
    this.paginationHandler = new PaginationHandler(
      page,
      website,
      this.dataHandler
    );

    try {
      await page.goto(url, { timeout: 0 });
      await this.paginationHandler.handle();
    } catch (error) {
      this.dataHandler.emit(ScraperEvents.Error, error);
    }
  }
}
