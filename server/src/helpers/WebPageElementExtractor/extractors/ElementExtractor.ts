import { Page } from 'puppeteer';

export abstract class ElementExtractor<T> {
  protected readonly _page: Page;

  constructor(page: Page) {
    this._page = page;
  }

  abstract extract(): Promise<T[]>;
}
